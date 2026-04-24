//export type UserRole = 'admin' | 'medicalArea' | 'securityArea' | 'officeArea' | 'breakArea';

export interface User {
  id?: string; // Opzionale perché il backend lo genera dopo la post
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  officeId: string; //fk verso offices
  roleId: string; //fk verso roles
  isConfirmed: boolean;
  password?: string; // Solo per la creazione da parte dell admin
}
