import os
import torch
from PIL import Image
from diffusers.pipelines.stable_diffusion.pipeline_stable_diffusion_upscale import StableDiffusionUpscalePipeline

# ---------- CONFIG ----------
TEXTURE_ROOT = r"C:/Users/Derek/source/repos/PlanetDisplay/my-3d-component/src/assets/planets/"
TEXTURE_DIR = TEXTURE_ROOT + "Arid"
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
MODEL_ID = "stabilityai/stable-diffusion-x4-upscaler"  # HF 4x upscaler
# ----------------------------

def save_upscaled(result, output_path):
    """
    Handles different return types from the upscaler pipeline
    and saves the image.
    """
    # Case 1: result has .images list (most common)
    if hasattr(result, "images"):
        img = result.images[0]
    # Case 2: result is a PIL Image directly
    elif isinstance(result, Image.Image):
        img = result
    else:
        raise ValueError("Unexpected upscaler result type:", type(result))

    img.save(output_path)
    print(f"Saved upscaled to {output_path}")


def batch_upscale(folder):
    print("Loading upscaler model...")

    pipe = StableDiffusionUpscalePipeline.from_pretrained(
        MODEL_ID, torch_dtype=torch.float16
    ).to(DEVICE)

    pipe.enable_attention_slicing()  # helps reduce VRAM usage

    for file in os.listdir(folder):
        if not file.lower().endswith(".png"):
            continue
        if "rough" in file:
            continue
        if "normal" in file:
            continue
        if "upscaled" in file:
            continue

        input_path = os.path.join(folder, file)
        output_path = os.path.join(folder, "upscaled_" + file)

        print(f"Upscaling {file}...")
        img = Image.open(input_path).convert("RGB")

        # Run the upscaler
        result = pipe(prompt="", image=img)
        
        # Save the upscaled image
        save_upscaled(result, output_path)

    print("All done!")


if __name__ == "__main__":
    batch_upscale(TEXTURE_DIR)