import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';

import useSWR from 'swr';
import { styled, lighten, darken } from '@mui/system';

import CountryGrid from '../components/CountryGrid';

import { Country } from './api/allCountry';
import Header, { Region } from './header';

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
  const { query } = useRouter();

  const { data: countries = CountryPlaceholder, error } = useSWR<Country[]>(
    '/api/allCountry',
    {
      fetcher,
      refreshInterval: 0,
    },
  );

  const isLoading = countries === CountryPlaceholder;

  const [search, setSearch] = useState(() => {
    const s = query.s;
    if (typeof s !== 'string') {
      return [];
    }
    return s
      .split(',')
      .filter(Boolean)
      .map((keyword) => ({ name: keyword, region: '' }));
  });

  const [currentRegion, setCurrentRegion] = useState<Region>(() => {
    const { region } = query;
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
    <>
      <Header
        search={search}
        setSearch={setSearch}
        isLoading={isLoading}
        countries={countries}
        countriesSortByRegion={countriesSortByRegion}
        currentRegion={currentRegion}
        setCurrentRegion={setCurrentRegion}
      />
      <CountryGrid
        countries={isLoading ? CountryPlaceholder : filteredCountries}
      />
    </>
  );
};

export default Home;
