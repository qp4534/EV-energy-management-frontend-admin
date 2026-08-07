export function maskName(name: string): string {
  if (name.length <= 1) return name;
  return `${name.slice(0, -1)}*`;
}
