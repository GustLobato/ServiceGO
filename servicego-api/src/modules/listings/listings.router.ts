import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware.js';
import {
  createListingSchema,
  updateListingSchema,
  listingQuerySchema,
} from './listings.schema.js';
import * as listingsService from './listings.service.js';

export const listingsRouter = Router();

// GET /listings — público, com filtros
listingsRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = listingQuerySchema.parse(req.query);
    const result = await listingsService.getListings(query);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// GET /listings/mine — somente providers
listingsRouter.get(
  '/mine',
  authMiddleware,
  requireRole('provider'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const listings = await listingsService.getMyListings(req.user!.sub);
      res.json(listings);
    } catch (err) {
      next(err);
    }
  },
);

// GET /listings/:id — público
listingsRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const listing = await listingsService.getListingById(req.params.id as string);
    res.json(listing);
  } catch (err) {
    next(err);
  }
});

// POST /listings — somente providers
listingsRouter.post(
  '/',
  authMiddleware,
  requireRole('provider'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = createListingSchema.parse(req.body);
      const listing = await listingsService.createListing(req.user!.sub, input);
      res.status(201).json(listing);
    } catch (err) {
      next(err);
    }
  },
);

// PATCH /listings/:id — somente o provider dono
listingsRouter.patch(
  '/:id',
  authMiddleware,
  requireRole('provider'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = updateListingSchema.parse(req.body);
      const listing = await listingsService.updateListing(req.params.id as string, req.user!.sub, input);
      res.json(listing);
    } catch (err) {
      next(err);
    }
  },
);

// DELETE /listings/:id — somente o provider dono
listingsRouter.delete(
  '/:id',
  authMiddleware,
  requireRole('provider'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await listingsService.deleteListing(req.params.id as string, req.user!.sub);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
);
