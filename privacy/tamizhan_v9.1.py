# ╔══════════════════════════════════════════════════════════════════════╗
# ║   TAMIZHAN MOVIES — ULTRA DOWNLOADER + AUTO-FIX  v9.1                ║
# ║   Menu [1] Download→Fix→Upload  [2] Direct ZIP  [3] GDrive ZIP       ║
# ║   [4] GDrive Clone→Remux→Patch  [5] Folder/File Auto-Fix             ║
# ║   [6] Manual Edit Tracks→Remux→Upload                                ║
# ║   v9.1: ⚡ Smart remux skip  🔁 Resume broken downloads              ║
# ╚══════════════════════════════════════════════════════════════════════╝

import copy
import hashlib
import json
import os
import re
import shutil
import subprocess
import threading
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.parse import unquote, urlparse

import requests


# ══════════════════════════════════════════════════════════════════════
#  GOOGLE DRIVE MOUNT
# ══════════════════════════════════════════════════════════════════════
try:
    from google.colab import drive as _drv
    if not Path("/content/drive/MyDrive").exists():
        print("📂 Mounting Google Drive...")
        _drv.mount("/content/drive")
    else:
        print("✅ Drive already mounted.")
except Exception as _e:
    print(f"⚠ Drive mount skipped: {_e}")


# ══════════════════════════════════════════════════════════════════════
#  CONFIGURATION
# ══════════════════════════════════════════════════════════════════════
FOLDER          = "/content/drive/MyDrive/Tamizhan Movies"
LANG_ORDER      = ["tam", "tel", "mal", "kan", "hin", "eng", "und"]
KEEP_SUB_LANGS  = {"tam", "tel", "mal", "kan", "hin", "eng"}  # subtitles to keep
THREADS         = 32
STREAM_CONNS    = 8
CHUNK_MB        = 16
MAX_RETRY       = 3
TIMEOUT         = (10, 300)

DL_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/126.0.0.0 Safari/537.36"
    )
}

# Shared HTTP session with connection pooling
_SESSION = requests.Session()
_SESSION.headers.update(DL_HEADERS)
_adapter = requests.adapters.HTTPAdapter(
    pool_connections=64, pool_maxsize=64, max_retries=0
)
_SESSION.mount("http://",  _adapter)
_SESSION.mount("https://", _adapter)

os.makedirs(FOLDER, exist_ok=True)


# ══════════════════════════════════════════════════════════════════════
#  ANSI COLOUR CODES
# ══════════════════════════════════════════════════════════════════════
G = "\033[92m"   # Green
Y = "\033[93m"   # Yellow
R = "\033[91m"   # Red
C = "\033[96m"   # Cyan
W = "\033[97m"   # White
D = "\033[2m"    # Dim
M = "\033[95m"   # Magenta
B = "\033[94m"   # Blue
X = "\033[0m"    # Reset


# ══════════════════════════════════════════════════════════════════════
#  KEEP-ALIVE THREAD  (prevents Colab session timeout)
# ══════════════════════════════════════════════════════════════════════
def _keepalive_loop():
    """Sleep in a daemon thread — keeps the Python process alive to prevent Colab timeout."""
    while True:
        time.sleep(30)


if not globals().get("_KA"):
    _KA = True
    threading.Thread(target=_keepalive_loop, daemon=True).start()
    print(f"{G}✔ Keep-alive started.{X}")


# ══════════════════════════════════════════════════════════════════════
#  UTILITY FUNCTIONS
# ══════════════════════════════════════════════════════════════════════
def _fmt_size(b):
    """Format bytes into a human-readable string."""
    for unit in ("B", "KB", "MB", "GB"):
        if b < 1024:
            return f"{b:.1f} {unit}"
        b /= 1024
    return f"{b:.1f} TB"


def _fmt_eta(seconds):
    """Format seconds into HH:MM:SS or MM:SS string."""
    if seconds <= 0 or seconds > 86400:
        return "--:--"
    m, s = divmod(int(seconds), 60)
    h, m = divmod(m, 60)
    return f"{h}:{m:02d}:{s:02d}" if h else f"{m}:{s:02d}"


def _lang_pri(lang):
    """Return sort priority for a language code (lower = higher priority)."""
    try:
        return LANG_ORDER.index(lang.lower().strip())
    except ValueError:
        return len(LANG_ORDER)


# Language normalisation map — ISO 639-2 three-letter codes
_LANG_NORM = {
    "tamil": "tam",      "ta": "tam",
    "telugu": "tel",     "te": "tel",
    "hindi": "hin",      "hi": "hin",
    "malayalam": "mal",  "ml": "mal",
    "kannada": "kan",    "kn": "kan",
    "english": "eng",    "en": "eng",
    "bengali": "ben",    "bn": "ben",
    "marathi": "mar",    "mr": "mar",
    "punjabi": "pan",    "pa": "pan",
    "gujarati": "guj",   "gu": "guj",
    "odia": "ori",       "or": "ori",
    "urdu": "urd",       "ur": "urd",
    "nepali": "nep",     "ne": "nep",
    "japanese": "jpn",   "ja": "jpn",
    "chinese": "chi",    "zh": "chi",
    "korean": "kor",     "ko": "kor",
    "french": "fre",     "fr": "fre",
    "spanish": "spa",    "es": "spa",
    "german": "ger",     "de": "ger",
    "portuguese": "por", "pt": "por",
    "russian": "rus",    "ru": "rus",
    "arabic": "ara",     "ar": "ara",
    "thai": "tha",       "th": "tha",
    "indonesian": "ind", "id": "ind",
    "malay": "may",      "ms": "may",
    "undetermined": "und",
    "unknown": "und",
    "none": "und",
}


def _norm_lang(lang):
    """Normalise any language string to a 3-letter ISO code."""
    if not lang:
        return "und"
    key = lang.lower().strip()
    # Already a valid 3-letter code?
    if len(key) == 3 and key.isalpha():
        return key
    return _LANG_NORM.get(key, "und")


def _filter_subs(sub_tracks):
    """
    Keep only subtitle tracks whose language is in KEEP_SUB_LANGS
    (Tamil, Telugu, Malayalam, Kannada, Hindi, English).
    Drops all other languages (Japanese, Chinese, Arabic, etc.).
    """
    return [s for s in sub_tracks if _norm_lang(s.get("language", "und")) in KEEP_SUB_LANGS]


def _clean_site_prefix(name):
    """Strip leading site-name prefixes like 'www.example.com - '."""
    cleaned = re.sub(
        r'^(?:www\.)?[A-Za-z0-9_-]+\.[A-Za-z]{2,6}[\s_-]+', '', name
    ).strip(" -_")
    return cleaned if cleaned else name


def _clean_filename(name):
    """Remove site prefix from a full filename, preserving extension."""
    ext  = Path(name).suffix
    stem = _clean_site_prefix(Path(name).stem)
    return (stem + ext).strip() if stem else name


def _safe_name(url):
    """
    Derive a safe, filesystem-friendly filename from a URL.
    Falls back to an MD5-based name if the URL path is ambiguous.
    Caps total filename length at 200 characters.
    """
    parsed = urlparse(url)

    # Google CDN URLs have no meaningful path component
    if "googleusercontent.com" in parsed.netloc:
        return f"google_cdn_{hashlib.md5(url.encode()).hexdigest()[:16]}.mkv"

    try:
        name = Path(unquote(parsed.path)).name
    except Exception:
        name = ""

    name = re.sub(r'[/:*?"<>|]', "_", name).strip(". ")

    if not name or len(name) < 4:
        name = f"download_{hashlib.md5(url.encode()).hexdigest()[:16]}.mkv"

    ext  = Path(name).suffix.lower()
    stem = _clean_site_prefix(Path(name).stem)
    name = (stem + ext) if stem else name

    # Ensure a known media / archive extension
    _PRESERVE = {
        ".zip", ".rar", ".7z", ".tar", ".gz",
        ".mkv", ".mp4", ".avi", ".mov", ".ts", ".m4v", ".webm",
    }
    if Path(name).suffix.lower() not in _PRESERVE:
        name += ".mkv"

    # Enforce 200-char cap
    ext  = Path(name).suffix.lower()
    stem = Path(name).stem
    max_bytes = 200 - len(ext.encode())
    stem_bytes = stem.encode("utf-8")
    if len(stem_bytes) > max_bytes:
        h    = hashlib.md5(url.encode()).hexdigest()[:8]
        stem = stem_bytes[:max_bytes - 9].decode("utf-8", "ignore").rstrip() + "_" + h

    return stem + ext


# ══════════════════════════════════════════════════════════════════════
#  LIVE PROGRESS BAR
# ══════════════════════════════════════════════════════════════════════
class LiveBar:
    """Thread-safe animated progress bar with speed and ETA display."""

    BAR_WIDTH = 28

    def __init__(self, total_bytes, label="", phase=""):
        self.total  = max(total_bytes, 1)
        self.label  = label[:26]
        self.phase  = phase
        self.done   = 0
        self._lock  = threading.Lock()
        self._t0    = time.time()
        self._lb    = 0
        self._lt    = time.time()
        self._spd   = 0.0
        self._alive = True
        threading.Thread(target=self._loop, daemon=True).start()

    def update(self, n):
        """Add n bytes to the completed count and refresh speed."""
        with self._lock:
            self.done += n
            now = time.time()
            dt  = now - self._lt
            if dt >= 0.25:
                self._spd = (self.done - self._lb) / dt
                self._lb  = self.done
                self._lt  = now

    def _loop(self):
        while self._alive:
            self._draw()
            time.sleep(0.2)

    def _draw(self):
        with self._lock:
            pct    = min(self.done / self.total, 1.0)
            filled = int(self.BAR_WIDTH * pct)
            bar    = f"{G}{'▣' * filled}{D}{'▢' * (self.BAR_WIDTH - filled)}{X}"
            spd    = self._spd
            spd_s  = f"{spd / 1_048_576:7.1f} MB/s" if spd > 0 else "    ?.? MB/s"
            eta    = (self.total - self.done) / spd if spd > 0 else 0
            ela    = int(time.time() - self._t0)
            ph     = f" {D}{self.phase}{X}" if self.phase else ""
            print(
                f"\r  {C}{self.label:<26}{X}{ph} [{bar}] "
                f"{pct * 100:5.1f}%  {_fmt_size(self.done)}/{_fmt_size(self.total)}  "
                f"{Y}{spd_s}{X}  ETA {_fmt_eta(eta)}  {ela}s   ",
                end="", flush=True,
            )

    def finish(self, ok=True):
        self._alive = False
        time.sleep(0.25)
        ela = time.time() - self._t0
        avg = self.total / ela / 1_048_576 if ela else 0
        ph  = f" {D}{self.phase}{X}" if self.phase else ""
        st  = f"{G}✔ Done{X}" if ok else f"{R}✘ Failed{X}"
        print(
            f"\r  {C}{self.label:<26}{X}{ph}  {st}  "
            f"{_fmt_size(self.total)}  avg {avg:.1f} MB/s  {int(ela)}s          "
        )


# ══════════════════════════════════════════════════════════════════════
#  TOOL INSTALLATION  (mkvtoolnix, ffmpeg)
# ══════════════════════════════════════════════════════════════════════
def _install_tools():
    """Install mkvmerge and ffmpeg via apt if not already present. Returns True on success."""
    ok = True
    for pkg, apt_pkg in [("mkvmerge", "mkvtoolnix"), ("ffmpeg", "ffmpeg")]:
        if shutil.which(pkg):
            print(f"{G}✔ {pkg} ready.{X}")
        else:
            print(f"{Y}📦 Installing {pkg}...{X}", end="", flush=True)
            r = subprocess.run(
                ["apt-get", "install", "-y", "-q", apt_pkg],
                capture_output=True, text=True,
            )
            if r.returncode == 0:
                print(f"\r{G}✔ {pkg} installed.        {X}")
            else:
                print(f"\r{R}✘ {pkg} install failed.{X}")
                ok = False
    return ok


def _ensure_unzip():
    """Install unzip via apt if not already present."""
    if not shutil.which("unzip"):
        r = subprocess.run(
            ["apt-get", "install", "-y", "-q", "unzip"],
            capture_output=True, text=True,
        )
        print(f"{G}✔ unzip ready.{X}" if r.returncode == 0
              else f"{R}✘ unzip install failed.{X}")


# ══════════════════════════════════════════════════════════════════════
#  GOOGLE AUTH + TOKEN
# ══════════════════════════════════════════════════════════════════════
_AUTH_DONE = False
_AUTH_LOCK = threading.Lock()


def _colab_auth():
    """Authenticate with Google once per session (thread-safe)."""
    global _AUTH_DONE
    with _AUTH_LOCK:
        if not _AUTH_DONE:
            try:
                from google.colab import auth as _ca
                _ca.authenticate_user()
                _AUTH_DONE = True
                print(f"{G}✔ Google auth complete.{X}")
            except Exception as e:
                print(f"{Y}⚠ Auth failed: {e}{X}")


def _token():
    """Return a fresh Google OAuth2 access token via gcloud."""
    _colab_auth()
    try:
        return subprocess.check_output(
            ["gcloud", "auth", "print-access-token"],
            stderr=subprocess.DEVNULL, timeout=15,
        ).decode().strip()
    except subprocess.CalledProcessError as e:
        raise RuntimeError(f"gcloud token fetch failed (exit {e.returncode})") from e


# ══════════════════════════════════════════════════════════════════════
#  GOOGLE DRIVE API HELPERS
# ══════════════════════════════════════════════════════════════════════
_DRIVE_PARAMS = {
    "supportsAllDrives":        "true",
    "includeItemsFromAllDrives": "true",
}

_FOLDER_ID_CACHE = None


def _drive_get(path, params=None, tok=None):
    """Perform a GET request against the Drive v3 API."""
    if tok is None:
        tok = _token()
    return _SESSION.get(
        f"https://www.googleapis.com/drive/v3/{path}",
        params={**_DRIVE_PARAMS, **(params or {})},
        headers={"Authorization": f"Bearer {tok}"},
        timeout=15,
    )


def _get_fname(fid):
    """Return the Drive filename for a given file ID, or None on failure."""
    try:
        r = _drive_get(f"files/{fid}", {"fields": "name"})
        if r.status_code == 200:
            return r.json().get("name")
    except Exception:
        pass
    return None


def _get_folder_id(tok):
    """
    Resolve the Drive folder ID for FOLDER by walking its path components.
    Result is cached after the first successful lookup.
    """
    global _FOLDER_ID_CACHE
    if _FOLDER_ID_CACHE:
        return _FOLDER_ID_CACHE

    try:
        rel   = Path(FOLDER).relative_to("/content/drive/MyDrive")
        parts = list(rel.parts)
    except ValueError:
        parts = [Path(FOLDER).name]

    parent = "root"
    for part in parts:
        q = (
            f"name='{part}' and mimeType='application/vnd.google-apps.folder'"
            f" and '{parent}' in parents and trashed=false"
        )
        fid = None
        for attempt in range(1, 4):
            try:
                r = _SESSION.get(
                    "https://www.googleapis.com/drive/v3/files",
                    params={**_DRIVE_PARAMS, "q": q,
                            "fields": "files(id,name)", "pageSize": "10"},
                    headers={"Authorization": f"Bearer {tok}"},
                    timeout=15,
                )
                if r.status_code == 200:
                    candidates = r.json().get("files", [])
                    if candidates:
                        fid = candidates[0]["id"]
                    break
                if r.status_code == 401:
                    tok = _token()
            except Exception:
                pass
            time.sleep(attempt)
        if not fid:
            return None
        parent = fid

    _FOLDER_ID_CACHE = parent
    return parent


def _resolve_folder_id_via_file(tok):
    """
    Fallback: locate the Drive folder ID by finding an existing video file
    in the FUSE-mounted FOLDER and querying its parent ID.
    """
    try:
        exts   = {".mkv", ".mp4", ".avi", ".mov", ".ts", ".m4v", ".webm"}
        sample = next(
            (f for f in Path(FOLDER).iterdir()
             if f.is_file() and f.suffix.lower() in exts),
            None,
        )
        if not sample:
            return None
        r = _SESSION.get(
            "https://www.googleapis.com/drive/v3/files",
            params={**_DRIVE_PARAMS,
                    "q":      f"name='{sample.name}' and trashed=false",
                    "fields": "files(id,parents)",
                    "pageSize": "5"},
            headers={"Authorization": f"Bearer {tok}"},
            timeout=15,
        )
        if r.status_code == 200:
            for f in r.json().get("files", []):
                if f.get("parents"):
                    return f["parents"][0]
    except Exception:
        pass
    return None


def _extract_fid(url):
    """Extract a Google Drive file ID from any share/view URL."""
    for pattern in [
        r"/file/d/([a-zA-Z0-9_-]{20,})",
        r"[?&]id=([a-zA-Z0-9_-]{20,})",
        r"/d/([a-zA-Z0-9_-]{20,})",
    ]:
        m = re.search(pattern, url)
        if m:
            return m.group(1)
    return None


