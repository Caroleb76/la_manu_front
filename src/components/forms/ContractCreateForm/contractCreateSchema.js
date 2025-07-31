import { z } from "zod";

export const contractCreateSchema = z.object({
    lastName: z
        .string()
        .min(2, "Le nom doit contenir au moins 2 caractères.")
        .max(50, "Le nom est trop long."),

    firstName: z
        .string()
        .min(2, "Le prénom doit contenir au moins 2 caractères.")
        .max(50, "Le prénom est trop long."),

    address: z
        .string()
        .min(2, "L'adresse doit contenir au moins 2 caractères.")
        .max(250, "L'adresse est trop long."),

    postalCode: z
        .string()
        .min(5, "Le code postal doit contenir au moins 2 caractères.")
        .max(5, "Le code postal est trop long."),

    city: z
        .string()
        .min(2, "La ville doit contenir au moins 2 caractères.")
        .max(250, "La ville est trop long."),

    startDate: z
        .string()
        .min(1, "La date de début de contrat est requise.")
        .max(250, "La date de début de contrat est requise."),

    endDate: z
        .string()
        .min(1, "La date de fin de contrat est requise.")
        .max(250, "La date de fin de contrat est requise."),

    //  interventions:
});
