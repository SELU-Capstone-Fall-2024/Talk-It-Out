export type User = {
    id: number;
    name: string;
  }

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