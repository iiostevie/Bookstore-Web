import { useEffect, useState } from 'react';
import { pendingCharacterInfo } from '../../features/admin/api';
import makePage from '../../components/makePage';
import { Table, Grid, Button, Container } from '@mantine/core';
import { handleCharacterRequest } from '../../features/admin/api';

const ApproveCharacterChange = () => {
  const [characterData, setCharacterData] = useState(null);
  const [statusChange, setStatusChange] = useState(false);
  useEffect(() => {
    pendingCharacterInfo().then((data) => setCharacterData(data));
    setStatusChange(false);
  }, [statusChange]);

  return (
    <>
      <Grid>
        <Grid.Col>
          <Table style={{ textAlign: 'center' }}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ textAlign: 'center' }}>
                  Character Name
                </Table.Th>
                <Table.Th style={{ textAlign: 'center' }}>Action</Table.Th>
                <Table.Th style={{ textAlign: 'center' }}>
                  Review Change
                </Table.Th>
                <Table.Th style={{ textAlign: 'center' }}>Action</Table.Th>
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
                        <Table.Td>
                          <Button
                            variant="filled"
                            color="green"
                            style={{ margin: '5px', width: '150px' }}
                            onClick={(e) => {
                              handleCharacterRequest(val.contributionId, true);
                              setStatusChange(true);
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="filled"
                            color="red"
                            style={{ margin: '5px', width: '150px' }}
                            onClick={(e) => {
                              handleCharacterRequest(val.contributionId, false);
                              setStatusChange(true);
                            }}
                          >
                            Reject
                          </Button>
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

export default makePage(
  'Approve Character Change',
  ['admin'],
  ApproveCharacterChange
);
