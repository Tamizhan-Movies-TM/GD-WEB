
import urllib.request

# ── Step 1: Auth & Mount Drive ────────────────────────────────────────
from google.colab import auth, drive
auth.authenticate_user()
drive.mount('/content/drive')
print("✅ Auth & Drive ready!")

# ── Step 2: Download & Run Script ────────────────────────────────────
url = "https://cdn.jsdelivr.net/gh/Tamizhan-Movies-TM/GD-WEB@701149783e3d3fcdc465cc6d2ad7dafe04e57ada/privacy/tamizhan_v8.8.py"
print(f"🔄 Loading script...")
code = urllib.request.urlopen(url).read().decode()
print("🚀 Starting Tamizhan v8.8...\n")
exec(code, {"__name__": "__main__"})
