// API for fetching the details of specific character based on ID.

import axios from '../../lib/axios';

export const fetchCharacterDetails = async (characterId) => {
  try {
    const response = await axios.get(`/characters/${characterId}`);
    return response;
  } catch (error) {
    console.error('Failed to fetch character details:', error);
    throw new Error('Failed to fetch character details');
  }
};
