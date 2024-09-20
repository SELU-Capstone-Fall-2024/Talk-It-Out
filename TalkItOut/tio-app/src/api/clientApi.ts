import axios from 'axios';
import { ClientGetDto, ClientCreateDto, Response } from '../types';

const API_URL = '/clients';

// Get all sessions
export const getAllClients = async (): Promise<Response<ClientGetDto[]>> => {
  const response = await axios.get<Response<ClientGetDto[]>>(API_URL);
  return response.data;
};

// Get a session by ID
export const getClientById = async (id: number): Promise<Response<ClientGetDto>> => {
  const response = await axios.get<Response<ClientGetDto>>(`${API_URL}/${id}`);
  return response.data;
};

// Create a session
export const createClient = async (clientCreateDto: ClientCreateDto): Promise<Response<ClientGetDto>> => {
  const response = await axios.post<Response<ClientGetDto>>(API_URL, clientCreateDto);
  return response.data;
};

// Delete a session
export const deleteClient = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
