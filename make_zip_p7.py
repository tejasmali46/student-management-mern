import os
import zipfile

PROJECT_DIR = r"C:\Users\tvmal\.gemini\antigravity\scratch\student-management"
ZIP_OUTPUT = r"C:\Users\tvmal\.gemini\antigravity\scratch\PRN_Name_P7_Title.zip"

EXCLUDE_DIRS = {"node_modules", ".git", ".vscode", ".idea"}
EXCLUDE_FILES = {".env", ".env.local", ".DS_Store", "Thumbs.db"}

def should_exclude(root, file_or_dir):
    if file_or_dir in EXCLUDE_FILES or file_or_dir in EXCLUDE_DIRS:
        return True
    if file_or_dir.startswith(".env.") and not file_or_dir.endswith(".example"):
        return True
    for part in root.split(os.sep):
        if part in EXCLUDE_DIRS:
            return True
    return False

def make_zip():
    print(f"Creating ZIP archive: {ZIP_OUTPUT}")
    file_count = 0
    total_uncompressed_bytes = 0

    with zipfile.ZipFile(ZIP_OUTPUT, "w", zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(PROJECT_DIR):
            # Prune excluded directories in-place so os.walk doesn't traverse them
            dirs[:] = [d for d in dirs if not should_exclude(root, d)]

            for file in files:
                if should_exclude(root, file):
                    continue

                abs_path = os.path.join(root, file)
                rel_path = os.path.relpath(abs_path, os.path.dirname(PROJECT_DIR))
                zipf.write(abs_path, rel_path)
                file_count += 1
                total_uncompressed_bytes += os.path.getsize(abs_path)

    zip_size = os.path.getsize(ZIP_OUTPUT)
    print(f"ZIP created successfully!")
    print(f"Total files included: {file_count}")
    print(f"Archive Size: {zip_size / 1024:.2f} KB ({zip_size} bytes)")
    print(f"Uncompressed size: {total_uncompressed_bytes / 1024:.2f} KB")

if __name__ == "__main__":
    make_zip()
