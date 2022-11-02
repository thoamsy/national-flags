import Link from 'next/link';
import {
  Grid,
  Card,
  Skeleton,
  Box,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import PropertyLabel from './PropertyLabel';
import type { Country } from '../pages/api/allCountry';

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
          <Grid key={country.name.common} item xs={3}>
            <Link href={`/detail/${country.name.common}`}>
              <CountryCard isPhone={!notPhone} {...country} />
            </Link>
          </Grid>
        ),
      )}
    </Grid>
  );
};

export default CountryGrid;
