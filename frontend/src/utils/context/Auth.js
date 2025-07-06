export function getCurrentUser() {
    const user = localStorage.getItem('users');
    return user ? JSON.parse(user) : null;
  }
  
  export function isLoggedIn() {
    return !!localStorage.getItem('users');
  }
  