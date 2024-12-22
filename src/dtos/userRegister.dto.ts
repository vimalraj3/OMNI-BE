export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  country: string;
  state: string;
  city: string;
  address: string;
  phone: string;
  referralCode?: string;
}