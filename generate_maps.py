import os
import numpy as np
from PIL import Image, ImageFilter

# ---------- CONFIG ----------
TEXTURE_ROOT = r"C:/REPOS/PlanetDisplay/my-3d-component/src/assets/planets/"
TEXTURE_DIR = TEXTURE_ROOT + "Snowy"
NORMAL_SCALE = 1.0             # How strong the normals appear
ROUGH_BLUR_RADIUS = 8          # How blurry roughness maps are
# ----------------------------

def generate_normal_map(image_path, scale=NORMAL_SCALE):
    img = Image.open(image_path).convert('L')
    height = np.array(img, dtype=np.float32)

    # Compute gradients
    dzdx = np.gradient(height, axis=1)
    dzdy = np.gradient(height, axis=0)

    nx = -dzdx * scale
    ny = -dzdy * scale
    nz = np.ones_like(height)

    length = np.sqrt(nx**2 + ny**2 + nz**2)
    nx /= length
    ny /= length
    nz /= length

    # Convert to 0-255 RGB
    normal = np.stack([(nx+1)*127.5, (ny+1)*127.5, (nz+1)*127.5], axis=2).astype(np.uint8)
    normal_img = Image.fromarray(normal, 'RGB')
    return normal_img

def generate_roughness_map(image_path, blur_radius=ROUGH_BLUR_RADIUS):
    img = Image.open(image_path).convert('L')          # Grayscale
    img = img.filter(ImageFilter.GaussianBlur(blur_radius))
    return img

def process_folder(folder):
    for file in os.listdir(folder):
        if not file.lower().endswith('.png'):
            continue
        if file.endswith('_normal.png') or file.endswith('_rough.png'):
            continue

        base = os.path.splitext(file)[0]
        input_path = os.path.join(folder, file)
        normal_path = os.path.join(folder, base + '_normal.png')
        rough_path = os.path.join(folder, base + '_rough.png')

        print(f"Processing {file}...")

        # Normal map
        if not os.path.exists(normal_path):
            normal_img = generate_normal_map(input_path)
            normal_img.save(normal_path)
            print(f"  Saved normal map: {normal_path}")

        # Roughness map
        if not os.path.exists(rough_path):
            rough_img = generate_roughness_map(input_path)
            rough_img.save(rough_path)
            print(f"  Saved roughness map: {rough_path}")

    print("All done!")

if __name__ == "__main__":
    process_folder(TEXTURE_DIR)
