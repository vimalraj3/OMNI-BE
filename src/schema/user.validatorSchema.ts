import Joi from "joi";

export const createUserSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  country: Joi.string().required(),
  state: Joi.string().required(),
  city: Joi.string().required(),
  address: Joi.string().required(),
  phone: Joi.string().required(),
  referralCode: Joi.string().optional().empty(''),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
