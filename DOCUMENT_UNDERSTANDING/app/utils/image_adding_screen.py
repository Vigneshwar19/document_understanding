from PIL import Image
import os

def apply_overlay_to_images(image_paths, output_folder, overlay_img_path):
    try:
        if not os.path.exists(output_folder):
            os.makedirs(output_folder)
        
        overlay_image = Image.open(overlay_img_path).convert("RGBA")
        
        saved_image_paths = []

        for img_path in image_paths:
            if not os.path.exists(img_path):
                err = f"Image file {img_path} does not exist."
                print(err)
                continue

            # Load the image
            original_image = Image.open(img_path).convert("RGBA")
            
            # Resize the overlay image
            overlay_resized = overlay_image.resize((original_image.width, int(original_image.height * 0.15)), Image.LANCZOS)

            # Combine the images
            combined_height = original_image.height + overlay_resized.height
            combined_image = Image.new("RGBA", (original_image.width, combined_height))

            combined_image.paste(original_image, (0, 0))
            combined_image.paste(overlay_resized, (0, original_image.height), overlay_resized)
            
            # Save the combined image
            image_filename = os.path.basename(img_path).replace('.jpg', '_with_overlay.png').replace('.png', '_with_overlay.png')
            save_path = os.path.join(output_folder, image_filename)
            combined_image.save(save_path, "PNG")
            saved_image_paths.append(save_path)
        
        return saved_image_paths
    except Exception as e:
        print(f"Error applying overlay to images: {e}")
        return None
