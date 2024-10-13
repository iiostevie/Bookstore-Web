import React from 'react';
import { useState } from 'react';
import { createApi } from '../../features/characters/api';
import makePage from '../../components/makePage';
import CharacterForm from '../../components/CharacterForm';

const CreateCharacter = () => {
  const [character, setCharacter] = useState({
    name: '',
    subtitle: '',
    description: '',
    strength: '',
    speed: '',
    skill: '',
    fear_factor: '',
    power: '',
    intelligence: '',
    wealth: '',
  });

  const submitHandler = async (form) => {
    setCharacter(form);
    try {
      const response = await createApi(
        form.name,
        form.subtitle,
        form.description,
        form.strength,
        form.speed,
        form.skill,
        form.fear_factor,
        form.power,
        form.intelligence,
        form.wealth,
      );
      console.log('Create characters successfully', response);
      return Promise.resolve();
    } catch (err) {
      console.error('Error to post data:', err);
      return Promise.reject();
    }
  };

  return (
    <CharacterForm
      pagesInitVal={character}
      onSubmit={submitHandler}
      title="Create Character"
      btnLabel="Create"
    />
  );
};

export default makePage('Create Character', ['user', 'admin'], CreateCharacter);
