import { Typography } from '@mui/material';

const TextList = ({ values }: { values: string[] | string }) => {
  const list = new Intl.ListFormat('en', {
    style: 'long',
    type: 'conjunction',
  }).format(values);

  return (
    <Typography variant="caption" color="text.secondary">
      {list}
    </Typography>
  );
};

export default TextList;