def _list_videos_in_drive_folder(folder_fid, tok):
    """Return a list of video file metadata dicts inside a Drive folder."""
    VIDEO_MIME = (
        "mimeType='video/x-matroska' or mimeType='video/mp4' "
        "or mimeType='video/x-msvideo' or mimeType='video/quicktime' "
        "or mimeType='video/mp2t' or mimeType='video/webm' or mimeType='video/x-m4v'"
    )
    q     = (f"(({VIDEO_MIME}) or fileExtension='mkv' or fileExtension='mp4')"
             f" and '{folder_fid}' in parents and trashed=false")
    files = []
    page_token = None
    while True:
        params = {**_DRIVE_PARAMS,
                  "q": q,
                  "fields": "nextPageToken,files(id,name,size)",
                  "pageSize": "100"}
        if page_token:
            params["pageToken"] = page_token
        r = _SESSION.get(
            "https://www.googleapis.com/drive/v3/files",
            params=params,
            headers={"Authorization": f"Bearer {tok}"},
            timeout=20,
        )
        if r.status_code != 200:
            break
        data = r.json()
        files.extend(data.get("files", []))
        page_token = data.get("nextPageToken")
        if not page_token:
            break
    return files


def _create_drive_folder(folder_name, parent_id, tok):
    """Create a new folder inside parent_id and return the new folder ID."""
    try:
        r = _SESSION.post(
            "https://www.googleapis.com/drive/v3/files",
            params={"supportsAllDrives": "true"},
            headers={"Authorization": f"Bearer {tok}",
                     "Content-Type": "application/json"},
            json={
                "name":     folder_name,
                "mimeType": "application/vnd.google-apps.folder",
                "parents":  [parent_id],
            },
            timeout=20,
        )
        if r.status_code in (200, 201):
            new_id = r.json().get("id")
            print(f"  {G}✔ Drive folder created: {folder_name!r} (id={new_id[:20]}){X}")
            return new_id
        print(f"  {R}✘ Folder creation failed (HTTP {r.status_code}){X}")
    except Exception as e:
        print(f"  {R}✘ Folder creation error: {e}{X}")
    return None


# ── Recursive folder listing (used by Menu [4]) ───────────────────────
_VIDEO_MIMES = {
    "video/x-matroska", "video/mp4", "video/avi", "video/quicktime",
    "video/x-msvideo",  "video/MP2T", "video/webm", "video/x-m4v",
    "video/mpeg",        "application/octet-stream",
}
_VIDEO_EXTS = {".mkv", ".mp4", ".avi", ".mov", ".ts", ".m4v", ".webm", ".mpeg", ".mpg"}


def _is_video_file(fi):
    if fi.get("mimeType", "") in _VIDEO_MIMES:
        return True
    return Path(fi.get("name", "")).suffix.lower() in _VIDEO_EXTS


def _gdrive_list_folder_recursive(folder_fid, tok, _prefix=""):
    """Walk a Drive folder tree recursively and return all non-folder items."""
    items      = []
    page_token = None
    while True:
        params = {
            **_DRIVE_PARAMS,
            "q":       f"'{folder_fid}' in parents and trashed=false",
            "fields":  "nextPageToken,files(id,name,size,mimeType)",
            "pageSize": "200",
            "orderBy":  "name",
        }
        if page_token:
            params["pageToken"] = page_token
        r = _SESSION.get(
            "https://www.googleapis.com/drive/v3/files",
            params=params,
            headers={"Authorization": f"Bearer {tok}"},
            timeout=20,
        )
        if r.status_code != 200:
            break
        data = r.json()
        for f in data.get("files", []):
            if f["mimeType"] == "application/vnd.google-apps.folder":
                items.extend(
                    _gdrive_list_folder_recursive(
                        f["id"], tok, f"{_prefix}{f['name']}/"
                    )
                )
            else:
                items.append({
                    "fid":      f["id"],
                    "name":     f["name"],
                    "size":     int(f.get("size", 0)),
                    "mimeType": f.get("mimeType", ""),
                    "rel_path": f"{_prefix}{f['name']}",
                })
        page_token = data.get("nextPageToken")
        if not page_token:
            break
    return items


# ══════════════════════════════════════════════════════════════════════
#  DRIVE UPLOAD  (resumable API — Maximum Speed)
# ══════════════════════════════════════════════════════════════════════
def _start_resumable_session(tok, mime, file_size, file_name, file_id, folder_id):
    """Initiate a Drive resumable upload session. Returns the upload URL or None."""
    if file_id:
        url    = (f"https://www.googleapis.com/upload/drive/v3/files/{file_id}"
                  f"?uploadType=resumable&supportsAllDrives=true")
        method = _SESSION.patch
        meta   = {}
    else:
        if not folder_id:
            return None
        url    = ("https://www.googleapis.com/upload/drive/v3/files"
                  "?uploadType=resumable&supportsAllDrives=true")
        method = _SESSION.post
        meta   = {"name": file_name, "parents": [folder_id]}

    resp = method(
        url,
        headers={
            "Authorization":        f"Bearer {tok}",
            "Content-Type":         "application/json",
            "X-Upload-Content-Type": mime,
            "X-Upload-Content-Length": str(file_size),
        },
        json=meta,
        timeout=30,
    )
    if resp.status_code not in (200, 308):
        return None
    return resp.headers.get("Location")


def _upload_chunks(local_tmp, upload_url, file_size, label, tok):
    """
    Send a local file to Drive in 512 MB chunks using the given resumable URL.
    Refreshes the token every 5 chunks. Returns True on success.
    """
    CHUNK = 512 * 1024 * 1024
    bar   = LiveBar(file_size, label, phase="☁ Upload")
    sent  = 0
    chunk_num = 0

    try:
        with open(local_tmp, "rb") as fh:
            while sent < file_size:
                data = fh.read(CHUNK)
                if not data:
                    break
                chunk_num += 1
                if chunk_num % 5 == 0:
                    try:
                        tok = _token()
                    except Exception:
                        pass
                end  = sent + len(data) - 1
                resp = _SESSION.put(
                    upload_url,
                    headers={
                        "Authorization":  f"Bearer {tok}",
                        "Content-Range":  f"bytes {sent}-{end}/{file_size}",
                        "Content-Length": str(len(data)),
                    },
                    data=data,
                    timeout=3600,
                )
                if resp.status_code not in (200, 201, 308):
                    bar.finish(False)
                    return False
                bar.update(len(data))
                sent += len(data)
        bar.finish(True)
        return True
    except Exception as e:
        bar.finish(False)
        print(f"\n  {R}✘ Upload exception: {e}{X}")
        return False


def _fuse_fallback(local_tmp, drive_fp):
    """Copy a file to Drive via FUSE mount (slower, but always available)."""
    local_tmp = Path(local_tmp)
    drive_fp  = Path(drive_fp)
    if not local_tmp.exists():
        print(f"  {R}✘ FUSE fallback: source missing.{X}")
        return False
    bar = LiveBar(local_tmp.stat().st_size, drive_fp.stem[:26], phase="↩ FUSE")
    try:
        with open(local_tmp, "rb") as src, open(drive_fp, "wb") as dst:
            while True:
                buf = src.read(8 * 1024 * 1024)
                if not buf:
                    break
                dst.write(buf)
                bar.update(len(buf))
        bar.finish(True)
        local_tmp.unlink(missing_ok=True)
        try:
            os.sync()
            drive_fp.touch()
            os.sync()
        except OSError:
            pass
        return True
    except Exception as e:
        bar.finish(False)
        print(f"  {R}✘ FUSE fallback failed: {e}{X}")
        return False


def _upload_to_drive(local_tmp, drive_fp, known_fid=None):
    """
    Upload local_tmp to drive_fp via the Drive resumable API.
    If the file ID is known it performs an in-place PATCH (overwrite);
    otherwise it creates a new file. Falls back to FUSE on any error.
    """
    local_tmp = Path(local_tmp)
    drive_fp  = Path(drive_fp)
    file_size = local_tmp.stat().st_size
    label     = drive_fp.stem[:26]
    mime      = ("video/x-matroska" if local_tmp.suffix.lower() == ".mkv"
                 else "video/mp4")

    print(f"\n  {B}☁  Uploading to Drive via API{X}  ({_fmt_size(file_size)}, Maximum Speed)")

    try:
        tok = _token()
    except RuntimeError as e:
        print(f"  {Y}⚠ Auth error ({e}) — FUSE fallback.{X}")
        return _fuse_fallback(local_tmp, drive_fp)

    file_id   = known_fid
    folder_id = None

    if not file_id:
        folder_id = _get_folder_id(tok) or _resolve_folder_id_via_file(tok)
        if not folder_id:
            print(f"  {Y}⚠ Could not resolve folder ID — FUSE fallback.{X}")
            return _fuse_fallback(local_tmp, drive_fp)

        # Try to find an existing file to PATCH instead of creating a duplicate
        try:
            r = _SESSION.get(
                "https://www.googleapis.com/drive/v3/files",
                params={
                    **_DRIVE_PARAMS,
                    "q": (f"name='{drive_fp.name}' and '{folder_id}' in parents"
                          f" and 'me' in owners and trashed=false"),
                    "fields":   "files(id,owners)",
                    "pageSize": "5",
                },
                headers={"Authorization": f"Bearer {tok}"},
                timeout=15,
            )
            if r.status_code == 200:
                for f in r.json().get("files", []):
                    if any(o.get("me") for o in f.get("owners", [])):
                        file_id = f["id"]
                        break
        except Exception:
            pass

    upload_url = _start_resumable_session(
        tok, mime, file_size, drive_fp.name, file_id, folder_id
    )
    if not upload_url:
        return _fuse_fallback(local_tmp, drive_fp)

    success = _upload_chunks(local_tmp, upload_url, file_size, label, tok)
    if success:
        local_tmp.unlink(missing_ok=True)
        print(f"  {B}✔ Drive file {'updated in-place' if file_id else 'created'}.{X}")
        return True
    return _fuse_fallback(local_tmp, drive_fp)


def _upload_file_to_folder(local_fp, folder_id, tok):
    """Upload a local file as a NEW file inside folder_id (no PATCH)."""
    local_fp  = Path(local_fp)
    file_size = local_fp.stat().st_size
    mime_map  = {
        ".mkv":  "video/x-matroska",
        ".mp4":  "video/mp4",
        ".avi":  "video/x-msvideo",
        ".mov":  "video/quicktime",
        ".ts":   "video/mp2t",
        ".m4v":  "video/x-m4v",
        ".webm": "video/webm",
    }
    mime = mime_map.get(local_fp.suffix.lower(), "application/octet-stream")

    try:
        resp = _SESSION.post(
            "https://www.googleapis.com/upload/drive/v3/files"
            "?uploadType=resumable&supportsAllDrives=true",
            headers={
                "Authorization":          f"Bearer {tok}",
                "Content-Type":           "application/json",
                "X-Upload-Content-Type":  mime,
                "X-Upload-Content-Length": str(file_size),
            },
            json={"name": local_fp.name, "parents": [folder_id]},
            timeout=30,
        )
        if resp.status_code not in (200, 308):
            print(f"  {R}✘ Upload session failed (HTTP {resp.status_code}){X}")
            return False
        upload_url = resp.headers.get("Location")
    except Exception as e:
        print(f"  {R}✘ Upload session error: {e}{X}")
        return False

    return _upload_chunks(local_fp, upload_url, file_size, local_fp.stem[:26], tok)


# ══════════════════════════════════════════════════════════════════════
#  FFPROBE HELPERS
# ══════════════════════════════════════════════════════════════════════
def _probe(fp, sel):
    """Run ffprobe and return stream list for selector sel ('a', 's', 'v')."""
    try:
        r = subprocess.run(
            ["ffprobe", "-v", "quiet", "-print_format", "json",
             "-show_streams", "-select_streams", sel, str(fp)],
            capture_output=True, text=True, timeout=60,
        )
        return json.loads(r.stdout).get("streams", [])
    except Exception:
        return []


def _probe_all(fp):
    """Run audio, subtitle, and video probes in parallel (3× faster)."""
    with ThreadPoolExecutor(max_workers=3) as ex:
        fa = ex.submit(_probe, fp, "a")
        fs = ex.submit(_probe, fp, "s")
        fv = ex.submit(_probe, fp, "v")
        return fa.result(), fs.result(), fv.result()


def _guess_lang_from_track(tags, stream):
    """
    Try to identify the language of an audio/subtitle track when lang tag is und/empty.
    Detection order:
      1. Direct language tags (language, LANGUAGE, lang, LANG)
      2. Keyword scan in title, handler_name, description, comment
         — supports native scripts: தமிழ், తెలుగు, മലയാളം, ಕನ್ನಡ, हिंदी
    Returns a 3-letter ISO code, or 'und' if undetectable.
    NOTE: Bitrate/channel/position heuristics intentionally removed —
          they caused wrong language assignments on truly unknown tracks.
          If und remains, user should fix via Menu [6] Manual Edit.
    """
    # ── 1. Direct language tags ───────────────────────────────────────
    for key in ("language", "LANGUAGE", "lang", "LANG"):
        val = tags.get(key, "")
        if val and val.lower() not in ("und", "undefined", "unknown", ""):
            return _norm_lang(val)

    # ── 2. Keyword scan across all text tags ──────────────────────────
    _LANG_KEYWORDS = {
        "tam":  ["tamil", "tam", "தமிழ்"],
        "tel":  ["telugu", "tel", "తెలుగు"],
        "mal":  ["malayalam", "mal", "മലയാളം"],
        "kan":  ["kannada", "kan", "ಕನ್ನಡ"],
        "hin":  ["hindi", "hin", "हिन्दी", "हिंदी"],
        "eng":  ["english", "eng"],
        "ben":  ["bengali", "ben", "বাংলা"],
        "mar":  ["marathi", "mar", "मराठी"],
        "pan":  ["punjabi", "pan", "ਪੰਜਾਬੀ"],
        "jpn":  ["japanese", "jpn", "日本語"],
        "chi":  ["chinese", "chi", "中文"],
        "kor":  ["korean", "kor", "한국어"],
    }
    text_fields = [
        tags.get("title", ""),
        tags.get("TITLE", ""),
        tags.get("handler_name", ""),
        tags.get("HANDLER_NAME", ""),
        tags.get("com.apple.quicktime.description", ""),
        tags.get("description", ""),
        tags.get("comment", ""),
        tags.get("COMMENT", ""),
    ]
    combined = " ".join(f for f in text_fields if f).lower()
    if combined:
        for lang_code, keywords in _LANG_KEYWORDS.items():
            for kw in keywords:
                if kw in combined:
                    return lang_code

    # Cannot determine language — leave as und
    # User can fix via Menu [6] Manual Edit Tracks
    return "und"


def _audio_tracks(fp):
    """Return a list of audio-track dicts for the given file."""
    out = []
    for i, s in enumerate(_probe(fp, "a")):
        tags = s.get("tags", {})
        # Try multiple title sources
        title = (
            tags.get("title")
            or tags.get("TITLE")
            or tags.get("handler_name")
            or tags.get("HANDLER_NAME")
            or tags.get("description")
            or f"Track {i + 1}"
        )
        # Smart language detection — keyword scan on title/handler_name/description
        raw_lang = tags.get("language") or tags.get("LANGUAGE") or "und"
        if _norm_lang(raw_lang) == "und":
            lang = _guess_lang_from_track(tags, s)
        else:
            lang = _norm_lang(raw_lang)

        out.append({
            "idx":        s.get("index", i),
            "track_num":  i,
            "title":      title,
            "language":   lang,
            "codec":      s.get("codec_name", "?"),
            "channels":   s.get("channels", "?"),
            "is_default": bool(s.get("disposition", {}).get("default", 0)),
            "is_forced":  bool(s.get("disposition", {}).get("forced",  0)),
        })
    return out


def _sub_tracks(fp):
    """Return a list of subtitle-track dicts for the given file."""
    out = []
    for i, s in enumerate(_probe(fp, "s")):
        tags = s.get("tags", {})
        title = tags.get("title") or tags.get("TITLE") or f"Sub {i + 1}"
        raw_lang = tags.get("language") or tags.get("LANGUAGE") or "und"
        if _norm_lang(raw_lang) == "und":
            lang = _guess_lang_from_track(tags, s)
        else:
            lang = _norm_lang(raw_lang)
        out.append({
            "abs_index":  s.get("index", i),
            "track_num":  i,
            "title":      title,
            "language":   lang,
            "codec":      s.get("codec_name", "?"),
            "is_default": bool(s.get("disposition", {}).get("default", 0)),
        })
    return out


def _vid_count(fp):
    """Return the number of video streams in the file.
    Used as a safety guard — files with 0 video streams are skipped before remux.
    """
    return len(_probe(fp, "v"))


