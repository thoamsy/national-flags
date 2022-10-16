import Typography from '@mui/material/Typography';

const numberFormat = new Intl.NumberFormat('en-US');
const listFormat = new Intl.ListFormat('en', {
  style: 'long',
  type: 'conjunction',
});

export const PropertyLabel = ({
  title,
  caption,
}: {
  title: string;
  caption: string | number | string[];
}) => {
  let desc = caption;
  if (typeof desc === 'number') {
    desc = numberFormat.format(desc);
  } else if (Array.isArray(desc)) {
    desc = listFormat.format(desc);
  }
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
      <Typography variant="body2" color="text.primary">
        {title}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {desc}
      </Typography>
    </div>
  );
};
