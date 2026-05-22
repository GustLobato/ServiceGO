import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware.js';
import { createReviewSchema } from './reviews.schema.js';
import * as reviewsService from './reviews.service.js';

export const reviewsRouter = Router();

// POST /reviews — cliente avalia um serviço concluído
reviewsRouter.post('/', authMiddleware, requireRole('client'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = createReviewSchema.parse(req.body);
    const review = await reviewsService.createReview(req.user!.sub, input);
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
});

// GET /reviews/listing/:listingId — avaliações públicas de um listing
reviewsRouter.get('/listing/:listingId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reviews = await reviewsService.getListingReviews(req.params.listingId as string);
    res.json(reviews);
  } catch (err) {
    next(err);
  }
});
