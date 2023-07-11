const getPercent = (value: number): number => {
  return Math.round((Math.random() * (value * 100)) % 100);
};

const getHashPercent = (
  value: number,
  hash: number,
  length: number,
): number => {
  return Math.round(((hash / length) * (value * 100)) % 100);
};

const getRandomColor = (colors: string[]): string => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

const genColors = (
  length: number,
  baseColor: string,
  otherColors: string[],
): string[] => {
  return Array.from({ length }, (_, i) =>
    i === 0 ? baseColor : getRandomColor(otherColors),
  );
};

const genGrad = (length: number, colors: string[], hash?: number): string[] => {
  return Array.from({ length }, (_, i) => {
    return `radial-gradient(at ${
      hash ? getHashPercent(i, hash, length) : getPercent(i)
    }% ${hash ? getHashPercent(i * 10, hash, length) : getPercent(i * 10)}%, ${
      colors[i]
    } 0px, transparent 70%)\n`;
  });
};

const genStops = (
  length: number,
  baseColor: string,
  otherColors: string[],
  hash?: number,
) => {
  const colorArray = genColors(length, baseColor, otherColors);
  const proprieties = genGrad(length, colorArray, hash);
  return [baseColor, proprieties.join(",")];
};

const generateMeshGradient = (
  length: number,
  baseColor: string,
  otherColors: string[],
  hash?: number,
) => {
  const validHash = hash ? hash : undefined;
  const [bgColor, bgImage] = genStops(
    length,
    baseColor,
    otherColors,
    validHash,
  );
  return `background-color: ${bgColor}; background-image:${bgImage}`;
};

const generateJSXMeshGradient = (
  length: number,
  baseColor: string,
  otherColors: string[],
  hash?: number,
) => {
  const validHash = hash ? hash : undefined;
  const [bgColor, bgImage] = genStops(
    length,
    baseColor,
    otherColors,
    validHash,
  );
  return { backgroundColor: bgColor, backgroundImage: bgImage };
};

export { generateMeshGradient, generateJSXMeshGradient };
