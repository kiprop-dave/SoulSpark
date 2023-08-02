import { api } from "./base";
import { loggedInUserSchema, LoggedInUser } from "@/types";

export const getLoggedInUser = async (): Promise<LoggedInUser | null> => {
  try {
    const { data } = await api.get('auth/me');
    const user = loggedInUserSchema.parse(data);
    return user;
  } catch (err) {
    console.error(err);
    return null;
  }
};
