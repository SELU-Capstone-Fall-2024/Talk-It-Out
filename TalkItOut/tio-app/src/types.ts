export type Error = {
    property: string;
    message: string;
  }

export type Response<T = any> = {
  data: T | null;                      
  errors: Error[];                    
  hasErrors: boolean;                 
}

export type UserGetDto = {
id: number;
name: string;
}

export type ClientGetDto = {
  id: number;
  firstName: string;
  lastname: string;
  dateOfBirth: string;
}

export type ClientCreateDto = {
  firstName: string;
  lastname: string;
  dateOfBirth: string;
}

export type SessionGetDto = {
  id: number;
  userId: number;
  durationMinutes: number;
  startTime: string;
  endTime: string;
  groupId: number;
  clientId: number;
}

export type SessionCreateDto = {
  userId: number;
  durationMinutes: number;
  startTime: string;
  endTime: string;
  groupId: number;
  clientId: number;
}

export type SessionUpdateDto = {
  userId: number;
  durationMinutes: number;
  startTime: string;
  endTime: string;
  groupId: number;
  clientId: number;
}