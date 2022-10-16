import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { styled } from '@mui/material/styles';

import useSWR from 'swr';

import { PropertyLabel } from '../components/PropertyLabel';
import { get } from 'lodash';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  cursor: 'pointer',
  minHeight: 36,
  minWidth: 88,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const descKeys: Array<
  [string, string | ((country: Country) => string | string[])]
> = [
  [
    'Native Name',
    (country) => Object.values(country.name.nativeName)?.[0]?.official,
  ],
  ['Population', 'population'],
  ['Region', 'region'],
  ['Sub Region', 'subregion'],
  ['Capital', (country) => country.capital],
  ['Top Level Domain', (country) => country.tld],
  [
    'Currencies',
    (country) =>
      Object.values(country.currencies || {})?.[0]?.name ?? 'not exist',
  ],
  ['Languages', (country) => Object.values(country.languages)],
];

function Detail() {
  const {
    query: { name },
    ...rest
  } = useRouter();

  const theme = useTheme();
  const notPhone = useMediaQuery(theme.breakpoints.up('sm'));
  const hadFetchedBorder = useRef(false);

  const [countriesOfBorders, setBorders] = useState<
    { name: string; flag: string }[]
  >([]);

  const { data: country } = useSWR(`/api/${name}`, {
    async fetcher() {
      if (!name) {
        return null;
      }

      const country = (
        await fetch(`https://restcountries.com/v3.1/name/${name}`).then((r) =>
          r.json(),
        )
      )[0];

      return country;
    },
    refreshWhenHidden: false,
    async onSuccess(country) {
      const { borders = [] } = country || {};
      if (!borders.length) {
        hadFetchedBorder.current = true;
        return;
      }
      const searchCodeEntry = `https://restcountries.com/v3.1/alpha?codes=${borders.join(
        ',',
      )}`;

      const countriesOfBorders = await fetch(searchCodeEntry)
        .then((r) => r.json())
        .then((countriesOfBorders) => {
          return countriesOfBorders.map((country: Country) => ({
            name: country.name.common,
            flag: country.flag,
          }));
        })
        .finally(() => {
          hadFetchedBorder.current = true;
        });
      setBorders(countriesOfBorders);
    },
  });

  useEffect(() => {
    setBorders([]);
    hadFetchedBorder.current = false;
  }, [name]);
  console.log('borders: ', countriesOfBorders);

  return (
    <>
      <Stack spacing={notPhone ? 20 : 4}>
        <Button
          style={{ alignSelf: 'flex-start' }}
          onClick={() => rest.back()}
          variant="outlined"
          startIcon={<ChevronLeftIcon />}
        >
          Back
        </Button>
        <Grid container columns={{ xs: 4, sm: 12 }}>
          <Grid item xs={4} sm={5}>
            {country ? (
              <Image
                objectFit="contain"
                width={640}
                height={480}
                layout="responsive"
                style={{ border: '1px solid #ccc' }}
                src={country?.flags?.svg ?? ''}
                alt={`flags of ${name}`}
              />
            ) : (
              <Skeleton width="100%" height={320} variant="rectangular" />
            )}
          </Grid>
          <Grid item xs={0} sm={1} zeroMinWidth />
          <Grid item xs={4} sm={6}>
            <Stack spacing={2} style={{ height: '100%' }}>
              <Typography variant="h4" fontWeight={600}>
                {name}
              </Typography>
              <Grid container columns={{ xs: 6, sm: 12 }}>
                {descKeys.map(([title, renderCaption], index) => (
                  <Grid
                    style={{
                      background:
                        !notPhone && index % 2 === 1
                          ? theme.palette.divider
                          : undefined,
                    }}
                    item
                    xs={6}
                    key={title}
                  >
                    <PropertyLabel
                      notPhone={notPhone}
                      caption={
                        country
                          ? typeof renderCaption === 'function'
                            ? renderCaption(country)
                            : get(country, renderCaption)
                          : '--'
                      }
                      title={title}
                    />
                  </Grid>
                ))}
              </Grid>
              <Stack
                rowGap={1}
                direction="row"
                columnGap={2}
                alignItems="center"
                style={{ flexGrow: 1 }}
              >
                <Typography
                  variant={notPhone ? 'body2' : 'subtitle2'}
                  color="text.secondary"
                >
                  Border Countries
                </Typography>
                <Grid container spacing={1}>
                  {!hadFetchedBorder.current
                    ? 'Fetching…'
                    : countriesOfBorders.length > 0
                    ? countriesOfBorders.map((country) => (
                        <Grid xs={6} sm={4} item key={country.name}>
                          <Link href={`/detail/${country.name}`}>
                            <Item>
                              {country.flag} {country.name}
                            </Item>
                          </Link>
                        </Grid>
                      ))
                    : 'empty'}
                </Grid>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </>
  );
}

export default Detail;
