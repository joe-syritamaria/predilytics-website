import os, sys
from pathlib import Path
import uvicorn

def base_dir():
    # If frozen by PyInstaller
    if getattr(sys, "frozen", False):
        return Path(sys.executable).parent
    # Normal dev run
    return Path(__file__).resolve().parent

if __name__ == "__main__":
    host = os.environ.get("HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", "8000"))

    BASE_DIR = base_dir()
    os.environ["APP_BASE_DIR"] = str(BASE_DIR)

    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        log_level="info",
    )
