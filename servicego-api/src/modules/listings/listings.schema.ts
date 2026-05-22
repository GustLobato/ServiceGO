import { z } from 'zod';

export const createListingSchema = z.object({
  title: z.string().min(3, 'Título muito curto'),
  description: z.string().min(10, 'Descrição muito curta'),
  category: z.string().min(1),
  price: z.number().positive(),
  priceType: z.enum(['fixed', 'hourly', 'negotiable']).default('fixed'),
  location: z.string().optional(),
  imageUrl: z.string().url().optional(),
});

export const updateListingSchema = createListingSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export const listingQuerySchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(12),
});

export type CreateListingInput = z.infer<typeof createListingSchema>;
export type UpdateListingInput = z.infer<typeof updateListingSchema>;
export type ListingQuery = z.infer<typeof listingQuerySchema>;
