import { z } from 'zod';

export const popupFormTypeFormation = z.object({


  title: z
    .string()
    .min(2, 'Le titre doit contenir au moins 2 caractères.')
    .max(50, 'Le titre est trop long.'),

 Description: z
   .string()
    .min(2, 'Le contenu doit contenir au moins 2 caractères.')
    .max(250, 'Le contenu est trop long.'),
});