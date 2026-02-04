interface PlanetTexture {
  name: string;
  path: string;
}

const modules = import.meta.glob('../assets/planets/**/*.png', { eager: true, as: 'url' });

const planetTextures: PlanetTexture[] = Object.entries(modules).map(([key, value]) => {
  const fullPath = value as string;

  const parts = key.split('/');
  const folderName = parts[parts.length - 2]; // e.g., 'Arid'
  const fileNameWithExt = parts[parts.length - 1]; // e.g., 'Arid_01-512x512.png'
  const fileName = fileNameWithExt.replace(/\.png$/, ''); // e.g., 'Arid_01-512x512'

  // Format the name nicely, handling different naming conventions
  let name = `${folderName} ${fileName.split('_')[1] || fileName}`;
  name = name.replace(/-\d+x\d+$/, ''); // Remove resolution suffix if present

  console.log('Planet textures:', planetTextures);

  return {
    name,
    path: fullPath,
  };
});

export default planetTextures;