import axios from '../../lib/axios';

export const allCharacterInfo = () => axios.get('/allCharacters');
