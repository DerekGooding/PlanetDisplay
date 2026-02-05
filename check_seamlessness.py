
import os
import sys
from PIL import Image

def calculate_pixel_difference(pixel1, pixel2):
    """Calculates the sum of absolute differences between two RGB pixels."""
    if len(pixel1) < 3 or len(pixel2) < 3: # Handle grayscale or indexed images
        return abs(pixel1[0] - pixel2[0])
    return sum(abs(pixel1[i] - pixel2[i]) for i in range(3))

def check_horizontal_seamlessness(image_path, threshold=75):
    """
    Checks if an image is horizontally seamless (left edge matches right edge).

    Args:
        image_path (str): The path to the image file.
        threshold (int): The maximum allowed sum of absolute RGB differences
                         between corresponding pixels on the left and right edges.

    Returns:
        tuple: (is_seamless (bool), diff_value (float or None)).
               diff_value is the maximum difference found if not seamless, else None.
    """
    try:
        with Image.open(image_path) as img:
            # Convert to RGB to ensure consistent pixel comparison
            img = img.convert("RGB")
            width, height = img.size

            if width < 2:
                print(f"  Skipping {os.path.basename(image_path)}: image width too small for seamlessness check.", file=sys.stderr)
                return True, 0 # Considered seamless if too small to check meaningfully

            max_diff = 0
            for y in range(height):
                left_pixel = img.getpixel((0, y))
                right_pixel = img.getpixel((width - 1, y))
                diff = calculate_pixel_difference(left_pixel, right_pixel)
                if diff > max_diff:
                    max_diff = diff
                if diff > threshold:
                    # Early exit if a significant difference is found
                    return False, max_diff
            return True, max_diff

    except FileNotFoundError:
        print(f"Error: Image file not found at {image_path}", file=sys.stderr)
        return False, None
    except Exception as e:
        print(f"Error processing image {image_path}: {e}", file=sys.stderr)
        return False, None

def main():
    assets_dir = "my-3d-component/src/assets" # Assuming script is run from project root
    
    # Use glob to find all PNG files recursively
    # glob.glob is not available directly through the agent, so I will need to use `run_shell_command` with a find equivalent or rely on the agent to do glob search
    # For now, I'll simulate globbing by assuming the asset structure from previous `list_directory` calls.
    # A more robust solution would involve recursively listing directories and filtering files.
    
    # Let's try to get a list of files using `glob` tool
    # However, the glob tool returns absolute paths, which I then need to make relative to assets_dir if I want to present them nicely.
    # Better to just use Python's os.walk and filter for .png files.

    if not os.path.isdir(assets_dir):
        print(f"Error: Assets directory not found at {assets_dir}", file=sys.stderr)
        sys.exit(1)

    print(f"Checking PNG files in '{assets_dir}' for horizontal seamlessness (threshold={check_horizontal_seamlessness.__defaults__[0]})...")
    
    non_seamless_files = []
    seamless_files = []

    for root, _, files in os.walk(assets_dir):
        for file in files:
            if file.lower().endswith('.png'):
                image_path = os.path.join(root, file)
                is_seamless, max_diff = check_horizontal_seamlessness(image_path)
                if not is_seamless:
                    non_seamless_files.append((image_path, max_diff))
                else:
                    seamless_files.append((image_path, max_diff))

    if non_seamless_files:
        print("\n--- Non-seamless files found (may show noticeable edge on sphere): ---")
        for path, diff in non_seamless_files:
            print(f"- {path} (Max difference: {diff:.2f})")
    else:
        print("\nAll checked PNG files appear horizontally seamless.")
    

    
    print("\nCheck complete.")

if __name__ == "__main__":
    main()
