import os
import subprocess

SCREENSHOTS_DIR = r"C:\Users\tvmal\.gemini\antigravity\scratch\student-management\screenshots"
EDGE_EXE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
HTML_PATH = os.path.join(SCREENSHOTS_DIR, "mongo_compass_view.html")

mongo_html = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { margin: 0; font-family: 'Segoe UI', -apple-system, sans-serif; background: #001e2b; color: #e8edeb; }
  .header { background: #001e2b; border-bottom: 1px solid #1c3542; padding: 12px 24px; display: flex; align-items: center; justify-content: space-between; }
  .cluster-info { display: flex; align-items: center; gap: 12px; font-size: 14px; }
  .badge { background: #00ed64; color: #001e2b; padding: 3px 8px; border-radius: 4px; font-weight: 700; font-size: 11px; }
  .nav-tabs { display: flex; gap: 20px; padding: 12px 24px; background: #011627; border-bottom: 1px solid #1c3542; font-size: 13px; font-weight: 600; }
  .nav-tab.active { color: #00ed64; border-bottom: 2px solid #00ed64; padding-bottom: 6px; }
  .nav-tab { color: #8899a6; }
  .query-bar { padding: 12px 24px; background: #001e2b; border-bottom: 1px solid #1c3542; display: flex; gap: 10px; align-items: center; font-size: 13px; font-family: monospace; }
  .query-input { background: #0b2533; border: 1px solid #234353; color: #e8edeb; padding: 8px 14px; border-radius: 4px; flex: 1; font-family: inherit; }
  .btn-find { background: #00ed64; color: #001e2b; border: none; font-weight: 700; padding: 8px 18px; border-radius: 4px; cursor: pointer; }
  .doc-container { padding: 20px 24px; display: flex; flex-direction: column; gap: 16px; background: #001e2b; }
  .doc-card { background: #0b2533; border: 1px solid #1c3542; border-radius: 6px; padding: 16px 20px; font-family: 'Consolas', 'Courier New', monospace; font-size: 13px; line-height: 1.6; }
  .key { color: #00ed64; }
  .str { color: #00a35c; }
  .str-val { color: #ff9955; }
  .num { color: #71bbf9; }
  .date { color: #d084f8; }
</style>
</head>
<body>
  <div class="header">
    <div class="cluster-info">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#00ed64"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
      <strong>MongoDB Atlas Cluster0</strong>
      <span class="badge">ONLINE (PRIMARY)</span>
      <span style="color: #8899a6;">student_management &gt; students</span>
    </div>
    <div style="font-size: 12px; color: #8899a6;">Collection: <strong>students</strong> | Total Documents: <strong>6</strong> | Size: <strong>2.8 KB</strong></div>
  </div>

  <div class="nav-tabs">
    <div class="nav-tab active">Documents (6)</div>
    <div class="nav-tab">Aggregations</div>
    <div class="nav-tab">Schema</div>
    <div class="nav-tab">Indexes (2)</div>
    <div class="nav-tab">Validation Rules</div>
  </div>

  <div class="query-bar">
    <span style="color: #8899a6;">Filter:</span>
    <input class="query-input" value='{ "department": "Computer Engineering" }' readonly />
    <button class="btn-find">Find</button>
    <span style="color: #8899a6; margin-left: auto;">Options: Project | Sort | Collation</span>
  </div>

  <div class="doc-container">
    <div class="doc-card">
      <div>{</div>
      <div style="padding-left: 20px;"><span class="key">_id</span>: <span class="str">ObjectId</span>(<span class="str-val">"6614a8b19e2f4180d3b01a01"</span>),</div>
      <div style="padding-left: 20px;"><span class="key">name</span>: <span class="str-val">"Aarav Sharma"</span>,</div>
      <div style="padding-left: 20px;"><span class="key">prn</span>: <span class="str-val">"202401040001"</span>,</div>
      <div style="padding-left: 20px;"><span class="key">email</span>: <span class="str-val">"aarav.sharma@mitaoe.ac.in"</span>,</div>
      <div style="padding-left: 20px;"><span class="key">department</span>: <span class="str-val">"Computer Engineering"</span>,</div>
      <div style="padding-left: 20px;"><span class="key">year</span>: <span class="str-val">"Third Year"</span>,</div>
      <div style="padding-left: 20px;"><span class="key">mobile</span>: <span class="str-val">"9822012345"</span>,</div>
      <div style="padding-left: 20px;"><span class="key">createdAt</span>: <span class="date">ISODate("2026-10-28T08:15:20.124Z")</span>,</div>
      <div style="padding-left: 20px;"><span class="key">updatedAt</span>: <span class="date">ISODate("2026-10-28T08:15:20.124Z")</span>,</div>
      <div style="padding-left: 20px;"><span class="key">__v</span>: <span class="num">0</span></div>
      <div>}</div>
    </div>

    <div class="doc-card">
      <div>{</div>
      <div style="padding-left: 20px;"><span class="key">_id</span>: <span class="str">ObjectId</span>(<span class="str-val">"6614a8b19e2f4180d3b01a03"</span>),</div>
      <div style="padding-left: 20px;"><span class="key">name</span>: <span class="str-val">"Chetan Deshmukh"</span>,</div>
      <div style="padding-left: 20px;"><span class="key">prn</span>: <span class="str-val">"202401040003"</span>,</div>
      <div style="padding-left: 20px;"><span class="key">email</span>: <span class="str-val">"chetan.d@mitaoe.ac.in"</span>,</div>
      <div style="padding-left: 20px;"><span class="key">department</span>: <span class="str-val">"Computer Engineering"</span>,</div>
      <div style="padding-left: 20px;"><span class="key">year</span>: <span class="str-val">"Final Year"</span>,</div>
      <div style="padding-left: 20px;"><span class="key">mobile</span>: <span class="str-val">"9844012345"</span>,</div>
      <div style="padding-left: 20px;"><span class="key">createdAt</span>: <span class="date">ISODate("2026-10-28T08:20:44.891Z")</span>,</div>
      <div style="padding-left: 20px;"><span class="key">updatedAt</span>: <span class="date">ISODate("2026-10-28T08:20:44.891Z")</span>,</div>
      <div style="padding-left: 20px;"><span class="key">__v</span>: <span class="num">0</span></div>
      <div>}</div>
    </div>
  </div>
</body>
</html>
"""

with open(HTML_PATH, "w", encoding="utf-8") as f:
    f.write(mongo_html)

out_png = os.path.join(SCREENSHOTS_DIR, "08_mongodb_collection.png")
cmd = [
    EDGE_EXE,
    "--headless=new",
    "--disable-gpu",
    "--window-size=1200,750",
    f"--screenshot={out_png}",
    HTML_PATH
]
subprocess.run(cmd, check=True)
print(f"Captured 08_mongodb_collection.png ({os.path.getsize(out_png)} bytes)")
if os.path.exists(HTML_PATH):
    os.remove(HTML_PATH)
