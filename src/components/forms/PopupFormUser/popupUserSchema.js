import { z } from 'zod';

export const popupUserSchema = z.object({



  firstName: z
    .string()
    .min(2, 'Le titre doit contenir au moins 2 caractères.')
    .max(50, 'Le titre est trop long.'),

  priority: z
    .coerce.number()
    .min(1, 'Une priorité est obligatoire')
    .max(3)
    .nonnegative(),


  startDate: z
    .string()
    .min(1, 'La date de publication est requise.'),

  endDate: z
  .string()
  .min(1, 'La date de fin est requise.'),


  content: z
    .string()
    .min(2, 'Le contenu doit contenir au moins 2 caractères.')
    .max(250, 'Le contenu est trop long.'),


});
