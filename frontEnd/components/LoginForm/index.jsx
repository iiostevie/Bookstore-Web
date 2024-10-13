import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from '@mantine/form';
import { StatusMessage } from '../../components/StatusMessage';
import { loginApi } from '../../features/auth/api';
import { errorToString } from '../../features/util';
import { Anchor, Button, TextInput, Container, Grid } from '@mantine/core';
import { useAuth } from '../../providers/AuthProvider';

const LoginForm = () => {
  const { setUser } = useAuth();
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
  });

  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState({});
  const onSubmit = async (event) => {
    event.preventDefault(); //stop auto refresh so we can see error message
    if (submitting) return;

    const { email, password } = form.getValues();
    setSubmitting(true);
    setStatusMessage({});

    try {
      localStorage.setItem('email', email);
      const data = await loginApi(email, password);
      setUser({
        id: data._id,
        email: data.email,
        userType: data.userType,
        name: `${data.firstname} ${data.lastname}`,
      });

      let pathAfterLogin = '/cartoonpia';

      const redirectPath = router.query.redirect;
      if (redirectPath) {
        pathAfterLogin = decodeURIComponent(redirectPath);
      }

      router.push(pathAfterLogin);
    } catch (err) {
      setStatusMessage({ message: errorToString(err) });
    }
    setSubmitting(false);
  };

  return (
    <Container size="xs">
      <form onSubmit={onSubmit} noValidate>
        <Grid>
          <Grid.Col>
            <TextInput
              label="Email address"
              size="md"
              onChange={(e) =>
                form.setFieldValue('email', e.currentTarget.value)
              }
              required
            />
          </Grid.Col>
          <Grid.Col>
            <TextInput
              type="password"
              label="Password"
              size="md"
              onChange={(e) =>
                form.setFieldValue('password', e.currentTarget.value)
              }
              required
            />
          </Grid.Col>
          <StatusMessage {...statusMessage} />
          <Grid.Col>
            <Button fullWidth type="submit" loading={submitting}>
              Login
            </Button>
          </Grid.Col>
          <Grid.Col style={{ textAlign: 'center' }}>
            <Anchor href="/SignUp">Sign Up</Anchor>
          </Grid.Col>
        </Grid>
      </form>
    </Container>
  );
};

export default LoginForm;
