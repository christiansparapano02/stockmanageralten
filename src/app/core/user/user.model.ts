export type UserRole = 'admin' | 'medicalArea' | 'securityArea' | 'officeArea' | 'breakArea';

export interface User {
  id?: string; //può mancare durante la creazione di un nuovo user, poi restituito dal backend
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}
