/**
 *
 * @param str - Html string, to replace. Ex. change images to webp, index.css to output.css for tailwind, etc
 */
const globalReplacer = (str: string): string => {
  str = str.replace(
    /(<img\b[^>]*?\bsrc=["'])([^"']+)\.(jpe?g|png|gif|tiff?)(["'])/gi,
    "$1$2.webp$4"
  );
  return str;
};

export { globalReplacer };
