import { Box, Flex } from '@mantine/core';
import CustomHeader from './CustomHeader';
const PageWrapper = ({ children, title }) => {
  return (
    <Flex sx={{ minHeight: '100vh' }}>
      <Flex direction="column" w="100%" sx={{ overflowX: 'hidden' }}>
        <CustomHeader title={title} />
        <Box sx={{ flex: 1 }} p="sm">
          {children}
        </Box>
      </Flex>
    </Flex>
  );
};

export default PageWrapper;