# ══════════════════════════════════════════════════════════════════════
#  MKVPROPEDIT HEADER CLEAN
# ══════════════════════════════════════════════════════════════════════
def _mkvpropedit_clean(fp, sorted_audio, eng_subs):
    """
    Use mkvpropedit to clear the container title, blank video track name,
    and set correct language / default flags on all audio and subtitle tracks.
    This is called after mkvmerge remux to patch metadata in-place.
    """
    if not shutil.which("mkvpropedit"):
        subprocess.run(
            ["apt-get", "install", "-y", "-q", "mkvtoolnix"],
            capture_output=True, text=True, timeout=60,
        )

    print(f"  {D}⚡ mkvpropedit header clean...{X}", end="", flush=True)
    args = [
        "mkvpropedit", str(fp),
        "--edit", "info",      "--set", "title=",
        "--edit", "track:v1",  "--set", "name=",
    ]
    for i, t in enumerate(sorted_audio):
        args += [
            "--edit", f"track:a{i + 1}",
            "--set",  "name=",
            "--set",  f"language={t['language']}",
            "--set",  f"flag-default={'1' if i == 0 else '0'}",
            "--set",  f"flag-forced={'1' if i == 0 else '0'}",
        ]
    for i, s in enumerate(eng_subs):
        args += [
            "--edit", f"track:s{i + 1}",
            "--set",  "name=",
            "--set",  f"language={s.get('language', 'und')}",
            "--set",  "flag-default=0",
            "--set",  "flag-forced=0",
        ]

    try:
        r = subprocess.run(args, capture_output=True, text=True, timeout=60)
        if r.returncode == 0:
            print(f"\r  {G}✔ Header clean done.{X}")
        else:
            print(f"\r  {Y}⚠ mkvpropedit: {r.stderr[:80]}{X}")
    except Exception as e:
        print(f"\r  {Y}⚠ mkvpropedit skipped: {e}{X}")


# ══════════════════════════════════════════════════════════════════════
#  SHARED REMUX BUILDER  (single source of truth for mkvmerge / ffmpeg)
# ══════════════════════════════════════════════════════════════════════
def _build_remux_cmd(src, tmp, sorted_audio, eng_subs, engine):
    """
    Build the mkvmerge or ffmpeg command list for a remux operation.
    Audio is sorted with Tamil (or highest-priority language) first.
    Subtitles in tam/tel/mal/kan/hin/eng are kept; all others are dropped.
    Track titles are cleared (blank) in auto-fix mode.
    """
    if engine == "mkvmerge":
        audio_sel  = ",".join(str(t["idx"]) for t in sorted_audio)
        audio_args = []
        for i, t in enumerate(sorted_audio):
            sid = str(t["idx"])
            audio_args += [
                "--default-track-flag", f"{sid}:{'yes' if i == 0 else 'no'}",
                "--forced-display-flag", f"{sid}:{'yes' if i == 0 else 'no'}",
                "--track-name",          f"{sid}:",
                "--language",            f"{sid}:{t['language']}",
            ]

        if eng_subs:
            sub_sel  = ",".join(str(s["abs_index"]) for s in eng_subs)
            sub_args = ["--subtitle-tracks", sub_sel]
            for s in eng_subs:
                sid = str(s["abs_index"])
                sub_args += [
                    "--default-track-flag", f"{sid}:no",
                    "--forced-display-flag", f"{sid}:no",
                    "--track-name",          f"{sid}:",
                    "--language",            f"{sid}:{s.get('language', 'und')}",
                ]
        else:
            sub_args = ["--no-subtitles"]

        vid_streams   = _probe(src, "v")
        vid_name_args = []
        for s in vid_streams:
            vid_name_args += ["--track-name", f"{s['index']}:"]

        vid_order  = ",".join(f"0:{s['index']}"      for s in vid_streams)
        aud_order  = ",".join(f"0:{t['idx']}"         for t in sorted_audio)
        sub_order  = ",".join(f"0:{s['abs_index']}"   for s in eng_subs)
        full_order = ",".join(x for x in [vid_order, aud_order, sub_order] if x)

        return [
            "mkvmerge", "--engage", "no_variable_data",
            "--output", str(tmp), "--title", "",
            *vid_name_args,
            "--audio-tracks", audio_sel, *audio_args,
            *sub_args,
            "--track-order", full_order,
            str(src),
        ]

    else:  # ffmpeg
        map_args  = ["-map", "0:v?"]
        meta_args = []
        disp_args = []

        for i, t in enumerate(sorted_audio):
            map_args  += ["-map", f"0:a:{t['track_num']}"]
            meta_args += [
                f"-metadata:s:a:{i}", "title=",
                f"-metadata:s:a:{i}", f"language={t['language']}",
            ]
            disp_args += [f"-disposition:a:{i}", "default+forced" if i == 0 else "0"]

        sub_disp = []
        for i, s in enumerate(eng_subs):
            map_args  += ["-map", f"0:{s['abs_index']}"]
            meta_args += [
                f"-metadata:s:s:{i}", "title=",
                f"-metadata:s:s:{i}", f"language={s.get('language', 'und')}",
            ]
            sub_disp  += [f"-disposition:s:{i}", "0"]

        map_args += ["-map", "0:t?"]

        return [
            "ffmpeg", "-y", "-loglevel", "error",
            "-i", str(src),
            *map_args, "-c", "copy",
            *meta_args, *disp_args, *sub_disp,
            str(tmp),
        ]


# ══════════════════════════════════════════════════════════════════════
#  SMART REMUX SKIP  (v9.1)
# ══════════════════════════════════════════════════════════════════════
def _tracks_need_fix(fp, sorted_audio, eng_subs):
    """
    Return (needs_fix: bool, reason: str).

    Checks whether the file already has:
      • audio tracks in the correct language order
      • correct language tags on every audio track
      • correct language tags on every subtitle track
      • correct default flag (track 0 = True, rest = False)
      • correct forced flag (track 0 = True, rest = False)
      • no stale container/video title

    If everything is already perfect the caller can skip remux entirely.
    """
    try:
        a_tracks = _audio_tracks(fp)
        s_tracks = _sub_tracks(fp)
    except Exception as e:
        return True, f"probe failed: {e}"

    # ── 1. Audio count must match ─────────────────────────────────────
    if len(a_tracks) != len(sorted_audio):
        return True, (f"audio count mismatch "
                      f"({len(a_tracks)} on disk vs {len(sorted_audio)} expected)")

    # ── 2. Language order + default flag ─────────────────────────────
    for i, (on_disk, expected) in enumerate(zip(a_tracks, sorted_audio)):
        if _norm_lang(on_disk["language"]) != _norm_lang(expected["language"]):
            return True, (f"audio[{i}] lang {on_disk['language']!r} "
                          f"≠ expected {expected['language']!r}")
        want_default = (i == 0)
        if bool(on_disk["is_default"]) != want_default:
            return True, (f"audio[{i}] default flag wrong "
                          f"(is {on_disk['is_default']}, want {want_default})")
        want_forced = (i == 0)
        if bool(on_disk.get("is_forced", False)) != want_forced:
            return True, (f"audio[{i}] forced flag wrong "
                          f"(is {on_disk.get('is_forced', False)}, want {want_forced})")

    # ── 3. Subtitle count must match ─────────────────────────────────
    if len(s_tracks) != len(eng_subs):
        return True, (f"sub count mismatch "
                      f"({len(s_tracks)} on disk vs {len(eng_subs)} expected)")

    # ── 4. Subtitle language tags ─────────────────────────────────────
    for i, (on_disk, expected) in enumerate(zip(s_tracks, eng_subs)):
        if _norm_lang(on_disk["language"]) != _norm_lang(expected.get("language", "und")):
            return True, (f"sub[{i}] lang {on_disk['language']!r} "
                          f"≠ expected {expected.get('language', 'und')!r}")

    # ── 5. Container title must be blank ─────────────────────────────
    try:
        r = subprocess.run(
            ["ffprobe", "-v", "quiet", "-print_format", "json",
             "-show_format", str(fp)],
            capture_output=True, text=True, timeout=30,
        )
        fmt   = json.loads(r.stdout).get("format", {})
        title = fmt.get("tags", {}).get("title", "")
        if title:
            return True, f"container title not blank: {title!r}"
    except Exception:
        pass  # can't check title — assume fix needed only if other checks pass

    return False, "already correct"


def _run_remux(src, tmp, sorted_audio, eng_subs, engine):
    """
    Execute the remux command with a live progress bar.
    Returns True on success, False on failure (tmp is cleaned up on failure).
    """
    cmd   = _build_remux_cmd(src, tmp, sorted_audio, eng_subs, engine)
    fsize = src.stat().st_size
    bar   = LiveBar(fsize, src.stem[:26], phase="⚙ Remux")
    errors = []

    try:
        proc = subprocess.Popen(
            cmd, stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT, text=True, bufsize=1,
        )
        last_pct = 0
        bpp      = max(fsize / 100.0, 1)

        for line in proc.stdout:
            m = re.search(r"Progress:\s*(\d+)%", line.strip())
            if m:
                pct   = int(m.group(1))
                delta = pct - last_pct
                if delta > 0:
                    bar.update(int(delta * bpp))
                    last_pct = pct
            elif re.search(r"\bError\b", line, re.IGNORECASE):
                errors.append(line.strip())

        proc.wait()
        bar.update(fsize - bar.done)
        bar.finish(proc.returncode in (0, 1))

        if proc.returncode not in (0, 1):
            tmp.unlink(missing_ok=True)
            for el in errors[:3]:
                print(f"  {R}{el}{X}")
            return False

        if engine == "mkvmerge":
            _mkvpropedit_clean(tmp, sorted_audio, eng_subs)
        return True

    except Exception as e:
        bar.finish(False)
        tmp.unlink(missing_ok=True)
        print(f"\n  {R}✘ Remux exception: {e}{X}")
        return False


# ══════════════════════════════════════════════════════════════════════
#  REMUX WITH CUSTOM TITLES  (Menu [6] — manual edit mode)
# ══════════════════════════════════════════════════════════════════════
def _run_remux_with_titles(src, tmp, sorted_audio, eng_subs, engine):
    """
    Like _run_remux but writes the user-edited track title instead of
    clearing it. Used exclusively by the Manual Edit menu (option [6]).
    """
    src   = Path(src)
    tmp   = Path(tmp)
    fsize = src.stat().st_size
    bar   = LiveBar(fsize, src.stem[:26], phase="⚙ Remux")

    if engine == "mkvmerge":
        audio_sel  = ",".join(str(t["idx"]) for t in sorted_audio)
        audio_args = []
        for i, t in enumerate(sorted_audio):
            sid   = str(t["idx"])
            tname = t.get("title") or ""
            audio_args += [
                "--default-track-flag", f"{sid}:{'yes' if i == 0 else 'no'}",
                "--forced-display-flag", f"{sid}:{'yes' if i == 0 else 'no'}",
                "--track-name",          f"{sid}:{tname}",
                "--language",            f"{sid}:{t['language']}",
            ]

        if eng_subs:
            sub_sel  = ",".join(str(s["abs_index"]) for s in eng_subs)
            sub_args = ["--subtitle-tracks", sub_sel]
            for s in eng_subs:
                sid   = str(s["abs_index"])
                sname = s.get("title") or ""
                slang = s.get("language") or "eng"
                sub_args += [
                    "--default-track-flag", f"{sid}:no",
                    "--forced-display-flag", f"{sid}:no",
                    "--track-name",          f"{sid}:{sname}",
                    "--language",            f"{sid}:{slang}",
                ]
        else:
            sub_args = ["--no-subtitles"]

        vid_streams   = _probe(src, "v")
        vid_name_args = []
        for s in vid_streams:
            vid_name_args += ["--track-name", f"{s['index']}:"]

        vid_order  = ",".join(f"0:{s['index']}"      for s in vid_streams)
        aud_order  = ",".join(f"0:{t['idx']}"         for t in sorted_audio)
        sub_order  = ",".join(f"0:{s['abs_index']}"   for s in eng_subs)
        full_order = ",".join(x for x in [vid_order, aud_order, sub_order] if x)

        cmd = [
            "mkvmerge", "--engage", "no_variable_data",
            "--output", str(tmp), "--title", "",
            *vid_name_args,
            "--audio-tracks", audio_sel, *audio_args,
            *sub_args,
            "--track-order", full_order,
            str(src),
        ]

    else:  # ffmpeg
        map_args  = ["-map", "0:v?"]
        meta_args = []
        disp_args = []
        sub_disp  = []

        for i, t in enumerate(sorted_audio):
            map_args  += ["-map", f"0:a:{t['track_num']}"]
            tname = t.get("title") or ""
            meta_args += [
                f"-metadata:s:a:{i}", f"title={tname}",
                f"-metadata:s:a:{i}", f"language={t['language']}",
            ]
            disp_args += [f"-disposition:a:{i}", "default+forced" if i == 0 else "0"]

        for i, s in enumerate(eng_subs):
            map_args  += ["-map", f"0:{s['abs_index']}"]
            sname = s.get("title") or ""
            slang = s.get("language") or "eng"
            meta_args += [
                f"-metadata:s:s:{i}", f"title={sname}",
                f"-metadata:s:s:{i}", f"language={slang}",
            ]
            sub_disp  += [f"-disposition:s:{i}", "0"]

        map_args += ["-map", "0:t?"]

        cmd = [
            "ffmpeg", "-y", "-loglevel", "error",
            "-i", str(src),
            *map_args, "-c", "copy",
            *meta_args, *disp_args, *sub_disp,
            str(tmp),
        ]

    errors = []
    try:
        proc = subprocess.Popen(
            cmd, stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT, text=True, bufsize=1,
        )
        last_pct = 0
        bpp      = max(fsize / 100.0, 1)

        for line in proc.stdout:
            m = re.search(r"Progress:\s*(\d+)%", line.strip())
            if m:
                pct   = int(m.group(1))
                delta = pct - last_pct
                if delta > 0:
                    bar.update(int(delta * bpp))
                    last_pct = pct
            elif re.search(r"\bError\b", line, re.IGNORECASE):
                errors.append(line.strip())

        proc.wait()
        bar.update(fsize - bar.done)
        bar.finish(proc.returncode in (0, 1))

        if proc.returncode not in (0, 1):
            tmp.unlink(missing_ok=True)
            for el in errors[:3]:
                print(f"  {R}{el}{X}")
            return False

        # mkvpropedit pass — writes user-provided titles into the output
        if engine == "mkvmerge":
            if not shutil.which("mkvpropedit"):
                subprocess.run(
                    ["apt-get", "install", "-y", "-q", "mkvtoolnix"],
                    capture_output=True, text=True, timeout=60,
                )
            print(f"  {D}⚡ mkvpropedit header clean...{X}", end="", flush=True)
            pe_args = [
                "mkvpropedit", str(tmp),
                "--edit", "info",     "--set", "title=",
                "--edit", "track:v1", "--set", "name=",
            ]
            for i, t in enumerate(sorted_audio):
                tname = t.get("title") or ""
                pe_args += [
                    "--edit", f"track:a{i + 1}",
                    "--set",  f"name={tname}",
                    "--set",  f"language={t['language']}",
                    "--set",  f"flag-default={'1' if i == 0 else '0'}",
                    "--set",  f"flag-forced={'1' if i == 0 else '0'}",
                ]
            for i, s in enumerate(eng_subs):
                sname = s.get("title") or ""
                slang = s.get("language") or "eng"
                pe_args += [
                    "--edit", f"track:s{i + 1}",
                    "--set",  f"name={sname}",
                    "--set",  f"language={slang}",
                    "--set",  "flag-default=0",
                    "--set",  "flag-forced=0",
                ]
            try:
                r = subprocess.run(pe_args, capture_output=True, text=True, timeout=60)
                if r.returncode == 0:
                    print(f"\r  {G}✔ Header clean done.{X}")
                else:
                    print(f"\r  {Y}⚠ mkvpropedit: {r.stderr[:80]}{X}")
            except Exception as e:
                print(f"\r  {Y}⚠ mkvpropedit skipped: {e}{X}")

        return True

    except Exception as e:
        bar.finish(False)
        tmp.unlink(missing_ok=True)
        print(f"\n  {R}✘ Remux exception: {e}{X}")
        return False


