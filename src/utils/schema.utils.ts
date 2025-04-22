import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export function convertZodToJsonSchema(schema: z.ZodType<unknown>) {
    return zodToJsonSchema(schema);
} 