/** Human word for a raw outlet count, shown alongside the number. */
export function outletWord(count: number): string {
  if (count <= 0) return "None";
  if (count <= 2) return "A few";
  if (count <= 5) return "Several";
  return "Plenty";
}
