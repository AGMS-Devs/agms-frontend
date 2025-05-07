import { users, User } from './users';

// Ensure localStorage has users initialized
if (typeof window !== 'undefined') {
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(users));
  }
}

interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export const authenticate = async (email: string, password: string): Promise<AuthResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // First check localStorage for registered users
      const storedUsersStr = localStorage.getItem('users');
      const storedUsers: User[] = storedUsersStr ? JSON.parse(storedUsersStr) : [];

      // Combine stored users with default users
      const allUsers = [...users, ...storedUsers];

      const user = allUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        // Save current user to localStorage
        localStorage.setItem('user', JSON.stringify(user));
        resolve({ success: true, user });
      } else {
        resolve({
          success: false,
          error: 'Invalid email or password'
        });
      }
    }, 1000);
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

export const register = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<{ success: boolean; error?: string }> => {
  // Validate IYTE email
  if (!email.endsWith('@iyte.edu.tr') && !email.endsWith('@std.iyte.edu.tr')) {
    return { success: false, error: 'Only IYTE email addresses (@iyte.edu.tr or @std.iyte.edu.tr) are allowed.' };
  }

  // Check if user already exists
  const existingUser = users.find((u) => u.email === email);
  if (existingUser && existingUser.password && existingUser.password.length > 0) {
    return { success: false, error: 'This email is already registered.' };
  }

  // Create new user or update existing one
  const user: User = {
    id: existingUser?.id || Date.now().toString(),
    email,
    password,
    name: `${firstName} ${lastName}`,
    role: 'user',
    graduationStatus: {
      isEligible: false,
      requirements: {
        tuitionPaid: false,
        libraryBooksReturned: false,
        studentCardReturned: false,
        otherFeesPaid: false
      }
    }
  };

  if (!existingUser) {
    users.push(user);
  } else {
    const index = users.findIndex(u => u.email === email);
    users[index] = user;
  }

  // Save the updated users array to localStorage
  localStorage.setItem('users', JSON.stringify(users));

  return { success: true };
};

// Send password reset code (in a real app, this would send an email)
export const sendPasswordResetCode = async (email: string): Promise<{ success: boolean; error?: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Check if email exists
      const storedUsersStr = localStorage.getItem('users');
      const storedUsers: User[] = storedUsersStr ? JSON.parse(storedUsersStr) : [];
      const allUsers = [...users, ...storedUsers];
      const user = allUsers.find((u) => u.email === email);

      if (!user) {
        resolve({ success: false, error: 'No account found with this email address.' });
        return;
      }

      // Simulate sending a new password
      console.log(`A new password has been sent to ${email}.`); // For development purposes only

      resolve({ success: true });
    }, 1000);
  });
};
