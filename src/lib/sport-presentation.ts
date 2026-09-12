// Home-only presentation of the existing neutral SVGs. Remove only the two
// studio background rectangles, preserving every product path, fill and shadow.
// The original sources and all editor/print masks remain untouched.
export function productPresentationImage(image: string) {
  const prefix = "data:image/svg+xml;charset=UTF-8,";
  if (!image.startsWith(prefix)) return image;
  const svg = decodeURIComponent(image.slice(prefix.length));
  return (
    prefix + encodeURIComponent(svg.replace(/<rect\b[^>]*fill="url\(#(?:bg|floor)\)"[^>]*\/>/g, ""))
  );
}
