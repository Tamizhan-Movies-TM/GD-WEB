
import urllib.request

# ── Step 1: Auth & Mount Drive ────────────────────────────────────────
from google.colab import auth, drive
auth.authenticate_user()
drive.mount('/content/drive')
print("✅ Auth & Drive ready!")

# ── Step 2: Download & Run Script ────────────────────────────────────
url = "https://cdn.jsdelivr.net/gh/Tamizhan-Movies-TM/GD-WEB@master/privacy/tamizhan_v8_6_3.py"
print(f"⬇ Loading script...")
code = urllib.request.urlopen(url).read().decode()
print("🚀 Starting Tamizhan v8.6...\n")
exec(code, {"__name__": "__main__"})
