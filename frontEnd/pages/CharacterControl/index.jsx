import { useEffect, useState } from 'react';
import { allCharacterInfo } from '../../features/user/api';
import makePage from '../../components/makePage';
import { Table, Container, Button } from '@mantine/core';
import { handleDeleteCharacter } from '../../features/admin/api';

const CharacterControl = () => {
  const [characterData, setCharacterData] = useState([]);
  const [characterDeleted, setCharacterDeleted] = useState(false);
  useEffect(() => {
    allCharacterInfo().then((data) => setCharacterData(data));
  }, [characterDeleted]);

  return (
    <>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Strength</Table.Th>
            <Table.Th>Speed</Table.Th>
            <Table.Th>Skill</Table.Th>
            <Table.Th>Fear Factor</Table.Th>
            <Table.Th>Power</Table.Th>
            <Table.Th>Intelligence</Table.Th>
            <Table.Th>Wealth</Table.Th>
            <Table.Th>Action</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {characterData.map((val) => {
            return (
              <>
                <Table.Tr key={val._id}>
                  <Table.Td>{val.name}</Table.Td>
                  <Table.Td>{val.strength}</Table.Td>
                  <Table.Td>{val.speed}</Table.Td>
                  <Table.Td>{val.skill}</Table.Td>
                  <Table.Td>{val.fear_factor}</Table.Td>
                  <Table.Td>{val.power}</Table.Td>
                  <Table.Td>{val.intelligence}</Table.Td>
                  <Table.Td>{val.wealth}</Table.Td>
                  <Table.Td>
                    <Button
                      variant="filled"
                      color="red"
                      size="md"
                      onClick={async (e) => {
                        setCharacterDeleted(true);
                        await handleDeleteCharacter(val.id);
                        setCharacterDeleted(false);
                      }}
                    >
                      Delete
                    </Button>
                  </Table.Td>
                </Table.Tr>
              </>
            );
          })}
        </Table.Tbody>
      </Table>
    </>
  );
};

export default makePage('Character Control', ['admin'], CharacterControl);
