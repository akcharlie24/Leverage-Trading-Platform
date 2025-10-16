declare global {
  interface Request {
    cookies: Record<string, string>;
    userId: string;
  }
}
