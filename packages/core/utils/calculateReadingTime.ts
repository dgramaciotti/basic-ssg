function calculateReadingTime(text: string, wpm = 238, roundUp = true) {
  if (!text || typeof text !== "string") {
    return 0;
  }
  let cleanText = text;
  cleanText = cleanText.replace(/(\*\*|__|\*|_)/g, "");
  cleanText = cleanText.replace(/#+\s/g, "");
  cleanText = cleanText.replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1");
  cleanText = cleanText.replace(/>\s/g, "");
  cleanText = cleanText.replace(/^[*-]\s|^[0-9]+\.\s/gm, "");
  const wordCount = cleanText.trim().split(/\s+/).filter(Boolean).length;
  let timeInMinutes = wordCount / wpm;
  if (roundUp) {
    return Math.ceil(timeInMinutes);
  } else {
    return Math.floor(timeInMinutes);
  }
}

export { calculateReadingTime };
