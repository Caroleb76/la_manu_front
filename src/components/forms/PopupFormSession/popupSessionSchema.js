import { z } from "zod";

export const popupSessionSchema = z.object({
  formationId: z.string().min(2, "Le formation choisie est requise.").max(250),

  serialNumber: z.coerce
    .string()
    .min(1, "Une priorité est obligatoire")
    .max(200, "Le contenu est trop long."),

  addressId: z
    .string()
    .min(2, "Le contenu doit contenir au moins 2 caractères.")
    .max(250, "Le contenu est trop long."),

  startDate: z.coerce.date({
    errorMap: () => ({ message: "La date de début est invalide." }),
  }),

  endDate: z.coerce.date({
    errorMap: () => ({ message: "La date de fin est invalide." }),
  }),
});