# ══════════════════════════════════════════════════════════════════════
#  DRIVE DOWNLOAD TO LOCAL NVMe  (3-stage: parallel → stream → fallback)
# ══════════════════════════════════════════════════════════════════════
def _drive_download_local(fid, fname, size):
    """
    Download a Drive file to /content (Colab NVMe) as fast as possible.
    Stage 1: parallel Range requests (THREADS connections).
    Stage 2: single-stream fallback.
    Returns the local Path on success, or None on failure.
    """
    local = Path("/content") / fname

    # Already cached?
    if local.exists() and size > 0 and local.stat().st_size == size:
        print(f"  {G}✔ Already cached locally.{X}")
        return local

    # ── v9.1: check for resumable .part file ─────────────────────────
    _part = local.with_suffix(local.suffix + ".part")
    _drive_resumed = 0
    if _part.exists() and size > 0:
        _ps = _part.stat().st_size
        if 0 < _ps < size:
            _drive_resumed = _ps
            print(f"  {C}🔁 Drive resume: {_fmt_size(_drive_resumed)} already downloaded{X}")
        else:
            _part.unlink(missing_ok=True)

    phase_label = "⬇ Resume" if _drive_resumed else "⬇ DL→Local"
    print(f"  {C}⬇ Downloading to local NVMe...{X}")
    bar = LiveBar(size or 1, fname[:26], phase=phase_label)
    if _drive_resumed:
        with bar._lock:
            bar.done = _drive_resumed
            bar._lb  = _drive_resumed

    try:
        tok       = _token()
        base_url  = f"https://www.googleapis.com/drive/v3/files/{fid}"
        dl_params = {"alt": "media", **_DRIVE_PARAMS}

        # ── Stage 1: probe Range support ─────────────────────────────
        probe = _SESSION.get(
            base_url, params=dl_params,
            headers={"Authorization": f"Bearer {tok}", "Range": "bytes=0-0"},
            stream=True, timeout=(15, 60),
        )
        try:
            for _ in probe.iter_content(16):
                break
        finally:
            probe.close()

        range_ok = probe.status_code == 206
        if range_ok:
            cr = probe.headers.get("Content-Range", "")
            try:
                real_size = int(cr.split("/")[-1])
            except Exception:
                real_size = size
        else:
            real_size = size

        if range_ok and real_size > 0:
            # ── Parallel chunk download with resume ───────────────────
            n  = THREADS
            cs = real_size // n
            # Skip segments already present in the .part file
            ranges = []
            for i in range(n):
                seg_s = i * cs
                seg_e = real_size - 1 if i == n - 1 else (i + 1) * cs - 1
                if seg_e < _drive_resumed:
                    bar.update(seg_e - seg_s + 1)
                    continue
                if seg_s < _drive_resumed:
                    seg_s = _drive_resumed
                ranges.append((seg_s, seg_e))

            tmp     = _part
            if not tmp.exists():
                with open(tmp, "wb") as fh:
                    fh.seek(real_size - 1)
                    fh.write(b"\x00")

            tok_ref = [tok]
            errors  = []

            def _par_chunk(start, end):
                for attempt in range(1, MAX_RETRY + 1):
                    try:
                        hdrs = {
                            "Authorization": f"Bearer {tok_ref[0]}",
                            "Range": f"bytes={start}-{end}",
                        }
                        r = _SESSION.get(base_url, params=dl_params,
                                         headers=hdrs, stream=True, timeout=(15, 600))
                        if r.status_code == 401:
                            r.close()
                            try:
                                tok_ref[0] = _token()
                            except Exception:
                                pass
                            hdrs["Authorization"] = f"Bearer {tok_ref[0]}"
                            r = _SESSION.get(base_url, params=dl_params,
                                             headers=hdrs, stream=True, timeout=(15, 600))
                        r.raise_for_status()
                        fd  = os.open(str(tmp), os.O_WRONLY)
                        pos = start
                        try:
                            for c in r.iter_content(CHUNK_MB * 1_048_576):
                                if c:
                                    os.pwrite(fd, c, pos)
                                    pos += len(c)
                                    bar.update(len(c))
                        finally:
                            os.close(fd)
                            r.close()
                        return
                    except Exception as e:
                        if attempt == MAX_RETRY:
                            errors.append(f"Chunk {start}-{end}: {e}")
                            return
                        time.sleep(attempt)

            with ThreadPoolExecutor(max_workers=n) as ex:
                futs = [ex.submit(_par_chunk, s, e) for s, e in ranges]
                for f in as_completed(futs):
                    pass

            if errors:
                tmp.unlink(missing_ok=True)
                bar.finish(False)
                print(f"  {R}✘ Parallel DL errors: {errors[0]}{X}")
                return None

            tmp.replace(local)
            bar.finish(True)
            return local

        # ── Stage 2: single-stream fallback ──────────────────────────
        for attempt in range(1, MAX_RETRY + 1):
            try:
                r = _SESSION.get(
                    base_url, params=dl_params,
                    headers={"Authorization": f"Bearer {tok}"},
                    stream=True, timeout=(15, 600),
                )
                if r.status_code == 403:
                    r.close()
                    dl_params["acknowledgeAbuse"] = "true"
                    try:
                        tok = _token()
                    except Exception:
                        pass
                    r = _SESSION.get(
                        base_url, params=dl_params,
                        headers={"Authorization": f"Bearer {tok}"},
                        stream=True, timeout=(15, 600),
                    )

                # If still 403, try the public /uc download endpoint
                if r.status_code == 403:
                    r.close()
                    fb      = requests.Session()
                    fb.headers.update(DL_HEADERS)
                    r1      = fb.get(
                        "https://drive.google.com/uc",
                        params={"export": "download", "id": fid},
                        timeout=(15, 60),
                    )
                    confirm = None
                    if r1.status_code == 200:
                        m2 = re.search(r'confirm=([0-9A-Za-z_\-]+)', r1.text)
                        if m2:
                            confirm = m2.group(1)
                        for ck in fb.cookies:
                            if "download_warning" in ck.name.lower():
                                confirm = ck.value
                                break
                    dl_p = {"export": "download", "id": fid}
                    if confirm:
                        dl_p["confirm"] = confirm
                    r = fb.get(
                        "https://drive.google.com/uc",
                        params=dl_p, stream=True, timeout=(15, 600),
                    )

                r.raise_for_status()
                if "text/html" in r.headers.get("Content-Type", ""):
                    bar.finish(False)
                    local.unlink(missing_ok=True)
                    print(f"\n  {R}✘ Got HTML — Drive blocked download.{X}")
                    return None

                real_len = int(r.headers.get("Content-Length", 0))
                if real_len > 0:
                    with bar._lock:
                        bar.total = real_len

                with open(local, "wb") as fh:
                    for chunk in r.iter_content(CHUNK_MB * 1_048_576):
                        if chunk:
                            fh.write(chunk)
                            bar.update(len(chunk))
                bar.finish(True)
                return local

            except Exception as e:
                if attempt == MAX_RETRY:
                    bar.finish(False)
                    local.unlink(missing_ok=True)
                    print(f"  {R}✘ Local DL failed: {e}{X}")
                    return None
                time.sleep(attempt)

    except Exception as e:
        bar.finish(False)
        local.unlink(missing_ok=True)
        print(f"  {R}✘ Local DL failed: {e}{X}")
        return None


# ══════════════════════════════════════════════════════════════════════
#  EXTERNAL URL DOWNLOADER  (parallel → multi-stream → stream fallback)
# ══════════════════════════════════════════════════════════════════════
def _server_range(url):
    """
    Check whether the server supports HTTP Range requests.
    Returns (supports_range: bool, content_length: int).
    """
    try:
        h  = _SESSION.head(
            url, timeout=TIMEOUT, allow_redirects=True,
            headers={"Accept-Encoding": "identity"},
        )
        if h.status_code not in (405, 403, 520, 521, 522, 523, 524):
            cl = int(h.headers.get("content-length", 0))
            if cl > 0 and h.headers.get("accept-ranges", "").lower() == "bytes":
                return True, cl
    except Exception:
        pass

    try:
        r = _SESSION.get(
            url, headers={"Range": "bytes=0-0"},
            stream=True, timeout=TIMEOUT, allow_redirects=True,
        )
        try:
            for _ in r.iter_content(16):
                break
        finally:
            r.close()
        if r.status_code == 206:
            cr = r.headers.get("content-range", "")
            try:
                total = int(cr.split("/")[-1])
            except Exception:
                total = int(r.headers.get("content-length", 0))
            return (True, total) if total > 0 else (False, 0)
        if r.status_code == 200:
            return False, int(r.headers.get("content-length", 0))
    except Exception:
        pass

    try:
        r = _SESSION.get(url, stream=True, timeout=TIMEOUT, allow_redirects=True)
        try:
            for _ in r.iter_content(16):
                break
        finally:
            r.close()
        if r.status_code == 200:
            return False, int(r.headers.get("content-length", 0))
    except Exception:
        pass
    return False, 0


def _fetch_chunk(url, start, end, cb, dst_path=None, cancel_event=None):
    """
    Download a byte range from url.
    If dst_path is given, write directly to that file at offset start (pwrite).
    Otherwise return the raw bytes.
    """
    rh        = {"Range": f"bytes={start}-{end}"}
    max_bytes = end - start + 1

    for attempt in range(1, MAX_RETRY + 1):
        if cancel_event and cancel_event.is_set():
            return None
        try:
            r = _SESSION.get(url, headers=rh, stream=True, timeout=TIMEOUT)
            if r.status_code in (405, 501, 520, 521, 522, 523, 524):
                r.close()
                raise RuntimeError(
                    f"Chunk {start}-{end}: {r.status_code} — Range rejected"
                )
            if r.status_code in (429, 500, 502, 503, 504):
                r.close()
                if attempt == MAX_RETRY:
                    raise RuntimeError(
                        f"Chunk {start}-{end}: {r.status_code} — Server busy"
                    )
                time.sleep(attempt * 2)
                continue
            r.raise_for_status()

            if dst_path is not None:
                fd      = os.open(str(dst_path), os.O_WRONLY)
                pos     = start
                written = 0
                try:
                    for c in r.iter_content(CHUNK_MB * 1_048_576):
                        if cancel_event and cancel_event.is_set():
                            r.close()
                            return None
                        if not c:
                            continue
                        allowed = max_bytes - written
                        if allowed <= 0:
                            break
                        c = c[:allowed]
                        os.pwrite(fd, c, pos)
                        pos     += len(c)
                        written += len(c)
                        cb(len(c))
                finally:
                    os.close(fd)
                return None
            else:
                buf = bytearray()
                for c in r.iter_content(CHUNK_MB * 1_048_576):
                    if cancel_event and cancel_event.is_set():
                        r.close()
                        return bytes(buf)
                    if c:
                        buf += c
                        cb(len(c))
                return bytes(buf)

        except RuntimeError:
            raise
        except Exception as e:
            if cancel_event and cancel_event.is_set():
                return None
            if attempt == MAX_RETRY:
                raise RuntimeError(f"Chunk {start}-{end}: {e}")
            time.sleep(attempt)


def _stream_dl(url, dst, bar):
    """Single-connection streaming download to dst (used as last-resort fallback)."""
    for attempt in range(1, MAX_RETRY + 1):
        try:
            r = _SESSION.get(url, stream=True, timeout=TIMEOUT)
            r.raise_for_status()
            with open(dst, "wb") as f:
                for c in r.iter_content(CHUNK_MB * 1_048_576):
                    if c:
                        f.write(c)
                        bar.update(len(c))
            return
        except Exception as e:
            if attempt == MAX_RETRY:
                raise RuntimeError(f"Stream failed: {e}")
            time.sleep(attempt)


def _multistream_dl(url, dst, size, bar, n_conn=STREAM_CONNS):
    """
    Download a file in n_conn parallel segments using per-segment sessions.
    Falls back to _stream_dl automatically if size is unknown.
    """
    if size == 0 or n_conn <= 1:
        _stream_dl(url, dst, bar)
        return

    seg  = size // n_conn
    segs = [
        (i * seg, seg if i < n_conn - 1 else size - i * seg)
        for i in range(n_conn)
    ]
    with open(dst, "wb") as fh:
        fh.seek(size - 1)
        fh.write(b"\x00")

    errors = []

    def _dl_seg(ci, offset, length):
        end_byte = offset + length - 1
        for attempt in range(1, MAX_RETRY + 1):
            try:
                sess = requests.Session()
                sess.headers.update(DL_HEADERS)
                r = sess.get(
                    url,
                    headers={"Range": f"bytes={offset}-{end_byte}"},
                    stream=True, timeout=TIMEOUT,
                )
                use_range = r.status_code == 206
                if not use_range and r.status_code != 200:
                    r.close()
                    sess.close()
                    raise RuntimeError(f"HTTP {r.status_code}")

                fd      = os.open(str(dst), os.O_WRONLY)
                pos     = offset
                left    = length
                skipped = 0
                try:
                    for chunk in r.iter_content(CHUNK_MB * 1_048_576):
                        if not chunk or left <= 0:
                            break
                        if not use_range and skipped < offset:
                            skip_now  = min(len(chunk), offset - skipped)
                            skipped  += skip_now
                            chunk     = chunk[skip_now:]
                            if not chunk:
                                continue
                        chunk = chunk[:left]
                        os.pwrite(fd, chunk, pos)
                        pos  += len(chunk)
                        left -= len(chunk)
                        bar.update(len(chunk))
                finally:
                    os.close(fd)
                    r.close()
                    sess.close()
                return
            except Exception as e:
                if attempt == MAX_RETRY:
                    errors.append(f"Seg {ci}: {e}")
                    return
                time.sleep(attempt)

    with ThreadPoolExecutor(max_workers=n_conn) as ex:
        for f in as_completed(
            [ex.submit(_dl_seg, i, off, ln) for i, (off, ln) in enumerate(segs)]
        ):
            f.result()

    if errors:
        raise RuntimeError(f"Multi-stream errors: {'; '.join(errors)}")


def _download_external(url, idx, total):
    """
    Download an external URL to /content with a 3-stage strategy:
      1. Parallel Range chunks (THREADS connections)
      2. Multi-stream (STREAM_CONNS connections)
      3. Single-stream fallback
    Returns (local_path, drive_dest_path) or (None, None) on failure.
    """
    name       = _safe_name(url)
    drive_dest = Path(FOLDER) / name
    dest       = Path("/content") / name
    tmp        = Path("/content") / f".{name}.part"

    print(f"\n{W}[{idx + 1}/{total}]{X} {Y}{name}{X}")

    parallel, size = _server_range(url)
    if size == 0:
        try:
            h    = _SESSION.head(url, timeout=TIMEOUT, allow_redirects=True)
            size = int(h.headers.get("content-length", 0))
        except Exception:
            pass

    if parallel:
        print(f"  {G}✔ Parallel ({THREADS} threads){X}  {_fmt_size(size)}")
    else:
        print(f"  {Y}⚡ Stream mode{X}  "
              f"{_fmt_size(size) if size else 'unknown size'}")

    # Return cached copy if it matches expected size
    if dest.exists() and size > 0 and dest.stat().st_size == size:
        print(f"  {G}✔ Already cached — {_fmt_size(size)}{X}")
        return dest, drive_dest

    # ── v9.1: Resume broken .part file ───────────────────────────────
    resumed_bytes = 0
    if tmp.exists() and size > 0 and parallel:
        part_size = tmp.stat().st_size
        if 0 < part_size < size:
            resumed_bytes = part_size
            print(f"  {C}🔁 Resuming from {_fmt_size(resumed_bytes)} / {_fmt_size(size)}{X}")
        elif part_size >= size:
            tmp.unlink(missing_ok=True)  # corrupt / complete stale part

    phase = "↓ Resume" if resumed_bytes else ("↓ Download" if parallel else "↓ Multi-Stream")
    bar   = LiveBar(size or 1, name[:26], phase=phase)
    if resumed_bytes:
        with bar._lock:
            bar.done = resumed_bytes
            bar._lb  = resumed_bytes

    try:
        if parallel and size > 0:
            cs     = size // THREADS
            # Build only the ranges that still have missing bytes
            ranges = []
            for i in range(THREADS):
                seg_start = i * cs
                seg_end   = size - 1 if i == THREADS - 1 else (i + 1) * cs - 1
                if seg_end < resumed_bytes:
                    # Entire segment already downloaded — skip
                    bar.update(seg_end - seg_start + 1)
                    continue
                if seg_start < resumed_bytes:
                    # Partial segment — resume from where we left off
                    seg_start = resumed_bytes
                ranges.append((seg_start, seg_end))

            if not tmp.exists():
                with open(tmp, "wb") as f:
                    f.seek(size - 1)
                    f.write(b"\x00")

            _cancel      = threading.Event()
            parallel_ok  = True

            def worker(args):
                _, (s, e) = args
                _fetch_chunk(url, s, e, bar.update, tmp, cancel_event=_cancel)

            with ThreadPoolExecutor(max_workers=THREADS) as ex:
                futs = {ex.submit(worker, a): a for a in enumerate(ranges)}
                for fut in as_completed(futs):
                    try:
                        fut.result()
                    except RuntimeError as ce:
                        if any(c in str(ce) for c in
                               ("405", "501", "520", "521", "522", "523", "524",
                                "429", "500", "502", "503", "504")):
                            _cancel.set()
                            bar._alive = False
                            time.sleep(0.3)
                            print(
                                f"\r{' ' * 110}\r"
                                f"  {Y}⚠ CDN rejected Range — switching to stream...{X}",
                                flush=True,
                            )
                            ex.shutdown(wait=False, cancel_futures=True)
                            parallel_ok = False
                            break
                        raise

            if not parallel_ok:
                # Reset bar and retry with multi-stream
                bar.done   = 0;  bar._lb   = 0;  bar._spd = 0.0
                bar._t0    = time.time(); bar._lt = time.time()
                bar.phase  = f"↓ Multi-Stream ({STREAM_CONNS})"
                bar._alive = True
                threading.Thread(target=bar._loop, daemon=True).start()
                tmp.unlink(missing_ok=True)
                try:
                    _multistream_dl(url, tmp, size, bar, STREAM_CONNS)
                except RuntimeError:
                    bar._alive = False
                    time.sleep(0.25)
                    tmp.unlink(missing_ok=True)
                    bar.done   = 0;  bar._lb   = 0;  bar._spd = 0.0
                    bar._t0    = time.time(); bar._lt = time.time()
                    bar.phase  = "↓ Stream"
                    bar._alive = True
                    threading.Thread(target=bar._loop, daemon=True).start()
                    _stream_dl(url, tmp, bar)
        else:
            try:
                _multistream_dl(url, tmp, size, bar, STREAM_CONNS)
            except RuntimeError:
                tmp.unlink(missing_ok=True)
                bar.done   = 0;  bar._lb   = 0;  bar._spd = 0.0
                bar._t0    = time.time(); bar._lt = time.time()
                bar.phase  = "↓ Stream"
                _stream_dl(url, tmp, bar)

        tmp.replace(dest)
        if size == 0:
            bar.total = dest.stat().st_size
        bar.finish()
        return dest, drive_dest

    except Exception as e:
        print(f"\n  {R}✘ Failed: {e}{X}")
        tmp.unlink(missing_ok=True)
        bar.finish(False)
        return None, None


