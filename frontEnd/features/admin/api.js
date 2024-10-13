import axios from '../../lib/axios';

export const handleCharacterRequest = (contributionId, approved) => {
  axios.post('/handleCharacterRequest', { contributionId, approved });
};

export const pendingCharacterInfo = () => axios.get('/pendingCharacters');

export const CharacterHistoryInfo = () => axios.get('/characterHistory');

export const AllUserInfo = () => axios.get('/allUsers');

export const handlePromoteUser = (userId) =>
  axios.post('/promoteUser', { userId });

export const handleDemoteUser = (userId) =>
  axios.post('/demoteUser', { userId });

export const handleDeleteCharacter = (characterId) =>
  axios.post('/deactivateCharacter', { characterId });
