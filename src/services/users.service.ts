export interface User {
  id: string;
  email: string;
  name: string;
  department: string;
  role:
    | "student"
    | "library"
    | "sks"
    | "doitp"
    | "career"
    | "studentAffairs"
    | "advisor"
    | "rectorate"
    | "facultyDeansOffice"
    | "departmentSecretary"; // güncel roller burada
  graduationStatus: {
    isEligible: boolean;
    requirements: {
      tuitionPaid: boolean;
      libraryBooksReturned: boolean;
      studentCardReturned: boolean;
      otherFeesPaid: boolean;
    };
  };
}

interface ApiResponse<T> {
  success: boolean;
  error?: string;
  data?: T;
}

export const usersService = {
  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      // TODO: Replace with actual API endpoint
      const response = await fetch("/api/users/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: "An unexpected error occurred.",
      };
    }
  },

  async updateUser(
    userId: string,
    userData: Partial<User>
  ): Promise<ApiResponse<User>> {
    try {
      // TODO: Replace with actual API endpoint
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: "An unexpected error occurred.",
      };
    }
  },

  async updateGraduationStatus(
    userId: string,
    status: User["graduationStatus"]
  ): Promise<ApiResponse<User>> {
    try {
      // TODO: Replace with actual API endpoint
      const response = await fetch(`/api/users/${userId}/graduation-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(status),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: "An unexpected error occurred.",
      };
    }
  },
};
