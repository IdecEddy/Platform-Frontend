import { z } from 'zod';

const jwtRegex = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;
export const jwtSchema = z.string().regex(jwtRegex, {
  message: "Invalid JWT token format",
});
