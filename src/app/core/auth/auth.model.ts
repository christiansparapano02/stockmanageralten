export interface LoginResponse {
  token: string;
  expirationDate: string; // Il backend restituisce un DateTime
}

export interface LoginCredentials {
  email: string;
  password?: string;
}
