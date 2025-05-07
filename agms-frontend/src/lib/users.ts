import { authenticate } from '@/lib/auth';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
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

export const users: User[] = [
  {
    id: '1',
    email: 'admin@iyte.edu.tr',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    graduationStatus: {
      isEligible: true,
      requirements: {
        tuitionPaid: true,
        libraryBooksReturned: true,
        studentCardReturned: true,
        otherFeesPaid: true
      }
    }
  },
];