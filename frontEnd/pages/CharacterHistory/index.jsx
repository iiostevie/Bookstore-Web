import { useEffect, useState } from 'react';
import { CharacterHistoryInfo } from '../../features/admin/api';
import makePage from '../../components/makePage';
import { Table, Grid, Container } from '@mantine/core';

const CharacterHistory = () => {
  const [characterData, setCharacterData] = useState(null);
  useEffect(() => {
    CharacterHistoryInfo().then((data) => setCharacterData(data));
  }, []);

  return (
    <>
      <Grid>
        <Grid.Col>
          <Table style={{ textAlign: 'center' }}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ textAlign: 'center' }}>
                  Character Id
                </Table.Th>
                <Table.Th style={{ textAlign: 'center' }}>Action</Table.Th>
                <Table.Th style={{ textAlign: 'center' }}>
                  Change History
                </Table.Th>
                <Table.Th style={{ textAlign: 'center' }}>Contributor</Table.Th>{' '}
                <Table.Th style={{ textAlign: 'center' }}>Update Time</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {characterData &&
                characterData.map((val) => {
                  const change = Object.keys(val.data);
                  return (
                    <>
                      <Table.Tr key={val.contributionId}>
                        <Table.Td>{val.data.id}</Table.Td>
                        <Table.Td>{val.action}</Table.Td>
                        <Table.Td>
                          {change.map((attribute) => {
                            if (attribute === 'id') {
                              return <></>;
                            } else {
                              return val.original ? (
                                <ul>{`${attribute}: ${val.original[attribute]} => ${val.data[attribute]}`}</ul>
                              ) : (
                                <ul>{`${attribute}: ${val.data[attribute]}`}</ul>
                              );
                            }
                          })}
                        </Table.Td>
                        <Table.Td>{val.contributor}</Table.Td>
                        <Table.Td>
                          {new Date(val.contributionDate).toLocaleString(
                            'en-US',
                            { timeZone: 'UTC' }
                          )}
                        </Table.Td>
                      </Table.Tr>
                    </>
                  );
                })}
            </Table.Tbody>
          </Table>
        </Grid.Col>
      </Grid>
    </>
  );
};

export default makePage('Character History', ['admin'], CharacterHistory);
