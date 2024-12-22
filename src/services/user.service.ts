import { User, UserRank } from "../entities/user.entity";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AppError } from "./errorHandling.service";
import { Repository } from "typeorm";

export class UserService {
  constructor(
    private readonly userRepository: Repository<User>
  ){}
  
  generateAuthToken(user: User): string {
    // console.log("user", user);
    const tokenPayload = { email: user.email, id: user.id };
    const secretKey = process.env.JWT_SECRET!;
    const token = jwt.sign(tokenPayload, secretKey, { expiresIn: process.env.JWT_EXPIRES_IN });
    return token;
  }

  createReferralCode(): string {
    return Math.floor(Math.random() * 90000000000 + 10000000000).toString();
  }

  // ============== HASH PASSWORD ============== //
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  // ============== COMPARE PASSWORD ============== //
  async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
  

  // ================ REWARD BY RANK ======================= //
  async rewardByRank(user: User): Promise<number> {
    let reward = 0
    // =============== REWARD FOR PRINCE_OF_OMNI_STOCK ============= //
    if (user.rank == UserRank.PRINCE_OF_OMNI_STOCK) return reward = 100;
    return reward
  }


  // =================== CALCULATE ALL USER'S REFERRALS ====================== //
  // async allUserReferrals(theUser: User) {
  //   const getAllReferrers = async (theUser: User, generation: number): Promise<User[]> => {
  //     if (generation > 15) return []; // Stop at the 15th generation
  
  //     const currentUser = await this.userRepository.findOne({
  //       where: { id: theUser.id },
  //       relations: ["referrers"],
  //     });
  //     if (!currentUser || !currentUser.referrers) return [];  
  //     let allReferrers = [...currentUser.referrers];  
  //     for (const referrer of currentUser.referrers) {
  //       const nestedReferrers = await getAllReferrers(referrer, generation + 1);
  //       allReferrers = [...allReferrers, ...nestedReferrers];
  //     }  
  //     return allReferrers;
  //   };
  
  //   const user = await this.userRepository.findOne({
  //     where: { id: theUser.id },
  //     relations: ["referrers"],
  //   });  
  //   if (!user) return next(new AppError("User not found", 404));  
  //   const allReferrers = await getAllReferrers(user, 1);
  // }
  

  // =================== ASSIGNING RANK ======================= //
  async asignUserRanks(user: User) {
    // ======================= CHECKING FOR RANK CRITERIAS ====================== //
    // TODO: check team stake
    // TODO: CHECK FOR AT LEAST FIVE USER'S REFERRALS WITH MINIMUM STATKE OF 200K
    const staked = user.investments.reduce((amount, staker) => amount+staker.amount, 0);
    if (staked >= 10000) user.rank == UserRank.PRINCE_OF_OMNI_STOCK;
    else if (staked) {}
  }
}