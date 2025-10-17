import { z } from 'zod';

export const profileSchema = z.object({
  gender: z.enum(['madame', 'monsieur'], {
    required_error: 'La civilité est requise.',
  }),

  birthName: z
    .string()
    .min(2, 'Le nom patronymique doit contenir au moins 2 caractères.')
    .max(50, 'Le nom patronymique est trop long.'),

  lastName: z
    .string()
    .min(2, 'Le nom d’usage doit contenir au moins 2 caractères.')
    .max(50, 'Le nom d’usage est trop long.'),

  firstName: z
    .string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères.')
    .max(50, 'Le prénom est trop long.'),

  birthDate: z.string().min(1, 'La date de naissance est requise.'),

  birthPlace: z
    .string()
    .min(2, 'Le lieu de naissance doit contenir au moins 2 caractères.')
    .max(50, 'Le lieu de naissance est trop long.'),

  socialSecurity: z
    .string()
    .length(15, 'Le numéro de sécurité sociale doit contenir 15 chiffres.'),

  address: z
    .string()
    .min(2, 'L’adresse est requise.')
    .max(100, 'L’adresse est trop longue.'),

  postalCode: z
    .string()
    .length(5, 'Le code postal doit contenir 5 chiffres.'),

  city: z
    .string()
    .min(2, 'La ville est requise.')
    .max(50, 'La ville est trop longue.'),

  phone: z
    .string()
    .min(10, 'Le téléphone doit contenir au moins 8 chiffres.')
    .max(20, 'Le téléphone est trop long.'),

  email: z.string().email('L’email est invalide.'),

  mutuelle: z.boolean().default(false),
  permisB: z.boolean().default(false),

  employer: z
    .string()
    .min(2, 'Le nom de l’employeur est requis.')
    .max(50, 'Le nom de l’employeur est trop long.'),

  occupation: z
    .string()
    .min(2, 'Le poste est requis.')
    .max(50, 'Le poste est trop long.'),

  horsePower: z.coerce.number().nonnegative('Le nombre de chevaux doit être positif.'),

  diploma: z.string().optional(),

  diplomaType: z.string().optional(),

  profilePicture: z.string().optional(),
});
