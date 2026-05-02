from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import numpy as np
import requests
import io
import base64
import json
import os
import time
import random
from PIL import Image
import matplotlib.cm as cm
from werkzeug.utils import secure_filename

from sentinelhub import (
    SHConfig, SentinelHubRequest, DataCollection,
    MimeType, BBox, CRS, bbox_to_dimensions
)

app = Flask(__name__)
CORS(app)  # React frontend requests ko allow karega

# 🔐 Sentinel Config
config = SHConfig()
config.sh_client_id = "ca118fee-7d8c-4806-b8f6-b92bc64ea610"
config.sh_client_secret = "ZMnmBhby8LV6d8WinTNWiWrMJ6ypAyAI"

# 🌡️ Weather API
WEATHER_API = "8cf23ed32369444735ac3700e1ccff7c"

# In-memory Database for Field Ops Tasks
TASKS_DB = []
SCAN_FILE = "latest_scan.json"

# ==========================================
# 🛰️ SENTINEL & DATA PROCESSING FUNCTIONS
# ==========================================

def get_ndvi(lat, lon):
    offset = 0.05
    bbox = BBox(bbox=[lon - offset, lat - offset, lon + offset, lat + offset], crs=CRS.WGS84)
    size = bbox_to_dimensions(bbox, resolution=60)
    evalscript = """
    //VERSION=3
    function setup() { return { input: ["B04", "B08"], output: { bands: 1 } }; }
    function evaluatePixel(sample) { return [(sample.B08 - sample.B04) / (sample.B08 + sample.B04)]; }
    """
    request = SentinelHubRequest(
        evalscript=evalscript,
        input_data=[SentinelHubRequest.input_data(data_collection=DataCollection.SENTINEL2_L2A, time_interval=("2024-01-01", "2024-12-31"))],
        responses=[SentinelHubRequest.output_response("default", MimeType.TIFF)],
        bbox=bbox, size=size, config=config
    )
    raw_data = request.get_data()[0]
    return np.squeeze(raw_data)

def get_temperature(lat, lon):
    try:
        url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={WEATHER_API}"
        data = requests.get(url).json()
        return data["main"]["temp"] - 273.15
    except Exception:
        return 32.0 

def analyze_sectors(raw_ndvi_array, base_temp, base_lat, base_lon):
    rows, cols = raw_ndvi_array.shape
    grid = 10
    h, w = rows // grid, cols // grid
    offset = 0.05
    step = (offset * 2) / grid

    results = []
    zone_counter = 1

    for i in range(grid):
        for j in range(grid):
            sector = raw_ndvi_array[i*h:(i+1)*h, j*w:(j+1)*w]
            if sector.size == 0: continue

            sector_clipped = np.clip(sector, -10000, 10000)
            sec_min, sec_max = np.min(sector_clipped), np.max(sector_clipped)
            if sec_max > sec_min:
                normalized_sector = (sector_clipped - sec_min) / (sec_max - sec_min)
            else:
                normalized_sector = np.zeros_like(sector_clipped)

            avg_ndvi = float(np.mean(normalized_sector))
            green_ratio = float(np.sum(normalized_sector > 0.35) / normalized_sector.size)

            grid_lat = (base_lat + offset) - (i + 0.5) * step
            grid_lng = (base_lon - offset) + (j + 0.5) * step
            localized_lst = base_temp + ((0.3 - avg_ndvi) * 12) 

            base_capacity = 800 
            trees_needed = int((1 - green_ratio) * base_capacity)

            if avg_ndvi < 0.25:
                status, issue, trees = "red", "Critical Urban Heat Island", trees_needed
            elif avg_ndvi < 0.45:
                status, issue, trees = "red", "High Heat Risk & Low Canopy", int(trees_needed * 0.8)
            else:
                status, issue, trees = "green", "Healthy Canopy Coverage", 0 

            row_char = chr(65 + i) 
            zone_name = f"Zone {row_char}{j+1} — Sector Area"

            results.append({
                "id": f"Z{zone_counter}", "lat": round(grid_lat, 5), "lng": round(grid_lng, 5),
                "status": status, "name": zone_name, "issue": issue, "trees": trees,
                "ndvi": round(avg_ndvi, 2), "lst": round(localized_lst, 1)
            })
            zone_counter += 1
    return results

def generate_heatmap_base64(normalized_ndvi_array):
    cmap = cm.get_cmap('RdYlGn')
    rgba_image = cmap(normalized_ndvi_array)
    rgba_image[:, :, 3] = 0.65
    rgba_image_uint8 = (rgba_image * 255).astype(np.uint8)
    img = Image.fromarray(rgba_image_uint8, 'RGBA')
    buf = io.BytesIO()
    img.save(buf, format='PNG')
    return f"data:image/png;base64,{base64.b64encode(buf.getvalue()).decode('utf-8')}"

# ==========================================
# 📂 FILE HANDLING & HELPER FUNCTIONS
# ==========================================

