interface PlanetTexture {
  name: string;
  path: string; // Absolute path for loading
}

// Vite's base URL (should match vite.config.ts)
const BASE_URL = import.meta.env.BASE_URL || '/'; // Fallback to '/' if not defined

// Use Vite's glob import feature to get all PNGs from the planets folder
// We'll import them as strings for now, and construct the full URL later
const modules = import.meta.glob('../assets/planets/**/*.png', { eager: true, as: 'raw' }); // changed 'url' to 'raw'

const planetTextures: PlanetTexture[] = Object.keys(modules).map((key: string) => {
  // key will be like '../assets/planets/Arid/Arid_01-512x512.png'
  const relativePath = key.replace('../', ''); // Removes the '../' prefix

  // Construct the full absolute URL for the asset
  const fullPath = `${BASE_URL}${relativePath}`; // Prepend the base URL

  // Extract folderName and fileName for a user-friendly name
  const parts = key.split('/');
  const folderName = parts[parts.length - 2]; // e.g., 'Arid'
  const fileNameWithExt = parts[parts.length - 1]; // e.g., 'Arid_01-512x512.png'
  const fileName = fileNameWithExt.replace(/\.png$/, ''); // e.g., 'Arid_01-512x512'

  // Format the name nicely, handling different naming conventions
  let name = `${folderName} ${fileName.split('_')[1] || fileName}`;
  name = name.replace(/-\d+x\d+$/, ''); // Remove resolution suffix if present

  return {
    name,
    path: fullPath,
  };
});

export default planetTextures;