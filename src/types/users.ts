export type User = {
  id: number;
  role: "patient" | "doctor" | "admin";
  email: string;
  fullName: string | null;
  isActive: boolean;
};
