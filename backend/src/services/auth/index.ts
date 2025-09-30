import { authLogin } from './authLogin';
import { authRegister } from './authRegister';
import { authValidate } from './authValidate';

export const authService = {
  login: authLogin,
  register: authRegister,
  validate: authValidate
};

export * from './authTypes';