import axios from '../../lib/axios';

export const checkIfInFavourites = async (characterId) => {
  try {
    const response = await axios.get(`/favourites/check/${characterId}`);
    return response;
  } catch (error) {
    console.error('Failed to check if character in favourites: ', error);
    throw new Error('Failed to check if character in favourites');
  }
};

export const addToFavourites = async (characterId) => {
  try {
    const response = await axios.post('/favourites/add', { characterId });
    return response;
  } catch (error) {
    console.error('Failed to add character to favourites: ', error);
    throw new Error('Failed to add character to favourites');
  }
};

export const removeFromFavourites = async (characterId) => {
  try {
    const response = await axios.post('/favourites/remove', { characterId });
    return response;
  } catch (error) {
    console.error('Failed to remove character to favourites: ', error);
    throw new Error('Failed to remove character to favourites');
  }
};

export const getUserFavourites = async () => {
  try {
    const response = await axios.get('/favourites');
    return response;
  } catch (error) {
    console.error('Failed to fetch user favourites: ', error);
    throw new Error('Failed to fetch uesr favourites');
  }
};
