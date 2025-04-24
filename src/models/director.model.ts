import { z } from 'zod';
import { convertZodToJsonSchema } from '../utils/schema.utils';

export const DirectorSchema = z.object({
    id: z.string().uuid().optional(),
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Birth date must be in YYYY-MM-DD format'),
    bio: z.string().max(500),
    isDeleted: z.boolean().default(false)
});

export type Director = z.infer<typeof DirectorSchema>;

export const CreateDirectorSchema = DirectorSchema.omit({
    id: true
})
export type CreateDirector = z.infer<typeof CreateDirectorSchema>;

export const UpdateDirectorSchema = DirectorSchema.omit({
    id: true,
    isDeleted: true
})
export type UpdateDirector = z.infer<typeof UpdateDirectorSchema>;

export const DeleteDirectorSchema = z.object({
    force: z.boolean().optional()
})
export type DeleteDirector = z.infer<typeof DeleteDirectorSchema>;

export const ByIdDirectorSchema = z.object({
    id: z.string().uuid()
})
export type ByIdDirector = z.infer<typeof ByIdDirectorSchema>;


export const DirectorFastifySchema = convertZodToJsonSchema(DirectorSchema);
export const CreateDirectorFastifySchema = convertZodToJsonSchema(CreateDirectorSchema);
export const UpdateDirectorFastifySchema = convertZodToJsonSchema(UpdateDirectorSchema);
export const DeleteDirectorFastifySchema = convertZodToJsonSchema(DeleteDirectorSchema);
export const ByIdDirectorFastifySchema = convertZodToJsonSchema(ByIdDirectorSchema);