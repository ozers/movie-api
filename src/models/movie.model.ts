import { z } from 'zod';
import { convertZodToJsonSchema } from '../utils/schema.utils';

export const MovieSchema = z.object({
    id: z.string().uuid(),
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

export const CreateMovieSchema = MovieSchema.omit({
    id: true
})
export type CreateMovie = z.infer<typeof CreateMovieSchema>;

export const UpdateMovieSchema = MovieSchema.omit({
    id: true,
    isDeleted: true,
})
export type UpdateMovie = z.infer<typeof UpdateMovieSchema>;


export const DeleteMovieSchema = z.object({
    force: z.boolean().optional()
})
export type DeleteMovie = z.infer<typeof DeleteMovieSchema>;

export const ByIdMovieSchema = z.object({
    id: z.string().uuid()
});
export type ByIdMovie = z.infer<typeof ByIdMovieSchema>;

export const MovieFastifySchema = convertZodToJsonSchema(MovieSchema);
export const CreateMovieFastifySchema = convertZodToJsonSchema(CreateMovieSchema);
export const UpdateMovieFastifySchema = convertZodToJsonSchema(UpdateMovieSchema);
export const ByIdMovieFastifySchema = convertZodToJsonSchema(ByIdMovieSchema);