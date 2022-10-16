import Link from 'next/link';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { PropertyLabel } from './PropertyLabel';
import type { Country } from '../api/allCountry';

const CountryCard = ({
  region,
  capital,
  flags,
  name,
  population,
  isPhone,
}: Country & { isPhone?: boolean }) => {
  const commonName = name.common;
  return (
    <Card
      style={{
        cursor: 'pointer',
      }}
      onClick={() => {
        console.log(window.scrollY);
        return localStorage.setItem('scrollposition', '' + window.scrollY);
      }}
    >
      <CardMedia
        component="img"
        height="180"
        image={flags.png}
        loading="lazy"
        alt={`${commonName}'s flag`}
      />
      <CardContent style={{ height: 150 }}>
        <Typography
          style={{
            overflow: 'hidden',
            width: '100%',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          gutterBottom
          fontWeight={700}
          variant={commonName.length <= 20 ? (isPhone ? 'h5' : 'h6') : 'body2'}
        >
          {commonName}
        </Typography>
        <PropertyLabel notPhone={false} title="Region" caption={region} />
        <PropertyLabel notPhone={false} title="Capital" caption={capital} />
        <PropertyLabel
          notPhone={false}
          title="Population"
          caption={population}
        />
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
  const theme = useTheme();
  const notPhone = useMediaQuery(theme.breakpoints.up('sm'));

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
            <Grid key={country.name.common} item xs={3}>
              <CountryCard isPhone={!notPhone} {...country} />
            </Grid>
          </Link>
        ),
      )}
    </Grid>
  );
};

export default CountryGrid;
