import { toast } from "@/components/ui/use-toast";
import { User } from "./users.service";

interface AuthResponse {
  success: boolean;
  error?: string;
  data?: any;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Mock user data for demo
const mockUser: User = {
  id: "1",
  email: "demo@std.iyte.edu.tr",
  name: "Demo User",
  department: "Computer Engineering",
  role: "advisor", // 🎯 Değiştirerek test edebilirsin: 'library', 'sks', 'doitp', 'career', 'studentAffairs'
  graduationStatus: {
    isEligible: true,
    requirements: {
      tuitionPaid: true,
      libraryBooksReturned: false,
      studentCardReturned: true,
      otherFeesPaid: true,
    },
  },
};

const AUTH_KEY = "auth_demo_user";

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      if (email && password) {
        localStorage.setItem(AUTH_KEY, JSON.stringify(mockUser));
        return {
          success: true,
          data: mockUser,
        };
      }
      return {
        success: false,
        error: "Invalid credentials",
      };
    } catch (error) {
      return {
        success: false,
        error: "An unexpected error occurred.",
      };
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    return {
      success: true,
      data: { message: "Registration successful" },
    };
  },

  async forgotPassword(email: string): Promise<AuthResponse> {
    return {
      success: true,
      data: { message: "Password reset email sent" },
    };
  },

  async logout(): Promise<AuthResponse> {
    try {
      localStorage.removeItem(AUTH_KEY);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: "An unexpected error occurred.",
      };
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem(AUTH_KEY);
  },

  getCurrentUser(): User | null {
    const user = localStorage.getItem(AUTH_KEY);
    return user ? JSON.parse(user) : null;
  },
};
