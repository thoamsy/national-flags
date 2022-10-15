import { useState, useMemo, useEffect } from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import useSWR from 'swr';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import CountryGrid from './components/CountryGrid';

import { styled, lighten, darken } from '@mui/system';

import { groupBy } from 'lodash';
import { Country } from './api/allCountry';
import { Skeleton } from '@mui/material';

const GroupHeader = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: '-8px',
  padding: '4px 10px',
  color: theme.palette.primary.main,
  backgroundColor:
    theme.palette.mode === 'light'
      ? lighten(theme.palette.primary.light, 0.85)
      : darken(theme.palette.primary.main, 0.8),
}));

const GroupItems = styled('ul')({
  padding: 0,
});

const theme = createTheme();
const fetcher = (url: string) => fetch(url).then((r) => r.json());

const CountryPlaceholder = Array.from({ length: 20 }, () => null);
const isCountry = (country: Country[] | null[]): country is Country[] =>
  country[0] !== null;

const sentinelRegion = { id: '-', label: 'Global' };

const Home = () => {
  const { data: countries = CountryPlaceholder, error } = useSWR<Country[]>(
    '/api/allCountry',
    {
      fetcher,
      refreshInterval: 0,
    },
  );

  const isLoading = countries === CountryPlaceholder;

  const [search, setSearch] = useState('');

  const regions = useMemo(() => {
    return [sentinelRegion].concat(
      Object.keys(groupBy(countries, 'region')).map((region) => ({
        label: region,
        id: region,
      })),
    );
  }, [countries]);
  const [currentRegion, setCurrentRegion] = useState(regions[0]);

  const countriesFilteredByRegion = useMemo(() => {
    return isCountry(countries)
      ? countries.filter((country) =>
          currentRegion.id === '-' ? true : country.region === currentRegion.id,
        )
      : [];
  }, [countries, currentRegion]);

  const countriesSortByRegion = useMemo(
    () =>
      countriesFilteredByRegion.sort((a, b) =>
        a.region.localeCompare(b.region),
      ),
    [countriesFilteredByRegion],
  );

  const filteredCountries = useMemo(() => {
    return countriesFilteredByRegion.filter((country) =>
      country.name.common.toLowerCase().includes(search),
    );
  }, [countriesFilteredByRegion, search]);

  return (
    <ThemeProvider theme={theme}>
      <Container style={{ padding: 20 }} maxWidth="lg">
        <Grid
          justifyContent="space-between"
          container
          columns={{ xs: 3, sm: 10, md: 12 }}
          rowGap={2}
          sx={{ marginBottom: 8 }}
        >
          <Grid item xs={3} sm={4}>
            {isLoading ? (
              <Skeleton variant="rounded" height={56} />
            ) : (
              <Autocomplete
                options={countriesSortByRegion}
                isOptionEqualToValue={(option, value) =>
                  option.name.common === value.name.common
                }
                groupBy={(country) => country.region}
                getOptionLabel={(country) => country.name.common}
                renderInput={(params) => (
                  <TextField {...params} label="With Country name" />
                )}
                onChange={(_event, value) => {
                  if (value) {
                    setSearch(value.name.common.toLowerCase());
                  } else {
                    setSearch('');
                  }
                }}
                renderGroup={(params) => (
                  <li>
                    <GroupHeader>{params.group}</GroupHeader>
                    <GroupItems>{params.children}</GroupItems>
                  </li>
                )}
              />
            )}
          </Grid>
          <Grid item xs={3} sm={4}>
            {isLoading ? (
              <Skeleton variant="rounded" height={56} />
            ) : (
              <Autocomplete
                value={currentRegion}
                onChange={(_event, newValue) => {
                  if (newValue?.id) {
                    setCurrentRegion(newValue);
                  } else {
                    setCurrentRegion(sentinelRegion);
                  }
                }}
                disablePortal
                isOptionEqualToValue={(value, option) => value.id === option.id}
                options={regions}
                renderInput={(params) => (
                  <TextField {...params} label="Filter by Region" />
                )}
              />
            )}
          </Grid>
        </Grid>
        <CountryGrid countries={filteredCountries} />
      </Container>
    </ThemeProvider>
  );
};

export default Home;
