export const createUserResponse = (login: string, email: string) => {
  return {
    id: expect.any(String),
    login,
    email,
    createdAt: expect.any(String),
  };
};
