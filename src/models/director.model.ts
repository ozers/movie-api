import { z } from 'zod';

export const directorSchema = z.object({
    id: z.string().optional(),
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Birth date must be in YYYY-MM-DD format'),
    bio: z.string().max(500),
    isDeleted: z.boolean().default(false)
});

export type Director = z.infer<typeof directorSchema>; 