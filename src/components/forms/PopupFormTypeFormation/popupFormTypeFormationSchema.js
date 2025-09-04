import { z } from 'zod';

export const popupFormTypeFormationSchema = z.object({


  name: z
    .string()
    .min(2, 'Le titre doit contenir au moins 2 caractères.')
    .max(50, 'Le titre est trop long.'),

 description: z
   .string()
    .min(2, 'Le contenu doit contenir au moins 2 caractères.')
    .max(250, 'Le contenu est trop long.'),
});