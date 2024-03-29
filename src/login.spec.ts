import { login } from './login';

describe('Login', () => {
  xit('should login', async () => {
    const cookie = await login('id', 'password');

    expect(cookie).toBeDefined();
  });
});
