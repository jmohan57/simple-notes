export function capitalizeWords(input: string): string {
  if (input === undefined) return input;

  const words = input.split(" ");

  const capitalizedWords = words.map((word) => {
    if (word.length === 0) {
      return word; // Handle cases where there might be multiple spaces
    }
    const firstChar = word[0].toUpperCase();
    const restChars = word.slice(1).toLowerCase();
    return `${firstChar}${restChars}`;
  });

  return capitalizedWords.join(" ");
}
