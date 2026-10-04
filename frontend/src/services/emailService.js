import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://tempmail-kygb.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

/**
 * Obtiene la bandeja de entrada para un correo específico
 */
export const fetchInbox = async (address) => {
  if (!address) return [];
  const response = await api.get(`/emails/${encodeURIComponent(address)}`);
  return response.data;
};

/**
 * Obtiene el detalle de un correo específico
 */
export const fetchEmailDetail = async (id) => {
  const response = await api.get(`/emails/detail/${id}`);
  return response.data;
};

/**
 * Elimina un correo de la bandeja
 */
export const deleteEmail = async (id) => {
  const response = await api.delete(`/emails/${id}`);
  return response.data;
};