# ══════════════════════════════════════════════════════════════════════
#  ZIP HELPERS  (shared by Menu [2] and Menu [3])
# ══════════════════════════════════════════════════════════════════════
def _extract_zip_with_progress(local_zip, extract_dir):
    """
    Run unzip with live per-file progress reporting.
    Returns True on success.
    """
    print(f"\n  {C}{'─' * 66}{X}")
    print(f"  {C}📦 EXTRACTING  {D}{local_zip.name[:55]}{X}")
    print(f"  {C}{'─' * 66}{X}")

    r_list = subprocess.run(
        ["unzip", "-l", str(local_zip)],
        capture_output=True, text=True, timeout=60,
    )
    zip_file_list   = []
    zip_uncompressed = 0

    if r_list.returncode == 0:
        for ln in r_list.stdout.splitlines():
            ln = ln.strip()
            mm = re.match(r"^\s*(\d+)\s+\S+\s+\S+\s+(.+)$", ln)
            if mm and not ln.startswith("---") and not ln.lower().startswith("length"):
                try:
                    fsz = int(mm.group(1))
                    fnm = mm.group(2).strip()
                    zip_file_list.append((fsz, fnm))
                    zip_uncompressed += fsz
                except ValueError:
                    pass

    print(f"  {D}Archive: {len(zip_file_list)} item(s)  "
          f"Uncompressed: {_fmt_size(zip_uncompressed)}{X}\n")

    extracted_count = 0
    extracted_bytes = 0
    t0              = time.time()

    proc = subprocess.Popen(
        ["unzip", "-o", str(local_zip), "-d", str(extract_dir)],
        stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
        text=True, bufsize=1,
    )

    for line in proc.stdout:
        line = line.rstrip()
        if not line:
            continue
        llow = line.lower().lstrip()

        if llow.startswith("inflating:") or llow.startswith("extracting:"):
            parts   = line.split(":", 1)
            relpath = parts[1].strip() if len(parts) > 1 else line
            relname = Path(relpath).name
            fsz     = 0
            for ms, mn in zip_file_list:
                if mn.endswith(relname) or mn == relpath:
                    fsz = ms
                    break
            extracted_bytes += fsz
            extracted_count += 1
            pct = (extracted_bytes / zip_uncompressed * 100) if zip_uncompressed else 0
            ela = time.time() - t0
            spd = extracted_bytes / ela / 1_048_576 if ela > 0.1 else 0
            bf  = int(28 * min(pct / 100, 1.0))
            bbar = f"{G}{'▣' * bf}{D}{'▢' * (28 - bf)}{X}"
            print(
                f"  {G}[{extracted_count}]{X} [{bbar}] {pct:5.1f}%  "
                f"{Y}{_fmt_size(fsz):>10}{X}  {C}{relname[:40]}{X}  "
                f"{D}{spd:.1f} MB/s{X}"
            )
        elif llow.startswith("creating:"):
            parts   = line.split(":", 1)
            relpath = parts[1].strip() if len(parts) > 1 else line
            print(f"  {D}  📁 {Path(relpath).name[:55]}{X}")
        elif re.search(r"error|cannot|failed|bad", llow):
            print(f"  {R}  ⚠ {line[:80]}{X}")

    proc.wait()
    if proc.returncode != 0:
        print(f"\n  {R}✘ Extraction failed (exit {proc.returncode}){X}")
        return False

    ela = time.time() - t0
    avg = zip_uncompressed / ela / 1_048_576 if ela > 0 else 0
    print(f"\n  {G}✔ Extraction complete{X}  {extracted_count} file(s)  "
          f"{_fmt_size(zip_uncompressed)}  avg {avg:.1f} MB/s  {int(ela)}s")
    return True


def _process_video_files_from_dir(extract_dir, folder_name, new_folder_id, tok,
                                  source_label="ZIP"):
    """
    Remux and upload all video files found inside extract_dir.
    Returns (ok_count, fail_count).
    """
    VIDEO_EXTS  = {".mkv", ".mp4", ".avi", ".mov", ".ts", ".m4v", ".webm"}
    video_files = sorted(
        f for f in extract_dir.rglob("*")
        if f.is_file() and f.suffix.lower() in VIDEO_EXTS
    )

    if not video_files:
        print(f"  {Y}⚠ No video files found inside {source_label} — skipped.{X}")
        return 0, 1

    # ── Contents table (parallel probe) ──────────────────────────────
    print(f"\n  {M}{'─' * 66}{X}")
    print(f"  {M}📋 {source_label} CONTENTS — {len(video_files)} video file(s){X}")
    print(f"  {M}{'─' * 66}{X}")

    def _probe_file(vf):
        with ThreadPoolExecutor(max_workers=2) as _ex:
            return _ex.submit(_audio_tracks, vf).result(), \
                   _ex.submit(_sub_tracks,   vf).result()

    with ThreadPoolExecutor(max_workers=min(len(video_files), 8)) as _pex:
        probe_results = list(_pex.map(_probe_file, video_files))

    meta_cache = []
    for i, vf in enumerate(video_files):
        sz            = vf.stat().st_size
        aud, subs     = probe_results[i]
        eng_s         = _filter_subs(subs)   # keep tam/tel/mal/kan/hin/eng only
        sorted_a      = sorted(aud, key=lambda t: _lang_pri(t["language"]))
        langs         = " + ".join(t["language"] for t in sorted_a) if sorted_a else "?"
        engine        = "mkv" if vf.suffix.lower() == ".mkv" else "ff"
        meta_cache.append((aud, subs, sorted_a, eng_s))
        sub_col = f"{G}{len(eng_s)}sub✔{X}" if eng_s else f"{D} — {X}"
        print(
            f"  {G}[{i + 1}]{X} {Y}{_fmt_size(sz):>9}{X} {D}{engine:>3}{X}  "
            f"{C}{langs[:22]:<22}{X}  sub:{sub_col}  {W}{vf.name[:42]}{X}"
        )
    print(f"  {M}{'─' * 66}{X}\n")

    ok = fail = 0
    for vi, vf in enumerate(video_files):
        print(f"\n  {W}[{vi + 1}/{len(video_files)}]{X} {Y}{vf.name[:55]}{X}")
        aud, subs, sorted_a, eng_s = meta_cache[vi]

        if _vid_count(vf) == 0:
            print(f"  {Y}⚠ No video stream found — skipped.{X}")
            fail += 1
            vf.unlink(missing_ok=True)
            continue

        if not aud:
            print(f"  {Y}⚠ No audio tracks — skipped.{X}")
            fail += 1
            vf.unlink(missing_ok=True)
            continue

        engine   = "mkvmerge" if vf.suffix.lower() == ".mkv" else "ffmpeg"
        top_lang = sorted_a[0]["language"]
        print(f"  {C}⚙ Remux [{engine}]{X}  Audio: {len(sorted_a)} tracks  "
              f"Top: {C}{top_lang}{X}  Subs: {len(eng_s)} (tam/tel/mal/kan/hin/eng)")

        # ── v9.1 smart skip ───────────────────────────────────────────
        needs_fix, skip_reason = _tracks_need_fix(vf, sorted_a, eng_s)
        if not needs_fix:
            print(f"  {G}⚡ SMART SKIP:{X} already correct — uploading as-is.")
            out_name    = _clean_filename(vf.name)
            final_local = vf.parent / out_name
            if vf != final_local:
                vf.rename(final_local)
                vf = final_local
            print(f"  {B}☁  Uploading → Drive/{folder_name}/{vf.name}{X}")
            try:
                tok = _token()
            except Exception:
                pass
            if _upload_file_to_folder(vf, new_folder_id, tok):
                ok += 1
                vf.unlink(missing_ok=True)
                print(f"  {G}✔ Uploaded successfully (skipped remux).{X}")
            else:
                fail += 1
                print(f"  {R}✘ Upload failed — file kept at {vf}{X}")
            continue
        else:
            print(f"  {Y}  Fix needed:{X} {D}{skip_reason}{X}")

        out_name = _clean_filename(vf.name)
        if out_name != vf.name:
            print(f"  {Y}✎ Renamed: {vf.name} → {out_name}{X}")

        remux_tmp = Path("/content") / (
            Path(out_name).stem[:60] + "_ZIPFIX" + Path(out_name).suffix
        )

        if not _run_remux(vf, remux_tmp, sorted_a, eng_s, engine):
            vf.unlink(missing_ok=True)
            fail += 1
            continue

        _vf_sz = vf.stat().st_size if vf.exists() else 0
        vf.unlink(missing_ok=True)
        if _vf_sz:
            print(f"  {D}🗑 Source freed ({_fmt_size(_vf_sz)}) — starting upload.{X}")

        final_local = remux_tmp.parent / out_name
        if remux_tmp != final_local:
            remux_tmp.rename(final_local)
            remux_tmp = final_local

        print(f"  {B}☁  Uploading → Drive/{folder_name}/{remux_tmp.name}{X}")
        try:
            tok = _token()
        except Exception:
            pass

        if _upload_file_to_folder(remux_tmp, new_folder_id, tok):
            ok += 1
            remux_tmp.unlink(missing_ok=True)
            print(f"  {G}✔ Uploaded successfully.{X}")
        else:
            fail += 1
            print(f"  {R}✘ Upload failed — file kept at {remux_tmp}{X}")

    return ok, fail


# ══════════════════════════════════════════════════════════════════════
#  DRIVE ZIP DOWNLOAD  (parallel + fallback — for Menu [3])
# ══════════════════════════════════════════════════════════════════════
def _download_zip_from_drive(fid, fname, size, dest):
    """Download a ZIP file from Drive to dest. Returns True on success."""
    if dest.exists() and size > 0 and dest.stat().st_size == size:
        print(f"  {G}✔ Already cached: {dest.name}{X}")
        return True

    bar = LiveBar(size or 1, dest.name[:26], phase="⬇ ZIP DL")

    try:
        tok       = _token()
        base_url  = f"https://www.googleapis.com/drive/v3/files/{fid}"
        dl_params = {"alt": "media", **_DRIVE_PARAMS}

        # Probe Range support
        probe = _SESSION.get(
            base_url, params=dl_params,
            headers={"Authorization": f"Bearer {tok}", "Range": "bytes=0-0"},
            stream=True, timeout=(15, 60),
        )
        try:
            for _ in probe.iter_content(16):
                break
        finally:
            probe.close()

        range_ok = probe.status_code == 206
        if range_ok:
            cr = probe.headers.get("Content-Range", "")
            try:
                real_size = int(cr.split("/")[-1])
            except Exception:
                real_size = size
        else:
            real_size = size

        if range_ok and real_size > 0:
            n      = THREADS
            cs     = real_size // n
            ranges = [
                (i * cs, real_size - 1 if i == n - 1 else (i + 1) * cs - 1)
                for i in range(n)
            ]
            tmp = dest.with_suffix(dest.suffix + ".part")
            with open(tmp, "wb") as fh:
                fh.seek(real_size - 1)
                fh.write(b"\x00")

            tok_ref = [tok]
            errors  = []

            def _par_chunk(start, end):
                for attempt in range(1, MAX_RETRY + 1):
                    try:
                        hdrs = {
                            "Authorization": f"Bearer {tok_ref[0]}",
                            "Range": f"bytes={start}-{end}",
                        }
                        r = _SESSION.get(base_url, params=dl_params,
                                         headers=hdrs, stream=True, timeout=(15, 600))
                        if r.status_code == 401:
                            r.close()
                            try:
                                tok_ref[0] = _token()
                            except Exception:
                                pass
                            hdrs["Authorization"] = f"Bearer {tok_ref[0]}"
                            r = _SESSION.get(base_url, params=dl_params,
                                             headers=hdrs, stream=True, timeout=(15, 600))
                        r.raise_for_status()
                        fd  = os.open(str(tmp), os.O_WRONLY)
                        pos = start
                        try:
                            for c in r.iter_content(CHUNK_MB * 1_048_576):
                                if c:
                                    os.pwrite(fd, c, pos)
                                    pos += len(c)
                                    bar.update(len(c))
                        finally:
                            os.close(fd)
                            r.close()
                        return
                    except Exception as e:
                        if attempt == MAX_RETRY:
                            errors.append(f"Chunk {start}-{end}: {e}")
                            return
                        time.sleep(attempt)

            with ThreadPoolExecutor(max_workers=n) as ex:
                futs = [ex.submit(_par_chunk, s, e) for s, e in ranges]
                for f in as_completed(futs):
                    pass

            if errors:
                tmp.unlink(missing_ok=True)
                bar.finish(False)
                print(f"  {R}✘ Parallel DL errors: {errors[0]}{X}")
                return False

            tmp.replace(dest)
            bar.finish(True)
            return True

        # Single-stream fallback
        if probe.status_code == 403:
            dl_params["acknowledgeAbuse"] = "true"
            try:
                tok = _token()
            except Exception:
                pass

        if probe.status_code == 403:
            fb  = requests.Session()
            fb.headers.update(DL_HEADERS)
            r1  = fb.get(
                "https://drive.google.com/uc",
                params={"export": "download", "id": fid},
                timeout=(15, 60),
            )
            confirm = None
            if r1.status_code == 200:
                m2 = re.search(r'confirm=([0-9A-Za-z_\-]+)', r1.text)
                if m2:
                    confirm = m2.group(1)
                for ck in fb.cookies:
                    if "download_warning" in ck.name.lower():
                        confirm = ck.value
                        break
            dl_p = {"export": "download", "id": fid}
            if confirm:
                dl_p["confirm"] = confirm
            r = fb.get(
                "https://drive.google.com/uc",
                params=dl_p, stream=True, timeout=(15, 600),
            )
        else:
            r = _SESSION.get(
                base_url, params=dl_params,
                headers={"Authorization": f"Bearer {tok}"},
                stream=True, timeout=(15, 600),
            )

        r.raise_for_status()
        if "text/html" in r.headers.get("Content-Type", ""):
            bar.finish(False)
            dest.unlink(missing_ok=True)
            print(f"\n  {R}✘ Got HTML — Drive blocked download.{X}")
            return False

        real_len = int(r.headers.get("Content-Length", 0))
        if real_len > 0:
            with bar._lock:
                bar.total = real_len

        with open(dest, "wb") as f:
            for chunk in r.iter_content(CHUNK_MB * 1_048_576):
                if chunk:
                    f.write(chunk)
                    bar.update(len(chunk))

        bar.finish(True)
        return True

    except Exception as e:
        bar.finish(False)
        dest.unlink(missing_ok=True)
        print(f"  {R}✘ ZIP download failed: {e}{X}")
        return False


