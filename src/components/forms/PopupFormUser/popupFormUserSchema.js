import { z } from 'zod';

export const popupFormUserSchema = z.object({



    firstName: z
        .string()
        .min(2, 'Le prénom doit contenir au moins 2 caractères.')
        .max(50, 'Le prénom est trop long.'),

    lastName: z
        .string()
        .min(2, 'Le nom doit contenir au moins 2 caractères.')
        .max(50, 'Le nom est trop long.'),

    email: z
        .string()
        .email('L’email est invalide.'),


    // password: z
    //     .string()
    //     .min(1, 'Le mot de passe est requis.'),

    role: z
        .string()
        .min(1, 'Le rôle est requis.'),




});
