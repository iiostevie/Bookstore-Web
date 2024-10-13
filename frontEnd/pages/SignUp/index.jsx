import { useState } from 'react';
import { useForm } from '@mantine/form';
import { StatusMessage } from '../../components/StatusMessage';
import { signUpApi } from '../../features/auth/api';
import { errorToString } from '../../features/util';
import {
  Anchor,
  Button,
  TextInput,
  Container,
  Grid,
  Text,
  Box,
} from '@mantine/core';
import { ModalsProvider, modals } from '@mantine/modals';
import makePage from '../../components/makePage';

const SignUpForm = () => {
  const form = useForm({
    initialValues: { firstname: '', lastname: '', email: '', password: '' },
  });
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState({});

  const onSubmit = async (event) => {
    event.preventDefault(); //stop auto refresh so we can see error message
    if (submitting) return;
    const { firstname, lastname, email, password } = form.getValues();
    setSubmitting(true);
    setStatusMessage({});

    try {
      await signUpApi(firstname, lastname, email, password);
      setStatusMessage('success');
      openModal('success');
    } catch (err) {
      setStatusMessage({ message: errorToString(err) });
      openModal('failed');
    } finally {
      setSubmitting(false);
    }
  };

  const openModal = (statusMessage) => {
    const isSuccess = statusMessage === 'success';
    modals.open({
      title: 'Welcome to cartoonpia.',
      centered: true,
      children: (
        <div>
          {isSuccess ? (
            <>
              <Text>
                Registration successful! Redirecting to
                <Anchor href="/"> login page</Anchor>.
              </Text>
            </>
          ) : (
            <p>Registration failed. Please try again.</p>
          )}
        </div>
      ),
    });
  };

  return (
    <ModalsProvider>
      <Container size="xs">
        <form onSubmit={onSubmit}>
          <Grid>
            <Grid.Col>
              <TextInput
                type="text"
                label="First Name"
                onChange={(e) =>
                  form.setFieldValue('firstname', e.currentTarget.value)
                }
                required
              />
            </Grid.Col>
            <Grid.Col>
              <TextInput
                type="text"
                label="Last Name"
                onChange={(e) =>
                  form.setFieldValue('lastname', e.currentTarget.value)
                }
                required
              />
            </Grid.Col>
            <Grid.Col>
              <TextInput
                type="text"
                label="Email address"
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
                onChange={(e) =>
                  form.setFieldValue('password', e.currentTarget.value)
                }
                required
              />
            </Grid.Col>
            <StatusMessage {...statusMessage} />
            <Grid.Col>
              <Button fullWidth type="submit" loading={submitting}>
                Sign Up
              </Button>
            </Grid.Col>
            <Grid.Col style={{ textAlign: 'center' }}>
              <Anchor href="/">Back to Login</Anchor>
            </Grid.Col>
          </Grid>
        </form>
      </Container>
    </ModalsProvider>
  );
};
export default makePage('Sign Up', [], SignUpForm);
