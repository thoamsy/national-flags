import { useState, useMemo, useEffect } from 'react';

import useSWR from 'swr';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';

import CountryGrid from './components/CountryGrid';

import { styled, lighten, darken } from '@mui/system';

import { groupBy } from 'lodash';
import { Country } from './api/allCountry';
import { useRouter } from 'next/router';

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

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const CountryPlaceholder = Array.from({ length: 20 }, () => null);
const isCountry = (country: Country[] | null[]): country is Country[] =>
  country[0] !== null;

const sentinelRegion = { id: '-', label: 'Global' };

const Home = () => {
  const { query, replace } = useRouter();

  const { data: countries = CountryPlaceholder, error } = useSWR<Country[]>(
    '/api/allCountry',
    {
      fetcher,
      refreshInterval: 0,
    },
  );

  const isLoading = countries === CountryPlaceholder;

  const [search, setSearch] = useState(() => {
    if (typeof query.s !== 'string') {
      return [];
    }
    return query.s
      .split(',')
      .filter(Boolean)
      .map((keyword) => ({ name: keyword, region: '' }));
  });

  const regions = useMemo(() => {
    return [sentinelRegion].concat(
      Object.keys(groupBy(countries, 'region')).map((region) => ({
        label: region,
        id: region,
      })),
    );
  }, [countries]);

  const [currentRegion, setCurrentRegion] = useState(() => {
    const region = query.region;
    if (region) {
      return { id: region, label: region };
    }
    return sentinelRegion;
  });

  const countriesFilteredByRegion = useMemo(() => {
    return isCountry(countries)
      ? countries.filter((country) =>
          currentRegion.id === '-' ? true : country.region === currentRegion.id,
        )
      : [];
  }, [countries, currentRegion]);

  const countriesSortByRegion = useMemo(
    () =>
      countriesFilteredByRegion
        .sort((a, b) => a.region.localeCompare(b.region))
        .map((country) => ({
          region: country.region,
          name: country.name.common,
        })),
    [countriesFilteredByRegion],
  );

  const filteredCountries = useMemo(() => {
    // naive search
    if (!search.length) {
      return countriesFilteredByRegion;
    }
    return countriesFilteredByRegion.filter((country) =>
      search.map((item) => item.name).includes(country.name.common),
    );
  }, [countriesFilteredByRegion, search]);

  useEffect(() => {
    console.log(isLoading);
    if (isLoading) {
      return;
    }
    const y = Number(localStorage.getItem('scrollposition'));
    if (y) {
      window.scrollTo(0, y);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
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
                option.name === value.name
              }
              groupBy={(country) => country.region}
              getOptionLabel={(country) => country.name}
              renderInput={(params) => (
                <TextField {...params} label="With Country name" />
              )}
              multiple
              value={search}
              onChange={(_event, value) => {
                setSearch(value);

                const newUrl = new URL(location.href);

                const s = value.map((item) => item.name).join(',');

                if (s) {
                  newUrl.searchParams.set('s', s);
                } else {
                  newUrl.searchParams.delete('s');
                }
                replace(newUrl.toString());
              }}
              autoHighlight
              renderGroup={(params) => (
                <li key={params.key}>
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
                setCurrentRegion(newValue ?? sentinelRegion);

                const newUrl = new URL(location.href);
                newUrl.searchParams.set(
                  'region',
                  (newValue?.id as string) ?? '',
                );
                replace(newUrl.toString());
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
      <CountryGrid
        countries={isLoading ? CountryPlaceholder : filteredCountries}
      />
    </div>
  );
};

export default Home;
