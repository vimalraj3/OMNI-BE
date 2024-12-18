import express from 'express';
import { InvestmentController } from '../controllers/investment.controller';
import { InvestmentService } from '../services/investment.service';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { dataSource } from '../configs/dataSource';
import { Investment } from '../entities/investment.entity';
import authMiddleware from '../middlewares/auth.middleware';
import { Earning } from '../entities/earnings.entity';
import { Return } from '../entities/return.entity';
import { ReturnController } from '../controllers/Return.controller';

const router = express.Router();
let userRepository: Repository<User> = dataSource.getRepository(User);
let investmentRepository: Repository<Investment> = dataSource.getRepository(Investment);
let earningHistoryRepository: Repository<Earning> = dataSource.getRepository(Earning);
let investmentService = new InvestmentService(userRepository, earningHistoryRepository);
let returnRepository: Repository<Return> = dataSource.getRepository(Return);
let returnService = new ReturnController(userRepository, returnRepository);

let investmentController = new InvestmentController(investmentService, userRepository, investmentRepository, earningHistoryRepository, returnService);

router.use(authMiddleware);
router.post("/invest", investmentController.createInvestment);
router.post("/rate", returnService.createReturn);

export default router;