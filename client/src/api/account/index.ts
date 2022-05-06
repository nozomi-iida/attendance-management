export enum AccountRole {
  GENERAL = "general",
  ADMIN = "admin",
}
export type Account = {
  id: number;
  handleName: string;
  email: string;
  role: AccountRole;
};

export const mockAccount = (modification?: Account): Account => {
  return {
    id: 1,
    handleName: "test",
    email: "test@test.com",
    role: AccountRole.GENERAL,
    ...modification,
  };
};
