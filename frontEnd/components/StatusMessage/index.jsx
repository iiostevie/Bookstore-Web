export const StatusMessage = ({ success = false, message, ...rest }) => (
  <>
    {message && (
      <text {...rest} color={success ? 'green.8' : 'red.8'}>
        {message}
      </text>
    )}
  </>
);
