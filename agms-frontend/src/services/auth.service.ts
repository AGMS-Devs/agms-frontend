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

// Mock users data for demo
const mockUsers: Record<string, User> = {
  "ataberkkizilirmak@std.iyte.edu.tr": {
    id: "1",
    email: "ataberkkizilirmak@std.iyte.edu.tr",
    name: "Ataberk Kizilirmak",
    department: "Computer Engineering",
    role: "student",
    graduationStatus: {
      isEligible: true,
      requirements: {
        tuitionPaid: true,
        libraryBooksReturned: true,
        studentCardReturned: true,
        otherFeesPaid: true,
      },
    },
  },

  "faculty@iyte.edu.tr": {
    id: "1",
    email: "faculty@iyte.edu.tr",
    name: "Faculty Dean User",
    department: "Computer Engineering",
    role: "facultyDeansOffice",
    graduationStatus: {
      isEligible: true,
      requirements: {
        tuitionPaid: true,
        libraryBooksReturned: true,
        studentCardReturned: true,
        otherFeesPaid: true,
      },
    },
  },
  "library@iyte.edu.tr": {
    id: "2",
    email: "library@iyte.edu.tr",
    name: "Library User",
    department: "Library",
    role: "library",
    graduationStatus: {
      isEligible: true,
      requirements: {
        tuitionPaid: true,
        libraryBooksReturned: true,
        studentCardReturned: true,
        otherFeesPaid: true,
      },
    },
  },
  "sks@iyte.edu.tr": {
    id: "3",
    email: "sks@iyte.edu.tr",
    name: "SKS User",
    department: "Student Affairs",
    role: "sks",
    graduationStatus: {
      isEligible: true,
      requirements: {
        tuitionPaid: true,
        libraryBooksReturned: true,
        studentCardReturned: true,
        otherFeesPaid: true,
      },
    },
  },
  "advisor@iyte.edu.tr": {
    id: "4",
    email: "advisor@iyte.edu.tr",
    name: "Advisor",
    department: "Computer Engineering",
    role: "advisor",
    graduationStatus: {
      isEligible: true,
      requirements: {
        tuitionPaid: true,
        libraryBooksReturned: true,
        studentCardReturned: true,
        otherFeesPaid: true,
      },
    },
  },
  "career@iyte.edu.tr": {
    id: "5",
    email: "career@iyte.edu.tr",
    name: "Career Center User",
    department: "Career Center",
    role: "career",
    graduationStatus: {
      isEligible: true,
      requirements: {
        tuitionPaid: true,
        libraryBooksReturned: true,
        studentCardReturned: true,
        otherFeesPaid: true,
      },
    },
  },
  "student@iyte.edu.tr": {
    id: "6",
    email: "student@iyte.edu.tr",
    name: "Student Affairs User",
    department: "Student Affairs",
    role: "studentAffairs",
    graduationStatus: {
      isEligible: true,
      requirements: {
        tuitionPaid: true,
        libraryBooksReturned: true,
        studentCardReturned: true,
        otherFeesPaid: true,
      },
    },
  },
  "rector@iyte.edu.tr": {
    id: "7",
    email: "rector@iyte.edu.tr",
    name: "Rectorate User",
    department: "Rectorate",
    role: "rectorate",
    graduationStatus: {
      isEligible: true,
      requirements: {
        tuitionPaid: true,
        libraryBooksReturned: true,
        studentCardReturned: true,
        otherFeesPaid: true,
      },
    },
  },
  "secretary@iyte.edu.tr": {
    id: "8",
    email: "secretary@iyte.edu.tr",
    name: "Department Secretary User",
    department: "Computer Engineering",
    role: "departmentSecretary",
    graduationStatus: {
      isEligible: true,
      requirements: {
        tuitionPaid: true,
        libraryBooksReturned: true,
        studentCardReturned: true,
        otherFeesPaid: true,
      },
    },
  },
    "doitp@iyte.edu.tr": {
    id: "9",
    email: "doitp@iyte.edu.tr",
    name: "Department of Information User",
    department: "Computer Engineering",
    role: "doitp",
    graduationStatus: {
      isEligible: true,
      requirements: {
        tuitionPaid: true,
        libraryBooksReturned: true,
        studentCardReturned: true,
        otherFeesPaid: true,
      },
    },
  },
};

const AUTH_KEY = "auth_demo_user";

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      if (email && password) {
        const user = mockUsers[email];
        if (user) {
          localStorage.setItem(AUTH_KEY, JSON.stringify(user));
          return {
            success: true,
            data: user,
          };
        }
        return {
          success: false,
          error: "Invalid credentials",
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
