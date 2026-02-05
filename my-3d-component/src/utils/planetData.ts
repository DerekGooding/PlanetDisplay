interface PlanetConfig {
  name: string;
  texturePath: string;
  normalMapPath?: string;
}

const modules = import.meta.glob('../assets/planets/**/*.png', { eager: true, as: 'url' });

const groupedPlanetData = new Map<
  string,
  {
    folderName: string;
    baseName: string;
    texturePath?: string;
    roughMapPath?: string;
    normalMapPath?: string;
  }
>();

Object.entries(modules).forEach(([key, url]) => {
  const fullPath = (url as any).default || (url as string);

  const parts = key.split('/');
  const folderName = parts[parts.length - 2];
  const fileNameWithExt = parts[parts.length - 1];
  const fileName = fileNameWithExt.replace(/\.png$/, '');

  const isNormalMap = fileName.includes('_normal');
  const isRoughMap = fileName.includes('_rough');
  const baseFileName = fileName.replace(/(_normal|_rough)/, '');

  const mapKey = `${folderName}_${baseFileName}`;

  if (!groupedPlanetData.has(mapKey)) {
    groupedPlanetData.set(mapKey, {
      folderName,
      baseName: baseFileName,
    });
  }

  const entry = groupedPlanetData.get(mapKey)!;
  if (isNormalMap) {
    entry.normalMapPath = fullPath;
  } else if (isRoughMap) {
    entry.roughMapPath = fullPath;
  } else {
    entry.texturePath = fullPath;
  }
});

const planetConfigs: PlanetConfig[] = Array.from(groupedPlanetData.values())
  .filter(entry => entry.texturePath !== undefined) // Filter out entries without a base texture
  .map(
  (entry) => {
    // Format the name nicely, removing resolution suffix if present
    let name = `${entry.folderName} ${entry.baseName.split('_')[1] || entry.baseName}`;
    name = name.replace(/-\d+x\d+$/, ''); // Remove resolution suffix if present
    name = name.replace(/_normal$/, ''); // Remove _normal if somehow still present

    return {
      name,
      texturePath: entry.texturePath!, // Now safe to assert non-null
      normalMapPath: entry.normalMapPath,
    };
  }
);

export default planetConfigs;

export const cloudTextures = import.meta.glob('../assets/clouds/**/*.png', { 
  eager: true, 
  import: 'default'
});