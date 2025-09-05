import { z } from 'zod';
import interventionsCategoriesHelper from '../../../helpers/interventionsCategoriesHelper';


export const popupInterventionSchema = z.object({


  moduleId: z
    .string("l'identifiant n'est pas une chaine de caracteres"),
    // .uuid("identifiant incorrect"),

  moduleName: z
    .string("le nom n'est pas une chaine de caracteres")
    .min(2, "Le nom doit contenir au moins 2 caractères."),


    interventionCategoryName : z
    .string("le nom n'est pas une chaine de caracteres")
    .min(2, "Le nom doit contenir au moins 2 caractères."),



  dateIntervention: z
    .string()
    .min(1, "La date est requise."),

  hours: z
    .coerce.number()
    .min(0.5, "Le nombre d'heure est requis."),

  shift: z
    .enum(["matin", "apres-midi", "journee"], "La valeur est incorrecte"),

  interventionCategoryId: z
    .string(),
    // .uuid("identifiant incorrect"),


  // toDo A adapter pour l'utilisation d'1 array
  extraCosts: z
    .array(z.string(), "le type de frais est invalide"),

  description: z
    .string()
    .max(250, 'La description est trop longue.')
    .optional(),


});
