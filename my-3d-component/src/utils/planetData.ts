
interface PlanetTexture {
  name: string;
  path: string; // Relative path for dynamic import or direct use
}

// Use Vite's glob import feature to get all PNGs from the planets folder
// The 'eager: true' option imports them immediately, and 'as: "url"' gets their public URL
const modules = import.meta.glob('../assets/planets/**/*.png', { eager: true, as: 'url' });

const planetTextures: PlanetTexture[] = Object.keys(modules).map((key: string) => {
  // key will be like '../assets/planets/Arid/Arid_01-512x512.png'
  const fullPath = modules[key] as string; // This gets the actual imported URL/path

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
