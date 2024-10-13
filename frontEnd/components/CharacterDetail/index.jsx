import { Button, Image, Anchor } from '@mantine/core';
import { IconHeart, IconHeartFilled } from '@tabler/icons-react';

const CharacterDetail = ({
  character,
  isFavourite,
  onAddToFavourites,
  onRemoveFromFavourites,
}) => {
  return (
    <div>
      <h2>{character.name}</h2>
      <h3>Also known as: {character.subtitle}</h3>

      <div>
        {character.image_url && (
          <Image
            src={`/${character.id}.jpg`}
            alt={`${character.name} Image`}
            w={200}
            height={'auto'}
          />
        )}
      </div>

      <p>Description: {character.description}</p>
      {/* Favourite button based on state */}
      {isFavourite ? (
        <Button onClick={onRemoveFromFavourites}>
          <IconHeartFilled />
        </Button>
      ) : (
        <Button onClick={onAddToFavourites}>
          <IconHeart />
        </Button>
      )}

      <h3>Stats</h3>
      <p>Strength: {character.strength}</p>
      <p>Speed: {character.speed}</p>
      <p>Skill: {character.skill}</p>
      <p>Fear Factor: {character.fear_factor}</p>
      <p>Power: {character.power}</p>
      <p>Intelligence: {character.intelligence}</p>
      <p>Wealth: {character.wealth}</p>
      <div>
        <Anchor href={`/characters/edit/${character._id}`}>
          <Button variant="default">Edit Character</Button>
        </Anchor>
      </div>
    </div>
  );
};

export default CharacterDetail;
