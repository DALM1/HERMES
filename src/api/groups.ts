import { Group } from '../types/group';
import { apiClient } from './client';

// Récupérer tous les groupes de l'utilisateur
export const fetchUserGroups = async (): Promise<Group[]> => {
  try {
    const response = await apiClient.get('/api/groups/user');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des groupes:', error);
    throw error;
  }
};

// Récupérer les groupes populaires/suggérés
export const fetchSuggestedGroups = async (): Promise<Group[]> => {
  try {
    const response = await apiClient.get('/api/groups/suggested');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des groupes suggérés:', error);
    throw error;
  }
};

// Récupérer un groupe par son ID
export const fetchGroupById = async (groupId: string): Promise<Group> => {
  try {
    const response = await apiClient.get(`/api/groups/${groupId}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du groupe ${groupId}:`, error);
    throw error;
  }
};

// Créer un nouveau groupe
export const createGroup = async (groupData: FormData): Promise<Group> => {
  try {
    const response = await apiClient.post('/api/groups', groupData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création du groupe:', error);
    throw error;
  }
};

// Mettre à jour un groupe
export const updateGroup = async (groupId: string, groupData: FormData): Promise<Group> => {
  try {
    const response = await apiClient.put(`/api/groups/${groupId}`, groupData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du groupe ${groupId}:`, error);
    throw error;
  }
};

// Rejoindre un groupe
export const joinGroup = async (groupId: string): Promise<void> => {
  try {
    await apiClient.post(`/api/groups/${groupId}/join`);
  } catch (error) {
    console.error(`Erreur lors de la tentative de rejoindre le groupe ${groupId}:`, error);
    throw error;
  }
};

// Quitter un groupe
export const leaveGroup = async (groupId: string): Promise<void> => {
  try {
    await apiClient.delete(`/api/groups/${groupId}/leave`);
  } catch (error) {
    console.error(`Erreur lors de la tentative de quitter le groupe ${groupId}:`, error);
    throw error;
  }
};