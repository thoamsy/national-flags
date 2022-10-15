import Link from 'next/link';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import type { Country } from '../api/allCountry';

const numberFormat = new Intl.NumberFormat('en-US');
const listFormat = new Intl.ListFormat('en', {
  style: 'long',
  type: 'conjunction',
});

const Label = ({
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
const CountryCard = ({ region, capital, flags, name }: Country) => {
  const commonName = name.common;
  return (
    <Card
      style={{
        cursor: 'pointer',
      }}
    >
      <CardMedia
        component="img"
        height="180"
        image={flags.png}
        alt={`${commonName}'s flag`}
      />
      <CardContent style={{ height: 150 }}>
        <Typography gutterBottom variant="h6">
          {commonName}
        </Typography>
        <Label title="Population" caption={100000} />
        <Label title="Region" caption={region} />
        <Label title="Capital" caption={capital} />
      </CardContent>
    </Card>
  );
};

const CountrySkeleton = () => (
  <Box height={330}>
    <Skeleton variant="rectangular" height={180} />
    <Box sx={{ pt: 0.5 }}>
      <Skeleton variant="text" />
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="60%" />
    </Box>
  </Box>
);

const CountryGrid = ({ countries }: { countries: Country[] | null[] }) => {
  return (
    <Grid
      container
      spacing={{ xs: 2, md: 4 }}
      columns={{ xs: 3, sm: 6, md: 12 }}
    >
      {countries.map((country, index) =>
        country == null ? (
          <Grid key={index} item xs={3}>
            <CountrySkeleton key={index} />
          </Grid>
        ) : (
          <Link
            href={`/detail/${country.name.common}`}
            key={country.name.common}
          >
            <Grid key={index} item xs={3}>
              <CountryCard {...country} />
            </Grid>
          </Link>
        ),
      )}
    </Grid>
  );
};

export default CountryGrid;
