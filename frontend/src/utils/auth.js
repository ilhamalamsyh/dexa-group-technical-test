export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const setUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const removeAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const clearAuth = removeAuth;

export const isAuthenticated = () => {
  return !!getToken();
};

export const isHRAdmin = () => {
  const user = getUser();
  return user?.role === "HR_ADMIN";
};

export const isEmployee = () => {
  const user = getUser();
  return user?.role === "EMPLOYEE";
};