# ══════════════════════════════════════════════════════════════════════
#  DRIVE FILE CLONE  (for Menu [4] — parallel + fallback)
# ══════════════════════════════════════════════════════════════════════
def _clone_single_to_colab(fid, fname, fsize, dest_path, tok):
    """
    Clone one Drive file to dest_path via the API.
    Uses parallel Range requests when supported, single-stream otherwise.
    Returns True on success.
    """
    if dest_path.exists() and fsize > 0 and dest_path.stat().st_size == fsize:
        print(f"  {G}✔ Already cached — skipping clone.{X}")
        return True

    dest_path.parent.mkdir(parents=True, exist_ok=True)
    base_url  = f"https://www.googleapis.com/drive/v3/files/{fid}"
    dl_params = {"alt": "media", "acknowledgeAbuse": "true", **_DRIVE_PARAMS}
    tmp       = dest_path.with_suffix(dest_path.suffix + ".part")

    try:
        tok_ref = [tok]
        probe_r = _SESSION.get(
            base_url, params=dl_params,
            headers={"Authorization": f"Bearer {tok}", "Range": "bytes=0-0"},
            stream=True, timeout=(15, 60), allow_redirects=True,
        )
        try:
            for _ in probe_r.iter_content(16):
                break
        finally:
            probe_r.close()

        range_ok = probe_r.status_code == 206
        cr_hdr   = probe_r.headers.get("Content-Range", "")
        try:
            size = int(cr_hdr.split("/")[-1])
        except Exception:
            size = int(probe_r.headers.get("Content-Length", fsize or 1))
        if size <= 0:
            size = fsize or 1

        real_url  = probe_r.url
        need_auth = "googleapis.com/drive/v3" in real_url

        if range_ok and size > 0:
            n      = THREADS
            cs     = size // n
            ranges = [
                (i * cs, size - 1 if i == n - 1 else (i + 1) * cs - 1)
                for i in range(n)
            ]
            print(f"  {G}✔ Parallel ({n} threads){X}  {_fmt_size(size)}")
            bar = LiveBar(size, fname[:26], phase="↓ Clone")

            def _chunk(start, end, fd):
                for attempt in range(1, MAX_RETRY + 1):
                    try:
                        hdrs = {"Range": f"bytes={start}-{end}"}
                        if need_auth:
                            hdrs["Authorization"] = f"Bearer {tok_ref[0]}"
                        r = _SESSION.get(
                            real_url,
                            params=dl_params if need_auth else {},
                            headers=hdrs, stream=True, timeout=(15, 600),
                        )
                        if r.status_code == 401:
                            r.close()
                            try:
                                tok_ref[0] = _token()
                            except Exception:
                                pass
                            hdrs["Authorization"] = f"Bearer {tok_ref[0]}"
                            r = _SESSION.get(
                                real_url, params=dl_params,
                                headers=hdrs, stream=True, timeout=(15, 600),
                            )
                        r.raise_for_status()
                        pos = start
                        for c in r.iter_content(CHUNK_MB * 1_048_576):
                            if not c:
                                continue
                            os.pwrite(fd, c, pos)
                            pos += len(c)
                            bar.update(len(c))
                        return
                    except Exception as e:
                        if attempt == MAX_RETRY:
                            raise RuntimeError(f"Chunk {start}-{end}: {e}")
                        time.sleep(attempt)

            with open(tmp, "wb") as fh:
                fh.seek(size - 1)
                fh.write(b"\x00")

            fd = os.open(str(tmp), os.O_WRONLY)
            try:
                with ThreadPoolExecutor(max_workers=n) as ex:
                    for fut in as_completed(
                        [ex.submit(_chunk, s, e, fd) for s, e in ranges]
                    ):
                        fut.result()
            finally:
                os.close(fd)

        else:
            # Single-stream fallback
            r = _SESSION.get(
                base_url, params=dl_params,
                headers={"Authorization": f"Bearer {tok}"},
                stream=True, timeout=(15, 600),
            )
            if r.status_code == 403:
                r.close()
                r = _SESSION.get(
                    base_url,
                    params={**dl_params, "acknowledgeAbuse": "true"},
                    headers={"Authorization": f"Bearer {tok}"},
                    stream=True, timeout=(15, 600),
                )
            r.raise_for_status()
            if "text/html" in r.headers.get("Content-Type", ""):
                print(f"  {R}✘ Got HTML — Drive blocked.{X}")
                tmp.unlink(missing_ok=True)
                return False

            real_len = int(r.headers.get("Content-Length", 0))
            sz  = real_len if real_len > 0 else size
            bar = LiveBar(sz, fname[:26], phase="↓ Clone")
            with open(tmp, "wb") as fh:
                for chunk in r.iter_content(CHUNK_MB * 1_048_576):
                    if chunk:
                        fh.write(chunk)
                        bar.update(len(chunk))

        tmp.replace(dest_path)
        bar.finish(True)
        return True

    except Exception as e:
        try:
            bar.finish(False)
        except Exception:
            pass
        tmp.unlink(missing_ok=True)
        print(f"  {R}✘ Clone failed: {e}{X}")
        return False


# ══════════════════════════════════════════════════════════════════════
#  AUTO-FIX v5 ENGINE
# ══════════════════════════════════════════════════════════════════════
def auto_fix_v5(fp, known_fid=None, drive_dest=None):
    """
    Core fix routine:
      1. Probe audio + subtitle tracks in parallel.
      2. Sort audio so the highest-priority language is track 0.
      3. Keep Tamil/Telugu/Malayalam/Kannada/Hindi/English subtitles; drop others.
      4. Remux with mkvmerge (MKV) or ffmpeg (other containers).
      5. Free source file immediately after remux.
      6. Upload result to Drive via resumable API.
    Returns True on success.
    """
    fp = Path(fp)

    with ThreadPoolExecutor(max_workers=2) as _ex:
        before_audio = _ex.submit(_audio_tracks, fp).result()
        before_subs  = _ex.submit(_sub_tracks,   fp).result()

    if _vid_count(fp) == 0:
        print(f"  {Y}⚠ No video stream found — skipped.{X}")
        return False

    if not before_audio:
        print(f"  {Y}⚠ No audio tracks — skipped.{X}")
        return False

    sorted_audio = sorted(before_audio, key=lambda t: _lang_pri(t["language"]))
    eng_subs     = _filter_subs(before_subs)   # keep tam/tel/mal/kan/hin/eng only
    engine       = "mkvmerge" if fp.suffix.lower() == ".mkv" else "ffmpeg"
    drive_fp     = Path(drive_dest) if drive_dest else fp

    print(f"\n  {C}⚡ Auto-Fix v5{X}  {D}Engine: {engine}{X}")
    if before_audio != sorted_audio:
        print(f"  {Y}↕ Audio reorder → [{sorted_audio[0]['language']}] will be track 0{X}")
    else:
        print(f"  {G}✔ Audio order already correct{X}")
    dropped = len(before_subs) - len(eng_subs)
    if eng_subs:
        print(f"  {G}✔ {len(eng_subs)} subtitle(s) kept (tam/tel/mal/kan/hin/eng)"
              + (f"  {D}dropped {dropped} other(s){X}" if dropped else f"{X}"))
    else:
        print(f"  {D}  no subtitles{X}")
    print()

    # ── v9.1: Smart remux skip ────────────────────────────────────────
    needs_fix, reason = _tracks_need_fix(fp, sorted_audio, eng_subs)
    if not needs_fix:
        print(f"  {G}⚡ SMART SKIP:{X} tracks already correct — remux not needed.")
        print(f"  {D}  ({reason}){X}")
        print(f"  {B}✔ Drive file already correct — no upload needed.{X}  {Y}{drive_fp.name[:55]}{X}")
        return True
    else:
        print(f"  {Y}⚙ Fix required:{X} {D}{reason}{X}")

    # Download from Drive FUSE to local NVMe if needed (improves remux speed)
    src = fp
    if known_fid and str(fp).startswith("/content/drive"):
        try:
            tok  = _token()
            meta = _SESSION.get(
                f"https://www.googleapis.com/drive/v3/files/{known_fid}",
                params={"fields": "size,name", **_DRIVE_PARAMS},
                headers={"Authorization": f"Bearer {tok}"},
                timeout=15,
            )
            if meta.status_code == 200:
                info = meta.json()
                sz   = int(info.get("size", 0))
                nm   = info.get("name", fp.name)
                if sz > 0:
                    local = _drive_download_local(known_fid, nm, sz)
                    if local:
                        src = local
        except Exception as ex:
            print(f"  {Y}⚠ Local DL skipped ({ex}) — using Drive FUSE{X}")

    tmp = Path("/content") / (src.stem[:60] + "_AUTOFIX_TMP" + src.suffix)
    ok  = _run_remux(src, tmp, sorted_audio, eng_subs, engine)

    # Free source from /content immediately to reclaim NVMe space
    for _f in {src, fp}:
        if _f.exists() and str(_f).startswith("/content") and _f != tmp:
            try:
                _sz = _f.stat().st_size
                _f.unlink(missing_ok=True)
                print(f"  {D}🗑 Source freed ({_fmt_size(_sz)}) — starting upload.{X}")
            except Exception:
                pass

    if not ok:
        return False

    result = _upload_to_drive(tmp, drive_fp, known_fid)
    if result:
        print(f"\n  {B}✔ Fix complete!{X}  {Y}{drive_fp.name[:55]}{X}")
    return result


# Public alias used by some external callers
auto_fix_silent = auto_fix_v5


# ══════════════════════════════════════════════════════════════════════
#  MANUAL TRACK EDITOR  (used by Menu [6])
# ══════════════════════════════════════════════════════════════════════
def _manual_edit_all_tracks(audio_tracks, sub_tracks):
    """
    Interactive editor: show every audio + subtitle track in a table.
    The user edits title + language for each track in one pass.
    Press Enter to keep the current value; type 'x' to abort all edits.
    Returns (edited_audio_list, edited_sub_list).
    """
    print(f"\n{M}{'═' * 68}{X}")
    print(f"  {M}✏  MANUAL TRACK EDITOR{X}")
    print(f"  {D}Press Enter = keep current value.   x = cancel all edits.{X}")
    print(f"{M}{'═' * 68}{X}")

    # Display current state
    print(f"\n  {C}🔊 Audio Tracks:{X}")
    for t in audio_tracks:
        dflt = f"{G}★ default{X}" if t["is_default"] else f"{D}no{X}"
        print(
            f"    [{t['track_num']}] Lang:{C}{t['language']:<5}{X}  "
            f"Title:{Y}{(t['title'] or '')[:35]:<35}{X}  "
            f"Codec:{t['codec']} {t['channels']}ch  {dflt}"
        )
    if sub_tracks:
        print(f"\n  {B}💬 Subtitle Tracks:{X}")
        for s in sub_tracks:
            dflt = f"{G}★ default{X}" if s["is_default"] else f"{D}no{X}"
            print(
                f"    [{s['track_num']}] Lang:{B}{s['language']:<5}{X}  "
                f"Title:{Y}{(s['title'] or '')[:35]:<35}{X}  "
                f"Codec:{s['codec']}  {dflt}"
            )
    else:
        print(f"  {D}  (no subtitle tracks){X}")

    print(f"\n{C}{'─' * 68}{X}")
    print(f"  {W}Enter new values below  {D}(Enter = keep · x = cancel):{X}\n")

    new_audio = copy.deepcopy(audio_tracks)
    new_subs  = copy.deepcopy(sub_tracks)

    def _ask(prompt, current):
        try:
            val = input(f"    {prompt} [{C}{current}{X}]: ").strip()
        except (EOFError, KeyboardInterrupt):
            return None
        if val.lower() == "x":
            return None
        return val if val else current

    # Edit audio tracks
    print(f"  {C}🔊 Audio — edit each track:{X}")
    for t in new_audio:
        print(f"\n  {W}Audio [{t['track_num']}]  "
              f"title:{Y}{t['title'] or ''}{X}  lang:{C}{t['language']}{X}")
        v = _ask("New title  (Enter=keep, x=cancel all)", t["title"] or "")
        if v is None:
            print(f"  {Y}↩ Cancelled — no changes applied.{X}")
            return audio_tracks, sub_tracks
        t["title"] = v
        v = _ask("New lang   (e.g. tam/eng/hin, Enter=keep, x=cancel all)", t["language"])
        if v is None:
            print(f"  {Y}↩ Cancelled — no changes applied.{X}")
            return audio_tracks, sub_tracks
        t["language"] = _norm_lang(v) if v != t["language"] else t["language"]

    # Edit subtitle tracks
    if new_subs:
        print(f"\n  {B}💬 Subtitles — edit each track:{X}")
        for s in new_subs:
            print(f"\n  {W}Subtitle [{s['track_num']}]  "
                  f"title:{Y}{s['title'] or ''}{X}  lang:{B}{s['language']}{X}")
            v = _ask("New title  (Enter=keep, x=cancel all)", s["title"] or "")
            if v is None:
                print(f"  {Y}↩ Cancelled — no changes applied.{X}")
                return audio_tracks, sub_tracks
            s["title"] = v
            v = _ask("New lang   (e.g. eng/tam, Enter=keep, x=cancel all)", s["language"])
            if v is None:
                print(f"  {Y}↩ Cancelled — no changes applied.{X}")
                return audio_tracks, sub_tracks
            s["language"] = _norm_lang(v) if v != s["language"] else s["language"]

    # Summary
    print(f"\n{G}{'─' * 68}{X}")
    print(f"  {G}✔ Updated track list:{X}")
    for t in new_audio:
        print(f"    {G}Audio [{t['track_num']}]{X}  "
              f"lang:{C}{t['language']:<5}{X}  title:{Y}{t['title'] or ''}{X}")
    for s in new_subs:
        print(f"    {B}Sub   [{s['track_num']}]{X}  "
              f"lang:{B}{s['language']:<5}{X}  title:{Y}{s['title'] or ''}{X}")
    print(f"{G}{'─' * 68}{X}\n")

    return new_audio, new_subs


# ══════════════════════════════════════════════════════════════════════
#  MENU [1] — Download → Auto-Rename → Auto-Fix → Upload
# ══════════════════════════════════════════════════════════════════════
def run_fix_and_upload():
    if not _install_tools():
        return

    print(f"\n{M}{'═' * 68}{X}")
    print(f"  {M}📥 Download → Auto-Rename → Auto-Fix → Upload to Drive{X}")
    print(f"  {W}Enter URLs (one per line). Blank line to start  "
          f"{D}(type 0 to cancel):{X}")
    print(f"{M}{'═' * 68}{X}\n")

    urls = []
    while True:
        try:
            raw = input(f"  {D}URL {len(urls) + 1}: {X}").strip()
        except (EOFError, KeyboardInterrupt):
            break
        if not raw:
            break
        if raw in ("0", "back", "cancel", "q", "quit"):
            print(f"  {Y}↩ Cancelled — returning to menu.{X}")
            return
        if raw.startswith(("http://", "https://")) and "." in raw and len(raw) > 12:
            urls.append(raw)
            print(f"    {G}✔ {D}{raw[:70]}{X}")
        else:
            print(f"    {R}⚠ Not a valid URL — skipped.  {D}(type 0 to cancel){X}")

    if not urls:
        print(f"\n{Y}No URLs entered.{X}")
        return

    print(f"\n{G}✔ {len(urls)} URL(s) queued.{X}\n{'─' * 68}\n")
    ok = fail = 0

    for i, url in enumerate(urls):
        local_path, drive_path = _download_external(url, i, len(urls))
        if local_path is None:
            fail += 1
            print(f"\n{'─' * 68}")
            continue
        print(f"  {G}✔ File: {Y}{local_path.name}{X}")
        print(f"\n  {C}🤖 Auto-Fix:{X} {Y}{local_path.name}{X}")
        if auto_fix_v5(local_path, known_fid=None, drive_dest=drive_path):
            ok += 1
        else:
            fail += 1
        print(f"\n{'─' * 68}")

    print(f"\n{'═' * 68}")
    print(f"  {G}✔ Done: {ok}{X}   {R}✘ Failed: {fail}{X}   Saved to: {Y}{FOLDER}{X}")
    print(f"{'═' * 68}\n")


