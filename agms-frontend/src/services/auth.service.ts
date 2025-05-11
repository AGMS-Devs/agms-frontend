import { toast } from "@/components/ui/use-toast"
import { User } from "./users.service"

interface AuthResponse {
  success: boolean
  error?: string
  data?: any
}

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
}

// Mock user data for demo
const mockUser: User = {
  id: '1',
  email: 'demo@std.iyte.edu.tr',
  name: 'Demo User',
  department: 'Computer Engineering',
  role: 'student',
  graduationStatus: {
    isEligible: true,
    requirements: {
      tuitionPaid: true,
      libraryBooksReturned: false,
      studentCardReturned: true,
      otherFeesPaid: true
    }
  }
};

// Store auth state in localStorage
const AUTH_KEY = 'auth_demo_user';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      // Demo login - accept any email/password
      if (email && password) {
        localStorage.setItem(AUTH_KEY, JSON.stringify(mockUser));
        return {
          success: true,
          data: mockUser
        };
      }
      return {
        success: false,
        error: 'Invalid credentials'
      };
    } catch (error) {
      return {
        success: false,
        error: 'An unexpected error occurred.'
      };
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Demo register - always succeed
      return {
        success: true,
        data: {
          message: 'Registration successful'
        }
      };
    } catch (error) {
      return {
        success: false,
        error: 'An unexpected error occurred.'
      };
    }
  },

  async forgotPassword(email: string): Promise<AuthResponse> {
    try {
      // Demo forgot password - always succeed
      return {
        success: true,
        data: {
          message: 'Password reset email sent'
        }
      };
    } catch (error) {
      return {
        success: false,
        error: 'An unexpected error occurred.'
      };
    }
  },

  async logout(): Promise<AuthResponse> {
    try {
      localStorage.removeItem(AUTH_KEY);
      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: 'An unexpected error occurred.'
      };
    }
  },

  // Helper function to check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem(AUTH_KEY);
  },

  // Helper function to get current user
  getCurrentUser(): User | null {
    const user = localStorage.getItem(AUTH_KEY);
    return user ? JSON.parse(user) : null;
  }
}; 