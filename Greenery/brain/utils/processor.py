import numpy as np
import random
import json
import os

SCAN_FILE = "latest_scan.json"

def process_zones(raw_ndvi, base_temp, base_lat, base_lon):
    rows, cols = raw_ndvi.shape
    grid = 10
    h, w = rows // grid, cols // grid
    offset, step = 0.05, (0.05 * 2) / grid
    
    # Normalize NDVI
    sec_min, sec_max = np.min(raw_ndvi), np.max(raw_ndvi)
    normalized = (raw_ndvi - sec_min) / (sec_max - sec_min) if sec_max > sec_min else np.zeros_like(raw_ndvi)
    
    results = []
    for i in range(grid):
        for j in range(grid):
            sector = normalized[i*h:(i+1)*h, j*w:(j+1)*w]
            avg_ndvi = float(np.mean(sector))
            green_ratio = float(np.sum(sector > 0.35) / sector.size)
            
            grid_lat = (base_lat + offset) - (i + 0.5) * step
            grid_lng = (base_lon - offset) + (j + 0.5) * step
            
            # LST Proxy
            lst = base_temp + ((0.3 - avg_ndvi) * 12)
            
            status = "red" if avg_ndvi < 0.35 else "green"
            results.append({
                "id": f"Z{i}_{j}", "lat": round(grid_lat, 5), "lng": round(grid_lng, 5),
                "status": status, "ndvi": round(avg_ndvi, 2), "lst": round(lst, 1),
                "trees": int((1 - green_ratio) * 800) if status == "red" else 0,
                "name": f"Zone {chr(65+i)}{j+1}"
            })
    return results, normalized

def get_enriched_data():
    if not os.path.exists(SCAN_FILE): return []
    with open(SCAN_FILE, "r") as f:
        data = json.load(f)
    for z in data:
        random.seed(z['id'])
        z['vuln'] = round(random.uniform(0.1, 0.9), 2)
        z['water'] = random.choice([True, False])
        z['score'] = round((max(0, min(1, (z['lst'] - 25) / 20)) * 0.4 + (1 - z['ndvi']) * 0.3 + z['vuln'] * 0.3) * 100)
    return sorted(data, key=lambda x: x['score'], reverse=True)