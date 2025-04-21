import { z } from 'zod';

export const MovieSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    releaseDate: z.string().or(z.date()),
    genre: z.string(),
    rating: z.number().min(0).max(10),
    imdbId: z.string(),
    director: z.string(),
    isDeleted: z.boolean().default(false)
});

export type Movie = z.infer<typeof MovieSchema>;