def get_latest_data():
    """File se latest zones padhta hai aur usme vulnerability & water mock karta hai"""
    if not os.path.exists(SCAN_FILE):
        return []
    
    with open(SCAN_FILE, "r") as f:
        zones = json.load(f)
        
    wards_with_score = []
    for z in zones:
        # Consistency ke liye ID se random seed banate hain taaki refresh hone par values change na hon
        random.seed(z['id']) 
        vuln = round(random.uniform(0.1, 0.9), 2)
        water = random.choice([True, False])
        cap = z['trees'] if z['trees'] > 0 else 500

        # Impact score logic
        lst_norm = max(0, min(1, (z['lst'] - 25) / 20))
        score = round((lst_norm * 0.4 + (1 - z['ndvi']) * 0.3 + vuln * 0.3) * 100)

        w = z.copy()
        w['vuln'] = vuln
        w['water'] = water
        w['cap'] = cap
        w['score'] = score
        wards_with_score.append(w)
        
    return sorted(wards_with_score, key=lambda x: x['score'], reverse=True)


# ==========================================
# 🚀 API ROUTES
# ==========================================

# 1. LIVE MAP (Scan & Save to File)
@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        data = request.json
        lat, lon = float(data["lat"]), float(data["lon"])
        offset = 0.05

        raw_ndvi = get_ndvi(lat, lon)
        temp = get_temperature(lat, lon)

        sec_min, sec_max = np.min(raw_ndvi), np.max(raw_ndvi)
        if sec_max > sec_min:
            normalized_ndvi = (raw_ndvi - sec_min) / (sec_max - sec_min)
        else:
            normalized_ndvi = np.zeros_like(raw_ndvi)

        heatmap_url = generate_heatmap_base64(normalized_ndvi)
        zones = analyze_sectors(normalized_ndvi, temp, lat, lon)

        # 💾 FILE OVERWRITE LOGIC: Har scan par file update hogi
        with open(SCAN_FILE, "w") as f:
            json.dump(zones, f, indent=4)

        bounds = [[lat - offset, lon - offset], [lat + offset, lon + offset]]

        return jsonify({
            "status": "success", "center": {"lat": lat, "lng": lon},
            "base_temp": round(temp, 2), "heatmap_image": heatmap_url,
            "bounds": bounds, "zones": zones
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# 2. DASHBOARD API
@app.route("/api/dashboard", methods=["GET"])
def get_dashboard():
    wards = get_latest_data()
    if not wards:
        return jsonify({"status": "error", "message": "No data available. Please scan an area first."})

    avg_ndvi = sum(w['ndvi'] for w in wards) / len(wards)
    avg_lst = sum(w['lst'] for w in wards) / len(wards)
    high_risk_count = len([w for w in wards if w['status'] == 'red'])
    total_trees = sum(w['trees'] for w in wards)

    metrics = {
        "avg_ndvi": round(avg_ndvi, 2), "ndvi_trend": "Live from Satellite",
        "urban_heat": f"{round(avg_lst, 1)}°C", "heat_trend": "Live Average",
        "high_risk_zones": high_risk_count, "risk_trend": "Needs Action",
        "trees_planted": total_trees, "trees_trend": "Target Deficit"
    }

    return jsonify({"status": "success", "metrics": metrics, "priority_targets": wards[:8]})

# 3. GEO INTEL API
@app.route("/api/wards", methods=["GET"])
def get_wards():
    wards = get_latest_data()
    return jsonify({"status": "success", "wards": wards})

# 4. AI BUDGET OPTIMIZER API
@app.route("/api/optimize", methods=["POST"])
def run_optimizer():
    data = request.json
    budget = int(data.get("budget", 3000))
    require_water = data.get("requireWater", True)
    
    wards = get_latest_data()
    eligible = [w for w in wards if not require_water or w['water']]
    
    rem = budget
    sel = []
    for w in eligible:
        if w['cap'] <= rem:
            w_copy = w.copy()
            w_copy['alloc'] = w['cap']
            sel.append(w_copy)
            rem -= w['cap']
        elif rem >= 100:
            w_copy = w.copy()
            w_copy['alloc'] = rem
            sel.append(w_copy)
            rem = 0
            break
            
    avg_imp = round(sum(w['score'] for w in sel) / len(sel)) if sel else 0
    return jsonify({
        "status": "success", 
        "result": {"sel": sel, "treesAllocated": budget - rem, "avgImp": avg_imp}
    })

# 5. FIELD OPS APIs
@app.route("/api/tasks", methods=["GET"])
def get_tasks():
    return jsonify({"status": "success", "tasks": TASKS_DB})

@app.route("/api/tasks/assign", methods=["POST"])
def assign_task():
    data = request.json
    new_task = {
        "id": int(time.time() * 1000),
        "zone": data.get("zone"),
        "leadName": data.get("leadName"),
        "status": "pending",
        "proof": None
    }
    TASKS_DB.insert(0, new_task)
    return jsonify({"status": "success", "task": new_task})

# 📂 Folder jahan photos save hongi
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# 🖼️ Photos ko browser mein dikhane ke liye route
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


# 🚀 Proof Upload karne ke liye API
@app.route("/api/tasks/upload", methods=["POST"])
def upload_proof():
    if 'file' not in request.files:
        return jsonify({"status": "error", "message": "No photo"}), 400
    
    file = request.files['file']
    task_id = request.form.get("task_id")
    lat = request.form.get("lat")
    lng = request.form.get("lng")
    
    filename = f"proof_{task_id}_{int(time.time())}.jpg"
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    
    # Database update karo
    for task in TASKS_DB:
        if str(task['id']) == str(task_id):
            task['status'] = 'completed'
            task['proof'] = {
                "url": f"http://localhost:5001/uploads/{filename}",
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
                "lat": lat,
                "lng": lng
            }
            break
            
    return jsonify({"status": "success"})

# ▶️ RUN SERVER
if __name__ == "__main__":
    app.run(debug=True, port=5111)