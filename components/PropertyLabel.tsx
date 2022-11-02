import { Typography, Stack } from '@mui/material';

const numberFormat = new Intl.NumberFormat('en-US');
const listFormat = new Intl.ListFormat('en', {
  style: 'long',
  type: 'conjunction',
});

const PropertyLabel = ({
  title,
  caption,
  notPhone = true,
}: {
  title: string;
  caption: string | number | string[];
  notPhone?: boolean;
}) => {
  let desc = caption;
  if (typeof desc === 'number') {
    desc = numberFormat.format(desc);
  } else if (Array.isArray(desc)) {
    desc = listFormat.format(desc);
  }

  return (
    <Stack
      direction="row"
      columnGap={2}
      rowGap={1}
      alignItems="baseline"
      justifyContent={notPhone ? 'flex-start' : 'space-between'}
    >
      <Typography
        variant={notPhone ? 'body2' : 'subtitle2'}
        color="text.secondary"
        style={{ flexShrink: 0 }}
      >
        {title}
      </Typography>
      <Typography
        variant={notPhone ? 'body1' : 'subtitle1'}
        color="text.primary"
      >
        {desc}
      </Typography>
    </Stack>
  );
};

export default PropertyLabel;
