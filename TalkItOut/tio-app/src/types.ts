export type Error = {
  property: string;
  message: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type Response<T = any> = {
  data: T | null;
  errors: Error[];
  hasErrors: boolean;
};

export type UserGetDto = {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
};

export type UserCreateDto = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
};

export type UserUpdateDto = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
};

export type PasswordUpdateDto = {
  currentPassword: string;
  newPassword: string;
};

export type UserLoginDto = {
  username: string;
  password: string;
};

export type ClientGetDto = {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  userId: number;
};

export type ClientCreateDto = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  userId: number;
};

export type ClientUpdateDto = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  userId: number;
  isDateOfBirthUpdated: boolean;
};

export type SessionGetDto = {
  id: number;
  userId: number;
  startTime: string;
  endTime: string;
  groupId: number;
  clientId: number;
};

export type SessionCreateDto = {
  userId: number;
  startTime: string;
  endTime: string;
  groupId: number;
  clientId: number;
};

export type SessionUpdateDto = {
  userId: number;
  startTime: string;
  endTime: string;
  groupId: number;
  clientId: number;
};

export type GoalGetDto = {
  id: number;
  userId: number;
  information: string;
  clientId: number;
  createdByUserName: string;
  clientFirstName: string;
  clientLastName: string;
};

export type GoalCreateDto = {
  userId: number;
  information: string;
  clientId: number;
};

export type GoalUpdateDto = {
  userId: number;
  information: string;
  clientId: number;
};

export type GroupGetDto = {
  id: number;
  groupName: string;
  clientIds: number[];
  userId: number;
};

export type GroupCreateDto = {
  groupName: string;
  clientIds: number[];
  userId: number;
};

export type GroupUpdateDto = {
  groupName: string;
  clientIds: number[];
  userId: number;
};

export type OptionType = {
  label: string;
  value: string;
};
