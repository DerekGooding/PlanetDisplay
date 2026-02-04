interface PlanetTexture {
  name: string;
  path: string; // This should be the full URL provided by Vite, including base path and hash
}

// Use Vite's glob import feature to get all PNGs from the planets folder
// 'eager: true' imports them immediately, and 'as: "url"' gets their public URL with hash
const modules = import.meta.glob('../assets/planets/**/*.png', { eager: true, as: 'url' });

const planetTextures: PlanetTexture[] = Object.keys(modules).map((key: string) => {
  const fullPath = modules[key] as string; // This should now correctly be the full public URL

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