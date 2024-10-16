export type Error = {
  property: string;
  message: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Response<T = any> = {
  data: T | null;
  errors: Error[];
  hasErrors: boolean;
};

export type UserGetDto = {
  id: number;
  name: string;
};

export type ClientGetDto = {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
};

export type ClientCreateDto = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
};

export type SessionGetDto = {
  id: number;
  userId: number;
  durationMinutes: number;
  startTime: string;
  endTime: string;
  groupId: number;
  clientId: number;
};

export type SessionCreateDto = {
  userId: number;
  durationMinutes: number;
  startTime: string;
  endTime: string;
  groupId: number;
  clientId: number;
};

export type SessionUpdateDto = {
  userId: number;
  durationMinutes: number;
  startTime: string;
  endTime: string;
  groupId: number;
  clientId: number;
};

export type GoalGetDto = {
  id: number;
  userId: number;
  goalInformation: string;
  clientId: number;
};

export type GoalCreateDto = {
  userId: number;
  goalInformation: string;
  clientId: number;
};

export type GoalUpdateDto = {
  userId: number;
  goalInformation: string;
  clientId: number;
};

export type GroupGetDto = {
  id: number;
  clients: ClientGetDto[];
};

export type GroupCreateDto = {
  clients: ClientGetDto[];
};

export type GroupUpdateDto = {
  clients: ClientGetDto[];
};
