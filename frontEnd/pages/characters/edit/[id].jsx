import { useState, useEffect } from 'react';
import { viewApi, updateApi } from '../../../features/characters/api';
import { useRouter } from 'next/router'; // use dynamic routes
import { LoadingOverlay } from '@mantine/core';
import makePage from '../../../components/makePage';
import CharacterForm from '../../../components/CharacterForm';

const EditForm = () => {
  const router = useRouter();
  const characterId = router.query.id;

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
  const [loading, setLoading] = useState(true);

  const getCharacter = async () => {
    try {
      const currentCharacter = await viewApi(characterId);
      setCharacter(currentCharacter);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (characterId) {
      getCharacter();
    }
  }, [characterId]);

  const getUpdateFields = (form) => {
    const updateFields = {};
    const currentValues = form;

    for (const key in currentValues) {
      const formVal = currentValues[key];
      const oriVal = character[key];

      // in case emtpy string is also considered as modification parameter
      if (formVal !== oriVal && formVal != '') {
        updateFields[key] = formVal;
      }
    }
    return updateFields;
  };

  const submitHandler = async (form) => {
    try {
      const updateFields = getUpdateFields(form);
      const response = await updateApi(characterId, updateFields);
      console.log('Update character successfully', response);
      return Promise.resolve();
    } catch (err) {
      console.error('Error to post data:', err);
      return Promise.reject();
    }
  };

  if (loading) return <LoadingOverlay visible={true} />;

  return (
    <CharacterForm
      pagesInitVal={character}
      onSubmit={submitHandler}
      title="Edit Character"
      btnLabel="Update"
    />
  );
};

export default makePage('EditForm', ['user', 'admin'], EditForm);
