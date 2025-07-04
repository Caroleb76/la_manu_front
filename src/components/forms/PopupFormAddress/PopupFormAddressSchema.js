import { z } from 'zod';

export const popupFormAddressSchema = z.object({


  address: z
    .string()
    .min(2, 'Le contenu doit contenir au moins 2 caractères.')
    .max(250, 'Le contenu est trop long.'),

  city: z
    .string()
    .min(2, 'Le contenu doit contenir au moins 2 caractères.')
    .max(250, 'Le contenu est trop long.'),


  postalCode: z
    .string()
    .min(2, 'Le contenu doit contenir au moins 2 caractères.')
    .max(250, 'Le contenu est trop long.'),


});
