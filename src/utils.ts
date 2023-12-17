export function randomElement<T>(array: T[]): T | undefined {
  return array.at(Math.floor(Math.random() * array.length));
}
