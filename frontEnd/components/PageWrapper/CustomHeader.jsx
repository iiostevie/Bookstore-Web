import { Title, Grid, Button, Container } from '@mantine/core';
import { useAuth } from '../../providers/AuthProvider';
import { useRouter } from 'next/router';
import { logOutApi } from '../../features/auth/api';
import Link from 'next/link';

const User = () => {
  const router = useRouter();
  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    await logOutApi();
    setUser(null);
    router.push('/');
  };

  if (user && user.userType === 'user') {
    //TODO: add more page to user
    return (
      <Container size="xl" style={{ textAlign: 'center' }}>
        <Button
          component={Link}
          style={{ margin: '5px', width: '170px' }}
          href="/cartoonpia"
        >
          Home
        </Button>

        {/* Button for Profile */}
        <Button
          component={Link}
          style={{ margin: '5px', width: '170px' }}
          href="/profile"
        >
          My Profile
        </Button>

        <Button
          style={{ margin: '5px', width: '170px' }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Container>
    );
  } else if (user && user.userType === 'admin') {
    return (
      <Container size="xl" style={{ textAlign: 'center' }}>
        <Button
          component={Link}
          style={{ margin: '5px', width: '182px' }}
          href="/cartoonpia"
        >
          Cartoonpia
        </Button>
        <Button
          component={Link}
          style={{ margin: '5px', width: '182px' }}
          href="/profile"
        >
          My Profile
        </Button>

        <Button
          component={Link}
          style={{ margin: '5px', width: '182px' }}
          href="/ApproveCharacter"
        >
          Character Edit Request
        </Button>
        <Button
          component={Link}
          style={{ margin: '5px', width: '182px' }}
          href="/CharacterHistory"
        >
          Character History
        </Button>
        <Button
          component={Link}
          style={{ margin: '5px', width: '182px' }}
          href="/CharacterControl"
        >
          Character Control
        </Button>
        <Button
          component={Link}
          style={{ margin: '5px', width: '182px' }}
          href="/UserControl"
        >
          User Control
        </Button>
        <Button
          style={{ margin: '5px', width: '182px' }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Container>
    );
  }
};

const CustomHeader = ({ title }) => {
  return (
    <>
      <Grid>
        <Grid.Col>
          <Title style={{ textAlign: 'center' }}>{title}</Title>
        </Grid.Col>
        <Grid.Col>
          <User />
        </Grid.Col>
      </Grid>
    </>
  );
};

export default CustomHeader;
