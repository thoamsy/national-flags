import { useState, useMemo } from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import CountryGrid from './components/CountryGrid';

import { styled, lighten, darken } from '@mui/system';

import example from './example.json';
import { groupBy } from 'lodash';

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

const regions = [
  {
    id: '-',
    label: 'Global',
  },
].concat(
  Object.keys(groupBy(example, 'region')).map((region) => ({
    label: region,
    id: region,
  })),
);

const theme = createTheme();

const Home = () => {
  const [currentRegion, setCurrentRegion] = useState(regions[0]);

  const [countries, setCountries] = useState(example as unknown as Country[]);
  const [search, setSearch] = useState('');

  const countriesSortByRegion = useMemo(
    () => countries.sort((a, b) => a.region.localeCompare(b.region)),
    [countries],
  );

  const filteredCountries = useMemo(() => {
    if (search) {
      return countries.filter((country) =>
        country.name.common.toLowerCase().includes(search),
      );
    }
    return countries;
  }, [countries, search]);

  const countriesWithRegion = useMemo(() => {
    if (currentRegion.id === '-') {
      return countries;
    }

    return countries.filter((country) => country.region === currentRegion.id);
  }, [currentRegion, countries]);

  return (
    <ThemeProvider theme={theme}>
      <Container style={{ padding: 20 }} maxWidth="lg">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 2 }}
          justifyContent="space-between"
        >
          <Autocomplete
            options={countriesSortByRegion}
            groupBy={(country) => country.region}
            getOptionLabel={(country) => country.name.common}
            sx={{ width: 300 }}
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
          <Autocomplete
            style={{ marginBottom: 40 }}
            value={currentRegion}
            onChange={(_event, newValue) => {
              console.log(newValue);
              if (newValue?.id) {
                setCurrentRegion(newValue);
              }
            }}
            disablePortal
            id="combo-box-demo"
            options={regions}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Filter by Region" />
            )}
          />
        </Stack>
        <CountryGrid countries={countriesWithRegion.slice(20)} />
      </Container>
    </ThemeProvider>
  );
};

export default Home;
