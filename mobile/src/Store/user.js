import { create } from "zustand";
import user from "../http/userService";

const useUser = create((set) => ({
  user: {},
  isAuth: false,
  isLoading: false,

  login: async (login, password) => {
    set({ isLoading: true });
    try {
      await user.Login(login, password);
      set({ isAuth: true });
      console.log("Успешная авторизация");
    } catch {
      set({ isAuth: false });
      console.log("Ошибка авторизации");
    } finally {
      set({ isLoading: false });
    }
  },
  auth: async () => {
    set({ isLoading: true });
    try {
      const data = await user.CheckAuth();
      set({ user: data.user, isAuth: true });
    } catch {
      set({ isAuth: false, isLoading: false });
    } finally {
      set({ isLoading: false });
    }
  },
  logout: async () => {
    await user.Logout();
    set({ user: null, isAuth: false });
  },
}));

export default useUser;
