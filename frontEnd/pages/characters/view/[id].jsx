import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // use dynamic routes
import {
  Box,
  Text,
  LoadingOverlay,
  Title,
  ActionIcon,
  Button,
} from '@mantine/core';
import { viewApi } from '../../../features/characters/api';
import { IconHeart } from '@tabler/icons-react';

const AddFave = () => {
  // TODO: add to user favourite list
};

const ViewCharacter = () => {
  const router = useRouter(); // extract the route parameter
  const characterId = router.query.id;

  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (characterId) {
      const getCharacter = async () => {
        try {
          const response = await viewApi(characterId);
          // console.log(response);
          setCharacter(response);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };
      getCharacter();
    }
  }, [characterId]);

  if (loading) return <LoadingOverlay visible={true} />;
  if (error) return <Text>Error: {error}</Text>;
  if (!character) return <Text>No character data available.</Text>;

  console.log(character);

  return (
    <Box>
      {/* {
                character.image_url && (<img src={`/frontEnd/public/${character.image_url}`} alt={character.name}/>)
            } */}
      <Title>{character.name}</Title>
      <Text>Subtitle: {character.subtitle}</Text>
      <Text>Description: {character.description}</Text>
      <Text>Strength: {character.strength}</Text>
      <Text>Speed: {character.speed}</Text>
      <Text>Skill: {character.skill}</Text>
      <Text>Fear Factor: {character.fear_factor}</Text>
      <Text>Power: {character.power}</Text>
      <Text>Intelligence: {character.intelligence}</Text>
      <Text>Wealth: {character.wealth}</Text>
      <ActionIcon>
        <IconHeart onClick={AddFave} />
      </ActionIcon>
      <a href="/cartoonpia">
        <Button variant="default">Go Back</Button>
      </a>
      <a href={`/characters/edit/${characterId}`}>
        <Button>Edit</Button>
      </a>
    </Box>
  );
};

export default ViewCharacter;
