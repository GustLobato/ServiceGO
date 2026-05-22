import { z } from 'zod';

export const createRequestSchema = z.object({
  listingId: z.string().cuid(),
  message: z.string().optional(),
  scheduledAt: z.coerce.date().optional(),
});

export const updateRequestStatusSchema = z.object({
  status: z.enum(['accepted', 'in_progress', 'completed', 'cancelled']),
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;
export type UpdateRequestStatusInput = z.infer<typeof updateRequestStatusSchema>;