# ══════════════════════════════════════════════════════════════════════
#  MENU [2] — Direct ZIP URL → Download → Extract → Remux → Upload
# ══════════════════════════════════════════════════════════════════════
def direct_zip_downloader():
    if not _install_tools():
        return
    _ensure_unzip()

    print(f"\n{M}{'═' * 68}{X}")
    print(f"  {M}📦 DIRECT ZIP URL → EXTRACT → REMUX → UPLOAD{X}")
    print(f"  {W}Paste direct ZIP URLs (one per line). "
          f"Blank line to start  {D}(type 0 to cancel):{X}")
    print(f"{M}{'═' * 68}{X}\n")

    zip_urls = []
    while True:
        try:
            raw = input(f"  {D}ZIP URL {len(zip_urls) + 1}: {X}").strip()
        except (EOFError, KeyboardInterrupt):
            break
        if not raw:
            break
        if raw in ("0", "back", "cancel", "q", "quit"):
            print(f"  {Y}↩ Cancelled — returning to menu.{X}")
            return
        if raw.startswith("http"):
            zip_urls.append(raw)
            print(f"    {G}✔ {D}{raw[:60]}{X}")
        else:
            print(f"    {R}⚠ Not a URL — skipped.  {D}(type 0 to cancel){X}")

    if not zip_urls:
        print(f"\n{Y}No valid ZIP URLs entered.{X}")
        return

    try:
        folder_name = input(
            f"\n  {W}New Drive folder name  {D}(0 to cancel){W}: {X}"
        ).strip()
    except (EOFError, KeyboardInterrupt):
        return
    if not folder_name or folder_name in ("0", "back", "cancel", "q", "quit"):
        print(f"  {Y}↩ Cancelled — returning to menu.{X}")
        return

    try:
        tok = _token()
    except RuntimeError as e:
        print(f"  {R}✘ Auth error: {e}{X}")
        return

    parent_id = _get_folder_id(tok) or _resolve_folder_id_via_file(tok)
    if not parent_id:
        print(f"  {R}✘ Could not resolve parent folder ID.{X}")
        return

    new_folder_id = _create_drive_folder(folder_name, parent_id, tok)
    if not new_folder_id:
        return

    total_ok = total_fail = 0

    for zip_idx, url in enumerate(zip_urls):
        zip_name = _safe_name(url)
        if not zip_name.lower().endswith(".zip"):
            zip_name = Path(zip_name).stem + ".zip"
        local_zip = Path("/content") / zip_name
        tmp_zip   = Path("/content") / f".{zip_name}.part"

        parallel, size = _server_range(url)
        if size == 0:
            try:
                h    = _SESSION.head(url, timeout=TIMEOUT, allow_redirects=True)
                size = int(h.headers.get("content-length", 0))
            except Exception:
                pass

        dl_ok = False

        if local_zip.exists() and size > 0 and local_zip.stat().st_size == size:
            print(f"  {G}✔ Already cached locally — {_fmt_size(size)}{X}")
            dl_ok = True
        else:
            bar = LiveBar(size or 1, zip_name[:26], phase="↓ ZIP DL")

            # Stage 1: parallel chunks
            if parallel and size > 0:
                try:
                    cs     = size // THREADS
                    ranges = [
                        (i * cs, size - 1 if i == THREADS - 1 else (i + 1) * cs - 1)
                        for i in range(THREADS)
                    ]
                    with open(tmp_zip, "wb") as f:
                        f.seek(size - 1)
                        f.write(b"\x00")
                    _cancel_zip = threading.Event()

                    def _zw(args):
                        _, (s, e) = args
                        _fetch_chunk(url, s, e, bar.update, tmp_zip,
                                     cancel_event=_cancel_zip)

                    with ThreadPoolExecutor(max_workers=THREADS) as ex:
                        for fut in as_completed(
                            {ex.submit(_zw, a): a for a in enumerate(ranges)}
                        ):
                            fut.result()
                    tmp_zip.replace(local_zip)
                    bar.finish(True)
                    dl_ok = True
                except Exception:
                    bar._alive = False
                    time.sleep(0.3)
                    tmp_zip.unlink(missing_ok=True)
                    bar.done   = 0;  bar._lb   = 0;  bar._spd = 0.0
                    bar._t0    = time.time(); bar._lt = time.time()
                    bar.phase  = "↓ Multi-Stream"
                    bar._alive = True
                    threading.Thread(target=bar._loop, daemon=True).start()

            # Stage 2: multi-stream
            if not dl_ok:
                try:
                    _multistream_dl(url, tmp_zip, size, bar, STREAM_CONNS)
                    tmp_zip.replace(local_zip)
                    bar.finish(True)
                    dl_ok = True
                except Exception:
                    bar._alive = False
                    time.sleep(0.25)
                    tmp_zip.unlink(missing_ok=True)
                    bar.done   = 0;  bar._lb   = 0;  bar._spd = 0.0
                    bar._t0    = time.time(); bar._lt = time.time()
                    bar.phase  = "↓ Stream"
                    bar._alive = True
                    threading.Thread(target=bar._loop, daemon=True).start()

            # Stage 3: single stream
            if not dl_ok:
                try:
                    _stream_dl(url, tmp_zip, bar)
                    tmp_zip.replace(local_zip)
                    bar.finish(True)
                    dl_ok = True
                except Exception as e_single:
                    tmp_zip.unlink(missing_ok=True)
                    bar.finish(False)
                    print(f"  {R}✘ ZIP download failed: {e_single}{X}")

        if not dl_ok:
            total_fail += 1
            print(f"\n{'─' * 68}")
            continue

        extract_dir = Path("/content") / f"_dzip_{zip_idx}"
        extract_dir.mkdir(exist_ok=True)

        if not _extract_zip_with_progress(local_zip, extract_dir):
            local_zip.unlink(missing_ok=True)
            total_fail += 1
            print(f"\n{'─' * 68}")
            continue

        local_zip.unlink(missing_ok=True)
        z_ok, z_fail = _process_video_files_from_dir(
            extract_dir, folder_name, new_folder_id, tok
        )
        total_ok   += z_ok
        total_fail += z_fail
        shutil.rmtree(extract_dir, ignore_errors=True)
        print(f"\n  {G}ZIP {zip_idx + 1} done{X} — {G}✔ {z_ok}{X}  {R}✘ {z_fail}{X}")
        print(f"{'─' * 68}")

    print(f"\n{'═' * 68}")
    print(f"  {G}✔ Total uploaded: {total_ok}{X}   {R}✘ Failed: {total_fail}{X}")
    print(f"  Saved to: {Y}{FOLDER}/{folder_name}{X}")
    print(f"{'═' * 68}\n")


# ══════════════════════════════════════════════════════════════════════
#  MENU [3] — G-Drive ZIP → Extract → Remux → Upload
# ══════════════════════════════════════════════════════════════════════
def gdrive_zip_extractor():
    if not _install_tools():
        return
    _ensure_unzip()

    print(f"\n{M}{'═' * 68}{X}")
    print(f"  {M}🗜  G-DRIVE ZIP EXTRACTOR → REMUX → UPLOAD{X}")
    print(f"  {W}Paste Drive ZIP share URLs (one per line). "
          f"Blank line to start  {D}(type 0 to cancel):{X}")
    print(f"{M}{'═' * 68}{X}\n")

    zip_entries = []
    while True:
        try:
            raw = input(f"  {D}ZIP URL {len(zip_entries) + 1}: {X}").strip()
        except (EOFError, KeyboardInterrupt):
            break
        if not raw:
            break
        if raw in ("0", "back", "cancel", "q", "quit"):
            print(f"  {Y}↩ Cancelled — returning to menu.{X}")
            return
        fid = _extract_fid(raw)
        if fid:
            zip_entries.append(fid)
            print(f"    {G}✔ ID: {fid}{X}")
        else:
            print(f"    {R}⚠ Could not parse Drive file ID — skipped.  "
                  f"{D}(type 0 to cancel){X}")

    if not zip_entries:
        print(f"\n{Y}No valid ZIP URLs entered.{X}")
        return

    try:
        folder_name = input(
            f"\n  {W}New Drive folder name  {D}(0 to cancel){W}: {X}"
        ).strip()
    except (EOFError, KeyboardInterrupt):
        return
    if not folder_name or folder_name in ("0", "back", "cancel", "q", "quit"):
        print(f"  {Y}↩ Cancelled — returning to menu.{X}")
        return

    try:
        tok = _token()
    except RuntimeError as e:
        print(f"  {R}✘ Auth error: {e}{X}")
        return

    parent_id = _get_folder_id(tok) or _resolve_folder_id_via_file(tok)
    if not parent_id:
        print(f"  {R}✘ Could not resolve parent folder ID.{X}")
        return

    new_folder_id = _create_drive_folder(folder_name, parent_id, tok)
    if not new_folder_id:
        return

    total_ok = total_fail = 0

    for zip_idx, fid in enumerate(zip_entries):
        print(f"\n{W}[ZIP {zip_idx + 1}/{len(zip_entries)}]{X}  {C}ID: {fid}{X}")
        fname = _get_fname(fid)
        if not fname:
            print(f"  {R}✘ Could not resolve ZIP filename — skipped.{X}")
            total_fail += 1
            continue
        print(f"  {G}✔ {fname}{X}")

        local_zip = Path("/content") / fname
        r_meta    = _SESSION.get(
            f"https://www.googleapis.com/drive/v3/files/{fid}",
            params={"fields": "size", **_DRIVE_PARAMS},
            headers={"Authorization": f"Bearer {tok}"},
            timeout=15,
        )
        zip_size = int(r_meta.json().get("size", 0)) if r_meta.status_code == 200 else 0

        if not _download_zip_from_drive(fid, fname, zip_size, local_zip):
            total_fail += 1
            continue

        extract_dir = Path("/content") / f"_zip_{fid[:12]}"
        extract_dir.mkdir(exist_ok=True)

        if not _extract_zip_with_progress(local_zip, extract_dir):
            local_zip.unlink(missing_ok=True)
            total_fail += 1
            continue

        local_zip.unlink(missing_ok=True)
        z_ok, z_fail = _process_video_files_from_dir(
            extract_dir, folder_name, new_folder_id, tok
        )
        total_ok   += z_ok
        total_fail += z_fail
        shutil.rmtree(extract_dir, ignore_errors=True)
        print(f"\n  {G}ZIP {zip_idx + 1} done{X} — {G}✔ {z_ok}{X}  {R}✘ {z_fail}{X}")
        print(f"{'─' * 68}")

    print(f"\n{'═' * 68}")
    print(f"  {G}✔ Total uploaded: {total_ok}{X}   {R}✘ Failed: {total_fail}{X}")
    print(f"  Folder: {Y}{FOLDER}/{folder_name}{X}")
    print(f"{'═' * 68}\n")


# ══════════════════════════════════════════════════════════════════════
#  MENU [4] — GDrive Clone → Auto-Remux → PATCH back to Drive
# ══════════════════════════════════════════════════════════════════════
def gdrive_clone_to_colab():
    """[4] Clone Drive file(s)/folder → remux → PATCH back in-place. Supports multiple URLs."""
    print(f"\n{M}{'═' * 68}{X}")
    print(f"  {M}📂 [4] GDRIVE CLONE → REMUX → PATCH BACK TO DRIVE  v9.1{X}")
    print(f"  {W}Paste Google Drive FILE or FOLDER share URLs.{X}")
    print(f"  {D}One URL per line · blank line = start · type 0 to cancel{X}")
    print(f"{M}{'═' * 68}{X}\n")

    raw_urls = []
    while True:
        try:
            raw = input(f"  {D}URL {len(raw_urls) + 1}: {X}").strip()
        except (EOFError, KeyboardInterrupt):
            break
        if not raw:
            break
        if raw in ("0", "back", "cancel", "q", "quit"):
            print(f"  {Y}↩ Cancelled — returning to menu.{X}")
            return
        raw_urls.append(raw)

    if not raw_urls:
        print(f"\n{Y}No URLs entered.{X}")
        return

    print(f"\n{G}✔ {len(raw_urls)} URL(s) queued.{X}\n{'─' * 68}\n")

    try:
        tok = _token()
    except Exception as e:
        print(f"  {R}✘ Auth error: {e}{X}")
        return

    _install_tools()

    grand_ok        = grand_fail    = 0
    t_grand_start   = time.time()

    for url_idx, raw in enumerate(raw_urls):
        print(f"\n{M}{'═' * 68}{X}")
        print(f"  {M}🔗 URL [{url_idx + 1}/{len(raw_urls)}]:{X} {C}{raw[:65]}{X}")
        print(f"{M}{'═' * 68}{X}\n")

        # Resolve Drive ID (file or folder)
        fid = _extract_fid(raw)
        if not fid:
            m = re.search(r"/folders/([a-zA-Z0-9_-]{20,})", raw)
            if m:
                fid = m.group(1)
        if not fid:
            print(f"  {R}✘ Could not parse Drive ID from URL — skipped.{X}")
            grand_fail += 1
            continue
        print(f"  {G}✔ Drive ID: {fid}{X}")

        try:
            tok = _token()
        except Exception as e:
            print(f"  {R}✘ Auth error: {e} — skipped.{X}")
            grand_fail += 1
            continue

        r_meta    = _drive_get(f"files/{fid}", {"fields": "id,name,size,mimeType"}, tok)
        if r_meta.status_code != 200:
            print(f"  {R}✘ Drive API error {r_meta.status_code} — skipped.{X}")
            grand_fail += 1
            continue

        meta      = r_meta.json()
        item_name = meta.get("name", "unknown")
        item_mime = meta.get("mimeType", "")
        item_size = int(meta.get("size", 0))
        is_folder = item_mime == "application/vnd.google-apps.folder"
        print(f"  {G}✔ {item_name}{X}  "
              f"{D}({'folder' if is_folder else _fmt_size(item_size)}){X}")

        dest_base = Path(f"/content/{item_name}")

        if is_folder:
            print(f"\n  {D}Scanning folder tree...{X}", end="", flush=True)
            all_files   = _gdrive_list_folder_recursive(fid, tok)
            video_files = [f for f in all_files if _is_video_file(f)]
            if not video_files:
                print(f"\r  {Y}No video files found in this folder — skipped.{X}")
                continue
            print(f"\r  {G}✔ Found {len(video_files)} video file(s):{X}")
            for i, fi in enumerate(video_files[:40], 1):
                print(f"    {G}[{i}]{X} {Y}{fi['rel_path'][:55]}{X}  "
                      f"{D}{_fmt_size(fi['size'])}{X}")
            if len(video_files) > 40:
                print(f"    {D}... and {len(video_files) - 40} more{X}")
        else:
            fi_single = {
                "fid": fid, "name": item_name, "size": item_size,
                "mimeType": item_mime, "rel_path": item_name,
            }
            if not _is_video_file(fi_single):
                print(f"  {Y}⚠ Not a video file — skipped.{X}")
                grand_fail += 1
                continue
            video_files = [fi_single]
            print(f"  {G}✔ Found 1 video file: {item_name[:55]}{X}")

        total_bytes = sum(f["size"] for f in video_files)
        print(f"\n  {W}Action : {G}Clone → Auto-Remux → PATCH back to Drive{X}")
        print(f"  {W}Files  : {G}{len(video_files)}{X}  "
              f"{D}({_fmt_size(total_bytes)} total){X}")
        print(f"  {Y}⚠ Drive files will be overwritten in-place (PATCH same file ID).{X}")
        print(f"  {G}✔ Auto-proceeding...{X}\n{'─' * 68}")

        ok_count = fail_count = 0
        t_start  = time.time()

        for idx, fi in enumerate(video_files):
            fname      = fi["name"]
            fsize      = fi["size"]
            src_fid    = fi["fid"]
            local_path = (
                dest_base / fi["rel_path"] if is_folder
                else (dest_base if dest_base.suffix else dest_base / fname)
            )
            print(f"\n{W}[{idx + 1}/{len(video_files)}]{X} "
                  f"{Y}{fi['rel_path'][:60]}{X}  {D}{_fmt_size(fsize)}{X}")

            # Refresh token every 5 files to avoid expiry on large folders
            if idx % 5 == 0:
                try:
                    tok = _token()
                except Exception:
                    pass

            if not _clone_single_to_colab(src_fid, fname, fsize, local_path, tok):
                print(f"  {R}✘ Clone failed — skipping.{X}")
                fail_count += 1
                print(f"{'─' * 68}")
                continue

            drive_dest = Path(FOLDER) / fname
            print(f"\n  {C}🤖 Auto-Fix:{X} {Y}{fname}{X}")
            try:
                success = auto_fix_v5(local_path, known_fid=src_fid,
                                      drive_dest=drive_dest)
            except Exception as e:
                print(f"  {R}✘ Auto-Fix exception: {e}{X}")
                success = False

            if local_path.exists():
                try:
                    sz = local_path.stat().st_size
                    local_path.unlink(missing_ok=True)
                    print(f"  {D}🗑 Local clone freed ({_fmt_size(sz)}).{X}")
                except Exception:
                    pass

            if success:
                ok_count += 1
                print(f"  {B}✔ Done — Drive file patched in-place.{X}")
            else:
                fail_count += 1
            print(f"{'─' * 68}")

        ela = time.time() - t_start
        print(f"\n  {G}✔ Fixed: {ok_count}{X}   {R}✘ Failed: {fail_count}{X}   "
              f"Total: {len(video_files)}")
        print(f"  Time: {int(ela)}s  ({_fmt_eta(ela)})")
        grand_ok   += ok_count
        grand_fail += fail_count

        if is_folder and dest_base.exists():
            try:
                shutil.rmtree(dest_base, ignore_errors=True)
                print(f"  {G}🗑 Local folder cleaned: {dest_base}{X}")
            except Exception:
                pass

    ela_total = time.time() - t_grand_start
    print(f"\n{'═' * 68}")
    print(f"  {G}✔ Total Fixed: {grand_ok}{X}  {R}✘ Total Failed: {grand_fail}{X}  "
          f"URLs: {len(raw_urls)}")
    print(f"  Total Time: {int(ela_total)}s  ({_fmt_eta(ela_total)})")
    print(f"{'═' * 68}\n")


