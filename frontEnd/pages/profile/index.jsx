import { useEffect, useState } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import makePage from '../../components/makePage';
import { getUserFavourites } from '../../features/favourites/api';
import {
  getUserContributions,
  revokeContribution,
} from '../../features/contribution/api';
import { Anchor, Container, Table, Button } from '@mantine/core';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [favourites, setFavourites] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [comparisonHistory, setComparisonHistory] = useState([]);
  const [doneFetchingFavourites, setDoneFetchingFavourites] = useState(null);
  const [doneFetchingContributions, setDoneFetchingContributions] =
    useState(null);
  const [contributionRevoked, setContributionRevoked] = useState(false);
  useEffect(() => {
    if (user) {
      setProfile(user);
    }
  }, [user]);

  useEffect(() => {
    const fetchFavourites = async () => {
      setDoneFetchingFavourites(false);
      try {
        const response = await getUserFavourites();
        setFavourites(response);
      } catch (error) {
        console.error('Error fetching user favourites: ', error);
      } finally {
        setDoneFetchingFavourites(true);
      }
    };
    fetchFavourites();
  }, []);

  // Get the user's contributions
  useEffect(() => {
    const fetchContributions = async () => {
      setDoneFetchingContributions(false);
      try {
        await getUserContributions().then((data) => setContributions(data));
      } catch (error) {
        console.error('Error fetching user favourites: ', error);
      } finally {
        setDoneFetchingContributions(true);
      }
    };
    fetchContributions();
  }, [contributionRevoked]);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('comparisonHistory'));
    if (storedHistory) {
      setComparisonHistory(storedHistory);
    }
  }, []);

  const formatDate = (dateData) => {
    const date = new Date(dateData);
    return date.toLocaleDateString('en-US', { timeZone: 'Australia/Sydney' });
  };

  if (!(doneFetchingFavourites && doneFetchingContributions)) {
    return <div>Loading...</div>;
  }
  return (
    <Container>
      <h2>Your Profile</h2>
      {profile && (
        <>
          <p>Name: {profile.name}</p>
          <p>Email: {profile.email}</p>
          <p>User Type: {profile.userType}</p>
        </>
      )}
      <h2>Favourite Characters</h2>
      {favourites.length > 0 ? (
        favourites.map((favourite) => (
          <li>
            <Anchor href={`/cartoonpia/characters/${favourite._id}`}>
              {favourite.name}
            </Anchor>
          </li>
        ))
      ) : (
        <p>No favourite characters to display</p>
      )}
      <h2>Recent Comparisons</h2>
      {comparisonHistory.length > 0 ? (
        <ul>
          {comparisonHistory.map((comparison, index) => (
            <li key={index}>
              {comparison[0].name} vs {comparison[1].name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No recent comparisons</p>
      )}
      <h2>Contributions</h2>
      {/* TODO: list of contributions */}
      {contributions.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <th>Action</th>
              <th>Change</th>
              <th>Status</th>
              <th>Date</th>
              <th>Edit Contribution</th>
            </tr>
          </thead>
          <tbody>
            {contributions.map((contribution, index) => (
              <tr key={index}>
                <td>{contribution.action}</td>
                <td>
                  {contribution.data
                    ? contribution.data.map((val) => <ul>{val}</ul>)
                    : ''}
                </td>
                <td>
                  {contribution.status === 'Approved'
                    ? `Approved`
                    : contribution.status}
                </td>
                <td>{formatDate(contribution.date)}</td>
                <td>
                  <Table.Td>
                    <Button
                      variant="filled"
                      color="red"
                      size="md"
                      onClick={async (e) => {
                        setContributionRevoked(true);
                        await revokeContribution(contribution.id);
                        setContributionRevoked(false);
                      }}
                      disabled={contribution.status !== 'Pending'}
                    >
                      Revoke
                    </Button>
                  </Table.Td>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No contributions to display</p>
      )}
    </Container>
  );
};

export default makePage('Profile', ['user', 'admin'], ProfilePage);
