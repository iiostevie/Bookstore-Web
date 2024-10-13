import { useEffect, useState } from 'react';
import { AllUserInfo } from '../../features/admin/api';
import makePage from '../../components/makePage';
import { Table, Grid, Button, Container } from '@mantine/core';
import { handlePromoteUser, handleDemoteUser } from '../../features/admin/api';
import { useAuth } from '../../providers/AuthProvider';

const UserControl = () => {
  const { user } = useAuth();
  const [userData, setuserData] = useState(null);
  const [statusChange, setStatusChange] = useState(false);
  useEffect(() => {
    AllUserInfo().then((data) => setuserData(data));
    setStatusChange(false);
  }, [statusChange]);

  return (
    <>
      <Grid>
        <Grid.Col>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>User Type</Table.Th>
                <Table.Th>Action</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {userData &&
                userData.map((val) => {
                  if (val.id !== user.id) {
                    return (
                      <>
                        <Table.Tr key={val.id}>
                          <Table.Td>{val.name}</Table.Td>
                          <Table.Td>{val.email}</Table.Td>
                          <Table.Td>{val.userType}</Table.Td>
                          <Table.Td>
                            <Button
                              variant="filled"
                              color="green"
                              size="md"
                              onClick={(e) => {
                                handlePromoteUser(val.id);
                                setStatusChange(true);
                              }}
                              disabled={val.userType === 'admin'}
                            >
                              Promote
                            </Button>
                            <Button
                              variant="filled"
                              color="red"
                              size="md"
                              onClick={(e) => {
                                handleDemoteUser(val.id);
                                setStatusChange(true);
                              }}
                              disabled={
                                val.userType === 'user' || val.id === user.id
                              }
                            >
                              Demote
                            </Button>
                          </Table.Td>
                        </Table.Tr>
                      </>
                    );
                  }
                })}
            </Table.Tbody>
          </Table>
        </Grid.Col>
      </Grid>
    </>
  );
};

export default makePage('Promote/Demote user', ['admin'], UserControl);
