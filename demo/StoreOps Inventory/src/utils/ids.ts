export function generateId(): string {
  // Mock ID generation for demo purposes, 8 char hex
  return Math.random().toString(16).substring(2, 10);
}

export function generateOrderNumber(): string {
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `SO-${num}`;
}
