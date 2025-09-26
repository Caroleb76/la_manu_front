import { z } from 'zod';

export const popupModuleSchema = z.object({


  name: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères.')
    .max(50, 'Le nom est trop long.'),

  description: z
     .string()
    .min(1, 'La description doit contenir au moins 2 caractères.')
    .max(250, 'Le contenu est trop long.')
    .optional()
    .default(''),


  formationId: z
    .string()
     .min(1, "L'identifiant de la formation doit contenir au moins 2 caractères.")


});
