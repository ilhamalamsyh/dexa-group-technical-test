export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
  employeeId?: number;
}

export interface RequestUser {
  id: number;
  email: string;
  role: string;
  employeeId?: number;
}
