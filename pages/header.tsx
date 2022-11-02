'use client';

import { useMemo } from 'react';
import { TextField, Autocomplete, Grid, Skeleton } from '@mui/material';
// import { useRouter, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { styled, lighten, darken } from '@mui/system';
import { groupBy } from 'lodash';

import type { Country } from './api/allCountry';

const sentinelRegion = { id: '-', label: 'Global' };

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

export type Option = { region: string; name: string };
export type Region = { id: string; label: string };

const Header = ({
  isLoading,
  countries,
  search,
  setSearch,
  countriesSortByRegion,
  currentRegion,
  setCurrentRegion,
}: {
  isLoading: boolean;
  countries: Country[];
  search: Option[];
  setSearch: React.Dispatch<React.SetStateAction<Option[]>>;
  countriesSortByRegion: Option[];
  currentRegion: Region;
  setCurrentRegion: React.Dispatch<React.SetStateAction<Region>>;
}) => {
  const { replace } = useRouter();

  const regions = useMemo(() => {
    return [sentinelRegion].concat(
      Object.keys(groupBy(countries, 'region')).map((region) => ({
        label: region,
        id: region,
      })),
    );
  }, [countries]);

  return (
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
            isOptionEqualToValue={(option, value) => option.name === value.name}
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
              newUrl.searchParams.set('region', (newValue?.id as string) ?? '');
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
  );
};

export default Header;
