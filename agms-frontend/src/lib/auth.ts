import { users, User } from './users';

interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export const authenticate = async (email: string, password: string): Promise<AuthResponse> => {
  // Gerçek bir API çağrısı gibi simüle etmek için setTimeout kullanıyoruz
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        // Kullanıcı bilgilerini localStorage'a kaydediyoruz
        localStorage.setItem('user', JSON.stringify(user));
        resolve({ success: true, user });
      } else {
        resolve({ 
          success: false, 
          error: 'Invalid email or password' 
        });
      }
    }, 1000); // 1 saniye gecikme
  });
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = (): boolean => {
  return !!getCurrentUser();
}; 