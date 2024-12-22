// src/@types/customRequest.d.ts
import { Request as ExpressRequest } from 'express';
import { User } from '../entities/user.entity';

export interface Request extends ExpressRequest {
  user?: any;
  token?: string;
}


