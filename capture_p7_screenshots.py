import os
import sys
import time
import subprocess
import urllib.request
import json

SERVER_DIR = r"C:\Users\tvmal\.gemini\antigravity\scratch\student-management\server"
SCREENSHOTS_DIR = r"C:\Users\tvmal\.gemini\antigravity\scratch\student-management\screenshots"
EDGE_EXE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
PORT = 5055

os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

def main():
    print("Starting server on port", PORT)
    env = os.environ.copy()
    env["PORT"] = str(PORT)
    env["NODE_ENV"] = "production"

    proc = subprocess.Popen(["node", "server.js"], cwd=SERVER_DIR, env=env)

    # Wait for server to start
    ready = False
    for i in range(15):
        try:
            req = urllib.request.Request(f"http://127.0.0.1:{PORT}/api/health")
            with urllib.request.urlopen(req, timeout=2) as response:
                if response.status == 200:
                    ready = True
                    break
        except Exception:
            time.sleep(0.5)

    if not ready:
        print("Server failed to respond!")
        proc.kill()
        sys.exit(1)

    print("Server ready! Capturing all required screenshots using Edge...")

    def take_screenshot(url, filename, width=1280, height=820, delay_ms=3000):
        out_path = os.path.join(SCREENSHOTS_DIR, filename)
        cmd = [
            EDGE_EXE,
            "--headless=new",
            "--disable-gpu",
            f"--window-size={width},{height}",
            f"--screenshot={out_path}",
            f"--virtual-time-budget={delay_ms}",
            url
        ]
        subprocess.run(cmd, check=True)
        print(f"Captured {filename} ({os.path.getsize(out_path)} bytes)")

    try:
        base_url = f"http://localhost:{PORT}"
        # 1. Dashboard
        take_screenshot(f"{base_url}/#dashboard", "01_dashboard.png", 1280, 850)
        # 2. View Students Directory
        take_screenshot(f"{base_url}/#students", "02_students_directory.png", 1280, 850)
        # 3. Add Student Form
        take_screenshot(f"{base_url}/#add", "03_add_student_form.png", 1280, 850)
        # 4. Edit Student Form (use query parameter before hash or within hash)
        take_screenshot(f"{base_url}/?demo=edit#add", "04_edit_student_form.png", 1280, 850)
        # 5. Query Filter & Sort
        take_screenshot(f"{base_url}/?demo=filter#students", "05_query_filter_sort.png", 1280, 850)
        # 6. Delete Confirmation Modal
        take_screenshot(f"{base_url}/?demo=delete#students", "06_delete_confirmation.png", 1280, 850)
        # 7. REST API Output
        take_screenshot(f"{base_url}/api/students", "07_rest_api_json.png", 1200, 750)
    finally:
        proc.kill()
        print("Server process ended.")

if __name__ == "__main__":
    main()
