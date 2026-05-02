import base64
import io

import matplotlib.cm as cm
import numpy as np
from PIL import Image


def generate_heatmap_base64(normalized_ndvi_array):
    cmap = cm.get_cmap("RdYlGn")
    rgba_image = cmap(normalized_ndvi_array)
    rgba_image[:, :, 3] = 0.65
    rgba_image_uint8 = (rgba_image * 255).astype(np.uint8)

    image = Image.fromarray(rgba_image_uint8, "RGBA")
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")

    encoded = base64.b64encode(buffer.getvalue()).decode("utf-8")
    return f"data:image/png;base64,{encoded}"
