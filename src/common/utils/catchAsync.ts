// src/common/utils/catchAsync.ts
import { Request, Response, NextFunction } from "express";

export const catchAsync =
  <T extends Request = Request>(
    fn: (
      req: T,
      res: Response,
      next: NextFunction
    ) => Promise<unknown>
  ) =>
  (req: T, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };