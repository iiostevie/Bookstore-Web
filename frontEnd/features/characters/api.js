import axios from '../../lib/axios';

export const createApi = (
  name,
  subtitle,
  description,
  strength,
  speed,
  skill,
  fear_factor,
  power,
  intelligence,
  wealth,
) =>
  axios.post('/characters/create', {
    name,
    subtitle,
    description,
    strength,
    speed,
    skill,
    fear_factor,
    power,
    intelligence,
    wealth,
  });

export const viewApi = (characterId) => axios.get(`/characters/${characterId}`);

export const updateApi = (
  characterId,
  {
    name,
    subtitle,
    description,
    strength,
    speed,
    skill,
    fear_factor,
    power,
    intelligence,
    wealth,
  },
) =>
  axios.put(`/characters/${characterId}`, {
    name,
    subtitle,
    description,
    strength,
    speed,
    skill,
    fear_factor,
    power,
    intelligence,
    wealth,
  });
