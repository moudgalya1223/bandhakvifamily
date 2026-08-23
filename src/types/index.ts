export interface UserProfile {
  id?: string;
  name: string;
  age: string | number;
  gender: 'Male' | 'Female' | 'Other';
  gotra: string;
  email: string;
  phone: string;
  relation: string;
  status: 'pending' | 'approved' | 'rejected';
  isAdmin?: boolean;
  createdAt: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  generation: number;
  gender: 'Male' | 'Female' | 'Other';
  gotra: string;
  relation: string;
  parentId: string | null;
  spouse?: string;
  bio?: string;
  phone?: string;
  email?: string;
  status: 'approved' | 'pending';
}

export interface DonationRecord {
  id: string | number;
  name: string;
  amount: number;
  cause: string;
  date: string;
  email?: string;
  paymentMethod?: string;
}

export interface MailLog {
  to: string;
  subject: string;
  body: string;
  timestamp: string;
}
