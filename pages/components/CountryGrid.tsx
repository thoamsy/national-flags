import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextList from './TextList';

type NativeName = {
  official: string;
  common: string;
};

type Country = {
  name: NativeName & {
    nativeName: Record<string, NativeName>;
  };
  tld: string[];
  independent: boolean;
  // 欧盟
  unMember: true;
  currencies: Record<string, { name: string; symbol: string }>;
  capital: string[];
  region: string;
  langauges: Record<string, string>;
  borders: string[];
  area: number;
  flags: Record<string, string>;
};

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const numberFormat = new Intl.NumberFormat('en-US');
const listFormat = new Intl.ListFormat('en', {
  style: 'long',
  type: 'conjunction',
});

const Label = ({
  title,
  caption,
}: {
  title: string;
  caption: string | number | string[];
}) => {
  let desc = caption;
  if (typeof desc === 'number') {
    desc = numberFormat.format(desc);
  } else if (Array.isArray(desc)) {
    desc = listFormat.format(desc);
  }
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
      <Typography variant="body2" color="text.primary">
        {title}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {desc}
      </Typography>
    </div>
  );
};
const CountryCard = ({ region, capital, flags, name }: Country) => {
  const commonName = name.common;
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        height="180"
        image={flags.png}
        alt={`${commonName}'s flag`}
      />
      <CardContent style={{ height: 150 }}>
        <Typography gutterBottom variant="h6">
          {commonName}
        </Typography>
        <Label title="Population" caption={100000} />
        <Label title="Region" caption={region} />
        <Label title="Capital" caption={capital} />
      </CardContent>
    </Card>
  );
};

const CountryGrid = ({ countries }: { countries: Country[] }) => {
  return (
    <Grid
      container
      spacing={{ xs: 2, md: 4 }}
      columns={{ xs: 3, sm: 6, md: 12 }}
    >
      {countries.map((country) => (
        <Grid key={country.name.common} item xs={3}>
          {<CountryCard {...country} />}
        </Grid>
      ))}
    </Grid>
  );
};

export default CountryGrid;