# ══════════════════════════════════════════════════════════════════════
#  MENU [5] — Auto-Fix via Google Drive URL (Folder or File)
# ══════════════════════════════════════════════════════════════════════
def auto_fix_smart():
    """[5] Auto-Fix via Drive URL — accepts Folder URL(s) and/or File URL(s)."""
    if not _install_tools():
        return

    print(f"\n{M}{'=' * 68}{X}")
    print(f"  {M}🤖 AUTO-FIX via Google Drive URL{X}")
    print(f"  {W}Paste a Drive FOLDER URL  — fixes every video inside it.{X}")
    print(f"  {W}Paste Drive FILE URL(s)   — fixes each file individually.{X}")
    print(f"  {D}(one URL per line · blank line = start · type 0 to cancel){X}")
    print(f"{M}{'=' * 68}{X}\n")

    raw_urls = []
    while True:
        try:
            raw = input(f"  {D}URL {len(raw_urls) + 1}: {X}").strip()
        except (EOFError, KeyboardInterrupt):
            break
        if not raw:
            break
        if raw in ("0", "back", "cancel", "q", "quit"):
            print(f"  {Y}↩ Cancelled — returning to menu.{X}")
            return
        raw_urls.append(raw)

    if not raw_urls:
        print(f"\n{Y}No URLs entered.{X}")
        return

    folder_entries = []
    file_entries   = []

    for raw in raw_urls:
        m = re.search(r"/folders/([a-zA-Z0-9_-]{20,})", raw)
        if m:
            folder_entries.append(m.group(1))
            print(f"  {G}✔ Folder URL — ID: {m.group(1)}{X}")
            continue
        fid = _extract_fid(raw)
        if fid:
            file_entries.append((raw, fid))
            print(f"  {G}✔ File URL  — ID: {fid}{X}")
        else:
            print(f"  {R}⚠ Could not parse Drive ID — skipped: {raw[:60]}{X}")

    print()
    ok = fail = skip = 0

    # ── Process folders ────────────────────────────────────────────────
    for folder_fid in folder_entries:
        print(f"\n{C}{'─' * 68}{X}")
        print(f"  {C}📂 Folder ID: {folder_fid}{X}")
        try:
            tok   = _token()
            items = _list_videos_in_drive_folder(folder_fid, tok)
        except Exception as e:
            print(f"  {R}✘ API error: {e}{X}")
            fail += 1
            continue

        if not items:
            print(f"  {Y}No video files found in that folder.{X}")
            continue

        print(f"  {G}✔ Found {len(items)} video file(s):{X}")
        for i, it in enumerate(items):
            sz = _fmt_size(int(it.get("size", 0))) if it.get("size") else "? size"
            print(f"    {G}[{i + 1}]{X} {Y}{it['name'][:55]}{X}  {D}{sz}{X}")
        print()

        ans = input(
            f"  {W}Fix ALL {len(items)} files in this folder? (yes/no): {X}"
        ).strip().lower()
        if ans != "yes":
            print(f"  {D}Skipped folder.{X}")
            continue
        print(f"\n{'─' * 68}\n")

        for i, it in enumerate(items):
            fid   = it["id"]
            fname = it["name"]
            size  = int(it.get("size", 0))
            print(f"{W}[{i + 1}/{len(items)}]{X} {Y}{fname[:55]}{X}  "
                  f"{C}id:{fid[:20]}{X}")
            local_fp = _drive_download_local(fid, fname, size)
            if not local_fp:
                print(f"  {R}✘ Download failed — skipped.{X}")
                fail += 1
                print(f"\n{'─' * 68}")
                continue
            if not _audio_tracks(local_fp):
                print(f"  {D}No audio tracks — skipped.{X}")
                skip += 1
                local_fp.unlink(missing_ok=True)
                print(f"\n{'─' * 68}")
                continue
            drive_dest = Path(FOLDER) / fname
            if auto_fix_v5(local_fp, known_fid=fid, drive_dest=drive_dest):
                ok += 1
                local_fp.unlink(missing_ok=True)  # clean smart-skip leftover
            else:
                fail += 1
                local_fp.unlink(missing_ok=True)
            print(f"\n{'─' * 68}")

    # ── Process individual files ───────────────────────────────────────
    if file_entries:
        print(f"\n{C}{'─' * 68}{X}")
        print(f"  {C}🎬 Processing {len(file_entries)} file(s)...{X}\n{'─' * 68}\n")

        for i, (url, fid) in enumerate(file_entries):
            print(f"{W}[{i + 1}/{len(file_entries)}]{X}  {C}{fid}{X}")
            try:
                tok    = _token()
                r_meta = _drive_get(f"files/{fid}", {"fields": "name,size"}, tok)
                if r_meta.status_code != 200:
                    print(f"  {R}✘ API error {r_meta.status_code} — skipped.{X}")
                    fail += 1
                    print(f"\n{'─' * 68}")
                    continue
                info  = r_meta.json()
                fname = info.get("name", "")
                size  = int(info.get("size", 0))
            except Exception as e:
                print(f"  {R}✘ Metadata fetch failed: {e}{X}")
                fail += 1
                print(f"\n{'─' * 68}")
                continue

            if not fname:
                print(f"  {R}✘ Could not resolve filename.{X}")
                fail += 1
                print(f"\n{'─' * 68}")
                continue

            print(f"  {G}✔ {fname}  {D}({_fmt_size(size)}){X}")
            local_fp = _drive_download_local(fid, fname, size)
            if not local_fp:
                print(f"  {R}✘ Download failed — skipped.{X}")
                fail += 1
                print(f"\n{'─' * 68}")
                continue
            if not _audio_tracks(local_fp):
                print(f"  {D}No audio tracks — skipped.{X}")
                local_fp.unlink(missing_ok=True)
                fail += 1
                print(f"\n{'─' * 68}")
                continue

            drive_dest = Path(FOLDER) / fname
            if auto_fix_v5(local_fp, known_fid=fid, drive_dest=drive_dest):
                ok += 1
                local_fp.unlink(missing_ok=True)  # clean smart-skip leftover
            else:
                fail += 1
                local_fp.unlink(missing_ok=True)
            print(f"\n{'─' * 68}")

    print(f"\n{'=' * 68}")
    print(f"  {G}✔ Fixed: {ok}{X}  {R}✘ Failed: {fail}{X}  {D}Skipped: {skip}{X}")
    print(f"{'=' * 68}\n")


# ══════════════════════════════════════════════════════════════════════
#  MENU [6] — Manual Edit Tracks → Remux → Upload
# ══════════════════════════════════════════════════════════════════════
def manual_edit_and_upload():
    """
    [6] Manual Edit Tracks → Remux → Upload
    Paste Drive file URL(s) or direct video URL(s).
    Edits every audio + subtitle title & language before remux + upload.
    """
    if not _install_tools():
        return

    print(f"\n{M}{'═' * 68}{X}")
    print(f"  {M}✏  [6] MANUAL EDIT TRACKS → REMUX → UPLOAD{X}")
    print(f"  {W}Paste Drive file URL(s) or direct video URL(s).{X}")
    print(f"  {D}One URL per line · blank line = start · 0 = cancel{X}")
    print(f"{M}{'═' * 68}{X}\n")

    raw_urls = []
    while True:
        try:
            raw = input(f"  {D}URL {len(raw_urls) + 1}: {X}").strip()
        except (EOFError, KeyboardInterrupt):
            break
        if not raw:
            break
        if raw in ("0", "back", "cancel", "q", "quit"):
            print(f"  {Y}↩ Cancelled.{X}")
            return
        raw_urls.append(raw)

    if not raw_urls:
        print(f"\n{Y}No URLs entered.{X}")
        return

    print(f"\n{G}✔ {len(raw_urls)} URL(s) queued.{X}\n{'─' * 68}\n")
    ok = fail = 0

    for i, raw in enumerate(raw_urls):
        print(f"\n{W}[{i + 1}/{len(raw_urls)}]{X}  {C}{raw[:70]}{X}")

        # ── Resolve URL to a local file ───────────────────────────────
        fid        = _extract_fid(raw)
        local_fp   = None
        drive_dest = None
        known_fid  = None

        if fid:
            # Google Drive file URL
            try:
                tok    = _token()
                r_meta = _drive_get(f"files/{fid}", {"fields": "name,size"}, tok)
                if r_meta.status_code != 200:
                    print(f"  {R}✘ Drive API {r_meta.status_code} — skipped.{X}")
                    fail += 1
                    continue
                info  = r_meta.json()
                fname = info.get("name", "")
                size  = int(info.get("size", 0))
            except Exception as e:
                print(f"  {R}✘ Metadata error: {e}{X}")
                fail += 1
                continue
            if not fname:
                print(f"  {R}✘ Could not resolve filename.{X}")
                fail += 1
                continue
            print(f"  {G}✔ {fname}  {D}({_fmt_size(size)}){X}")
            local_fp   = _drive_download_local(fid, fname, size)
            drive_dest = Path(FOLDER) / fname
            known_fid  = fid

        elif raw.startswith(("http://", "https://")):
            # Direct video URL
            local_fp, drive_dest = _download_external(raw, i, len(raw_urls))
            known_fid = None
        else:
            print(f"  {R}✘ Not a valid Drive or direct URL — skipped.{X}")
            fail += 1
            continue

        if not local_fp:
            print(f"  {R}✘ Download failed — skipped.{X}")
            fail += 1
            continue

        # ── Probe tracks ─────────────────────────────────────────────
        with ThreadPoolExecutor(max_workers=2) as _ex:
            a_tracks = _ex.submit(_audio_tracks, local_fp).result()
            s_tracks = _ex.submit(_sub_tracks,   local_fp).result()

        if _vid_count(local_fp) == 0:
            print(f"  {Y}⚠ No video stream found — skipped.{X}")
            local_fp.unlink(missing_ok=True)
            fail += 1
            continue

        if not a_tracks:
            print(f"  {Y}⚠ No audio tracks — skipped.{X}")
            local_fp.unlink(missing_ok=True)
            fail += 1
            continue

        sorted_audio = sorted(a_tracks, key=lambda t: _lang_pri(t["language"]))
        all_subs     = s_tracks   # pass ALL subs to editor

        print(f"\n  {C}File:{X} {Y}{local_fp.name[:60]}{X}")
        print(f"  Audio: {len(a_tracks)} track(s)   Subs: {len(s_tracks)} track(s)")

        # ── Manual edit ───────────────────────────────────────────────
        sorted_audio, all_subs = _manual_edit_all_tracks(sorted_audio, all_subs)
        sorted_audio = sorted(sorted_audio, key=lambda t: _lang_pri(t["language"]))

        # Keep tam/tel/mal/kan/hin/eng subtitle tracks only
        eng_subs = _filter_subs(all_subs)

        # ── Remux ─────────────────────────────────────────────────────
        engine = "mkvmerge" if local_fp.suffix.lower() == ".mkv" else "ffmpeg"
        tmp    = Path("/content") / (local_fp.stem[:60] + "_MANU6_TMP" + local_fp.suffix)
        print(f"\n  {C}⚙ Remuxing  [{engine}]...{X}")

        if not _run_remux_with_titles(local_fp, tmp, sorted_audio, eng_subs, engine):
            local_fp.unlink(missing_ok=True)
            fail += 1
            print(f"\n{'─' * 68}")
            continue

        # ── Free source before upload ─────────────────────────────────
        if local_fp.exists() and str(local_fp).startswith("/content") and local_fp != tmp:
            try:
                _sz = local_fp.stat().st_size
                local_fp.unlink(missing_ok=True)
                print(f"  {D}🗑 Source freed ({_fmt_size(_sz)}) — uploading...{X}")
            except Exception:
                pass

        # ── Upload ────────────────────────────────────────────────────
        fp_drive = Path(drive_dest) if drive_dest else Path(FOLDER) / tmp.name
        if _upload_to_drive(tmp, fp_drive, known_fid):
            print(f"  {B}✔ Done!{X}  {Y}{fp_drive.name[:55]}{X}")
            ok += 1
        else:
            fail += 1
        print(f"\n{'─' * 68}")

    print(f"\n{'═' * 68}")
    print(f"  {G}✔ Done: {ok}{X}  {R}✘ Failed: {fail}{X}  Saved to: {Y}{FOLDER}{X}")
    print(f"{'═' * 68}\n")


# ══════════════════════════════════════════════════════════════════════
#  BANNER + MAIN MENU
# ══════════════════════════════════════════════════════════════════════
def _banner():
    print(f"""{C}
╔══════════════════════════════════════════════════════════════╗
║    🎬📺 TAMIZHAN MOVIES — DOWNLOADER + AUTO-FIX  v9.1       ║
║   Direct Download → Fix → Upload to Drive (Maximum Speed)    ║
║   ⚡ Smart remux skip  🔁 Resume broken downloads            ║
╚══════════════════════════════════════════════════════════════╝{X}
  Folder  : {Y}{FOLDER}{X}
  Threads : {G}{THREADS}{X}   Chunk: {G}{CHUNK_MB} MB{X}  Pool: {G}128 connections{X}  Stream-conns: {G}{STREAM_CONNS}{X}

  Auto-Fix rules:
    🎬 Video      → default = {G}YES{X}
    🔊 Audio      → {G}Tamil first{X} (default+forced=✔), Tel→Mal→Kan→Hin→Eng→others, titles cleared
    💬 Subtitles  → {G}tam/tel/mal/kan/hin/eng kept{X}, others dropped
    ☁  Upload     → Drive API resumable, 512 MB chunks, {G}Maximum Speed{X}
""")


def main_menu():
    _banner()
    while True:
        print(f"""{C}╔══════════════════════════════════════════════════════╗
║              MAIN MENU — What to do?                 ║
╚══════════════════════════════════════════════════════╝{X}
  {G}[1]{X} 📥  Download → Auto-Rename → Auto-Fix → Upload to Drive  {D}(paste any direct URL & CDN URL){X}
  {G}[2]{X} 📦  Direct ZIP file URL → Download → Extract → Remux → Upload to Drive  {D}(paste any direct ZIP URL){X}
  {G}[3]{X} 🗃️  G-Drive ZIP file Extractor → Remux → Upload to Drive  {D}(paste G-Drive ZIP share URL){X}
  {G}[4]{X} ♻️  GDrive Clone to Colab → Auto-Remux → PATCH back to Drive  {D}(folder or file URL — in-place){X}
  {G}[5]{X} 🤖  Auto-Fix via Drive URL — Folder or File(s)  {D}(paste any Drive folder/file URL){X}
  {G}[6]{X} ✏️  Manual Edit Tracks → Remux → Upload  {D}(edit audio+sub title & lang before remux){X}
  {G}[0]{X} ⏻  Exit
""")
        try:
            ch = input(f"  {W}Choice: {X}").strip()
        except (EOFError, KeyboardInterrupt):
            break

        if   ch == "1": run_fix_and_upload()
        elif ch == "2": direct_zip_downloader()
        elif ch == "3": gdrive_zip_extractor()
        elif ch == "4": gdrive_clone_to_colab()
        elif ch == "5": auto_fix_smart()
        elif ch == "6": manual_edit_and_upload()
        elif ch == "0":
            print(f"\n{G}Goodbye! 🎬{X}\n")
            break
        elif ch.startswith(("http://", "https://")) and "." in ch and len(ch) > 12:
            # Quick-paste URL directly at the main menu prompt
            urls = [ch]
            print(f"{W}More URLs (blank to start  {D}· 0 to cancel{W}):{X}")
            while True:
                try:
                    u = input(f"  {D}URL {len(urls) + 1}: {X}").strip()
                except EOFError:
                    break
                if not u:
                    break
                if u in ("0", "back", "cancel", "q", "quit"):
                    urls.clear()
                    break
                if u.startswith(("http://", "https://")) and "." in u and len(u) > 12:
                    urls.append(u)
                else:
                    print(f"  {R}⚠ Not a valid URL — skipped.  {D}(type 0 to cancel){X}")
            _install_tools()
            ok = fail = 0
            for i, url in enumerate(urls):
                local_path, drive_path = _download_external(url, i, len(urls))
                if local_path is None:
                    fail += 1
                    continue
                if auto_fix_v5(local_path, known_fid=None, drive_dest=drive_path):
                    ok += 1
                else:
                    fail += 1
                print(f"\n{'─' * 68}")
            print(f"\n{G}✔ Done: {ok}{X}  {R}✘ Failed: {fail}{X}  Saved to: {Y}{FOLDER}{X}")
        else:
            print(f"{Y}Invalid — enter 1-6/0 or paste a direct URL.{X}")


# ══════════════════════════════════════════════════════════════════════
#  STARTUP
# ══════════════════════════════════════════════════════════════════════
try:
    import __main__ as _m
    _m.auto_fix_silent = auto_fix_v5
    print(f"{G}✔ auto_fix_silent → v5 engine patched.{X}")
except Exception:
    pass

print(f"{G}✔ Tamizhan v9.1 loaded — all 6 menus ready.  ⚡ Smart-skip  🔁 Resume{X}")
main_menu()
