"use client";
import useAxiosPrivate from "../api/useAxiosPrivate";
import { useAuthContext } from "../context/AuthContext";
import AuthService from "../services/authService";

const useAuth = () => {
  const { auth, setAuth, loggingOut } = useAuthContext();
  const axiosPrivate = useAxiosPrivate();

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const { accessToken } = await AuthService.login({ email, password });
    const user = await AuthService.getMe(axiosPrivate, accessToken);

    loggingOut.current = false; // reset logout flag on login
    localStorage.setItem("loggedIn", "true");
    console.log("HOOK USER:", user);
    setAuth({
      accessToken,
      user,
      roles: user.roles || [],
    });

    return user;
  };

  const logout = async () => {
    loggingOut.current = true; // prevent refresh after logout
    await AuthService.logout();

    setAuth({ accessToken: null, user: null, roles: [] });
    localStorage.setItem("logout", Date.now().toString());
    localStorage.removeItem("loggedIn");
  };

  return { auth, login, logout };
};

export default useAuth;
