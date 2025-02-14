export const isUserLoggedIn = (): boolean => {
    return !!localStorage.getItem('login-token');
  };
  