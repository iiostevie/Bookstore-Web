import axios from '../../lib/axios';

export const getUserContributions = async () => {
  try {
    const response = await axios.get('/contributions');
    return response;
  } catch (error) {
    console.error('Failed to fetch user contributions: ', error);
    throw new Error('Failed to fetch user contributions');
  }
};

export const revokeContribution = async (contributionId) => {
  console.log(contributionId);
  await axios.delete(`/contribution/${contributionId}`);
};
