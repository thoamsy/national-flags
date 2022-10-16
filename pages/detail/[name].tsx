import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import type { NextApiRequest, NextApiResponse } from 'next';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import { PropertyLabel } from '../components/PropertyLabel';
import { get } from 'lodash';
import { styled } from '@mui/material/styles';

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
    (country) => Object.values(country.name.nativeName)[0].official,
  ],
  ['Population', 'population'],
  ['Region', 'region'],
  ['Sub Region', 'subregion'],
  ['Capital', (country) => country.capital],
  ['Top Level Domain', (country) => country.tld],
  ['Currencies', (country) => Object.values(country.currencies)[0].name],
  ['Languages', (country) => Object.values(country.languages)],
];

function Detail({
  country,
  countriesOfBorders = [],
}: {
  country: Country;
  countriesOfBorders: { name: string; flag: string }[];
}) {
  const {
    query: { name },
    ...rest
  } = useRouter();

  const theme = useTheme();
  const notPhone = useMediaQuery(theme.breakpoints.up('sm'));

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
          <Grid item sm={5}>
            <Image
              width={960}
              height={720}
              src={country.flags.svg}
              alt={`flags of ${name}`}
            />
          </Grid>
          <Grid item sm={1} zeroMinWidth />
          <Grid item sm={6}>
            <Stack justifyContent="space-around" style={{ height: '100%' }}>
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
                        typeof renderCaption === 'function'
                          ? renderCaption(country)
                          : get(country, renderCaption)
                      }
                      title={title}
                    />
                  </Grid>
                ))}
              </Grid>
              <Stack direction="row" columnGap={2} alignItems="center">
                <Typography
                  variant={notPhone ? 'body2' : 'subtitle2'}
                  color="text.secondary"
                >
                  Border Countries
                </Typography>
                <Stack spacing={1} direction="row">
                  {countriesOfBorders.map((country) => (
                    <Link key={country.name} href={`/detail/${country.name}`}>
                      <Item>
                        {country.flag} {country.name}
                      </Item>
                    </Link>
                  ))}
                </Stack>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </>
  );
}

export default Detail;

export async function getServerSideProps({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) {
  const oneDay = 3600 * 24;
  res.setHeader('Cache-Control', `public, s-maxage=${oneDay}`);

  const country = (
    await fetch(
      `https://restcountries.com/v3.1/name/${req.url?.split('/')[2]}`,
    ).then((r) => r.json())
  )[0];

  const { borders = [] } = country;
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
    });

  return {
    props: {
      country,
      countriesOfBorders,
    },
  };
}
