import urllib.request

# ── Step 1: Auth & Mount Drive ────────────────────────────────────────
from google.colab import auth, drive
auth.authenticate_user()
drive.mount('/content/drive')
print("✅ Auth & Drive ready!")

# ── Step 2: Download & Run Script ────────────────────────────────────
url = "https://cdn.jsdelivr.net/gh/Tamizhan-Movies-TM/GD-WEB@c343ca70aee0b77a1ba389fb8725952fd9996f78/privacy/tamizhan_v9.1.py"
print(f"🔄 Loading script...")
code = urllib.request.urlopen(url).read().decode()
print("🚀 Starting Tamizhan v9.1...\n")
exec(code, {"__name__": "__main__"})
