import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { createRequestSchema, updateRequestStatusSchema } from './requests.schema.js';
import * as requestsService from './requests.service.js';

export const requestsRouter = Router();

// POST /requests — cliente cria uma solicitação
requestsRouter.post('/', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = createRequestSchema.parse(req.body);
    const request = await requestsService.createRequest(req.user!.sub, input);
    res.status(201).json(request);
  } catch (err) {
    next(err);
  }
});

// GET /requests/mine — lista as solicitações do usuário logado
requestsRouter.get('/mine', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requests = await requestsService.getMyRequests(req.user!.sub, req.user!.role);
    res.json(requests);
  } catch (err) {
    next(err);
  }
});

// PATCH /requests/:id/status — atualiza status
requestsRouter.patch(
  '/:id/status',
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = updateRequestStatusSchema.parse(req.body);
      const request = await requestsService.updateRequestStatus(
        req.params.id,
        req.user!.sub,
        req.user!.role,
        input,
      );
      res.json(request);
    } catch (err) {
      next(err);
    }
  },
);
