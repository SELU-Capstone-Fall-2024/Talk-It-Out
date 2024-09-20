import axios from 'axios';
import { SessionGetDto, SessionCreateDto, SessionUpdateDto, Response } from '../types';

const API_URL = '/sessions';

// Get all sessions
export const getAllSessions = async (): Promise<Response<SessionGetDto[]>> => {
  const response = await axios.get<Response<SessionGetDto[]>>(API_URL);
  return response.data;
};

// Get a session by ID
export const getSessionById = async (id: number): Promise<Response<SessionGetDto>> => {
  const response = await axios.get<Response<SessionGetDto>>(`${API_URL}/${id}`);
  return response.data;
};

// Create a session
export const createSession = async (sessionCreateDto: SessionCreateDto): Promise<Response<SessionGetDto>> => {
  const response = await axios.post<Response<SessionGetDto>>(API_URL, sessionCreateDto);
  return response.data;
};

// Update a session
export const updateSession = async (id: number, sessionUpdateDto: SessionUpdateDto): Promise<Response<SessionGetDto>> => {
  const response = await axios.put<Response<SessionGetDto>>(`${API_URL}/${id}`, sessionUpdateDto);
  return response.data;
};

// Delete a session
export const deleteSession = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
