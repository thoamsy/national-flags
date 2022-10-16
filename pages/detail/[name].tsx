import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import type { NextApiRequest, NextApiResponse } from 'next';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { PropertyLabel } from '../components/PropertyLabel';
import { get } from 'lodash';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  cursor: 'pointer',
  height: 36,
  width: 88,
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
  console.log(rest);
  return (
    <Stack spacing={4}>
      <Button
        style={{ alignSelf: 'flex-start' }}
        color="inherit"
        onClick={() => rest.back()}
        variant="contained"
      >
        ⬅️ Back
      </Button>
      <Grid container columns={{ xs: 4, sm: 12 }}>
        <Grid item sm={5}>
          <Image
            width={960}
            height={720}
            src={country.flags.svg}
            alt={`flags of ${country.name.common}`}
          />
        </Grid>
        <Grid item sm={1} zeroMinWidth />
        <Grid item sm={6}>
          <Stack>
            <Typography variant="h4" fontWeight={600}>
              {country.name.common}
            </Typography>
            <Stack>
              {descKeys.map(([title, renderCaption]) => (
                <PropertyLabel
                  key={title}
                  caption={
                    typeof renderCaption === 'function'
                      ? renderCaption(country)
                      : get(country, renderCaption)
                  }
                  title={title}
                />
              ))}
            </Stack>
            <Stack direction="row" columnGap={2} alignItems="center">
              <Typography variant="body2" color="text.primary">
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
