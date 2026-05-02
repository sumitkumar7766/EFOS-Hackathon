import requests

url = "https://services.sentinel-hub.com/api/v1/process"

headers = {
    "Authorization": "Bearer YOUR_ACCESS_TOKEN",
    "Content-Type": "application/json"
}

payload = {
  "input": {
    "bounds": {
      "bbox": [77.40, 23.25, 77.42, 23.27]
    },
    "data": [
      {
        "type": "sentinel-2-l2a"
      }
    ]
  },
  "output": {
    "width": 512,
    "height": 512
  },
  "evalscript": """
  // True color image
  return [B04, B03, B02];
  """
}

response = requests.post(url, json=payload, headers=headers)

with open("image.png", "wb") as f:
    f.write(response.content)