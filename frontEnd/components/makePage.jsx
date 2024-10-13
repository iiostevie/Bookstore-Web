import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container } from '@mantine/core';
import { useAuth } from '../providers/AuthProvider';
import PageWrapper from './PageWrapper';

const makePage = (title, userTypes, Component) => {
  const NewPage = () => {
    const { user, isReady: authReady } = useAuth();
    const { asPath, push, isReady } = useRouter();

    useEffect(() => {
      if (isReady && authReady && userTypes.length !== 0 && !user) {
        // user needs to login, redirect to login page
        push(`/?redirect=${encodeURIComponent(asPath)}`);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isReady, authReady]);
    if (userTypes.length === 0 || (user && userTypes.includes(user.userType)))
      return (
        <PageWrapper title={title}>
          <Container>
            <Component />
          </Container>
        </PageWrapper>
      );

    return (
      <PageWrapper title="Unauthorized">
        <>You do not have sufficient permissions to access this page.</>
      </PageWrapper>
    );
  };

  return NewPage;
};

export default makePage;
