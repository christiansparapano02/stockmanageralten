//risposta del be
export interface LoginResponse {
  token: string;
  expirationDate: string; // Il backend restituisce un DateTime
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

//dati utente estratti dal token
export interface AuthSession {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roleId: string; //di regola da eliminare
  officeId: string;
  expiresAt: number; // Timestamp calcolato dalla expirationDate
}
