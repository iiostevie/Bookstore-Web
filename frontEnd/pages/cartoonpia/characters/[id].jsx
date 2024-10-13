// Square brackets indicate dynamic routing depending on the characterID

import { useRouter } from 'next/router';
import CharacterDetail from '../../../components/CharacterDetail';
import { useEffect, useState } from 'react';
import { fetchCharacterDetails } from '../../../features/character/api';
import makePage from '../../../components/makePage';
import {
  addToFavourites,
  checkIfInFavourites,
  removeFromFavourites,
} from '../../../features/favourites/api';

const CharacterPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [character, setCharacter] = useState(null);
  const [doneFetchingCharacter, setDoneFetchingCharacter] = useState(false);
  const [doneFetchingFavourites, setDoneFetchingFavourites] = useState(false);
  const [error, setError] = useState(null);
  const [isFavourite, setFavourite] = useState(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      if (!id) return; // Exit early if ID is undefined

      setDoneFetchingCharacter(false); // Set fetchcharacter state to false while fetching data

      try {
        const characterData = await fetchCharacterDetails(id);
        setCharacter(characterData);
        setError(null);
      } catch (error) {
        console.error('Error fetching character details:', error);
        setError('Failed to fetch character details');
      } finally {
        setDoneFetchingCharacter(true); // Set fetchcharacter state to true when done fetching
      }
    };

    fetchCharacter();
  }, [id]);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        if (!character) {
          return;
        }

        setDoneFetchingFavourites(false);
        const { isFavourite } = await checkIfInFavourites(character.id);
        setFavourite(isFavourite);
        setDoneFetchingFavourites(true);
      } catch (error) {
        console.error('Error checking if character is in favourites', error);
      }
    };
    fetchFavourites();
  }, [character]);

  const handleAddToFavourites = async () => {
    try {
      await addToFavourites(character.id);
      setFavourite(true);
    } catch (error) {
      console.error('Error adding character to favourites: ', error);
    }
  };

  const handleRemoveFromFavourites = async () => {
    try {
      await removeFromFavourites(character.id);
      setFavourite(false);
    } catch (error) {
      console.error('Error removing character from favourites: ', error);
    }
  };

  if (!(doneFetchingCharacter && doneFetchingFavourites)) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <CharacterDetail
      character={character}
      isFavourite={isFavourite}
      onAddToFavourites={handleAddToFavourites}
      onRemoveFromFavourites={handleRemoveFromFavourites}
    />
  );
};

export default makePage(
  'Character Detail Page',
  ['user', 'admin'],
  CharacterPage,
);
