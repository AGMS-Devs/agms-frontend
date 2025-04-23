export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
}

export const users: User[] = [
  {
    id: '1',
    email: 'admin@std.iyte.edu.tr',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin'
  }
];