import type { NextApiRequest, NextApiResponse } from 'next';

const EntryPoint = {
  all: 'https://restcountries.com/v3.1/all',
  name: 'https://restcountries.com/v3.1/name',
};

type NativeName = {
  official: string;
  common: string;
};

export type Country = {
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

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<Country[]>,
) {
  const countries = await fetch(EntryPoint.all).then((res) => res.json());
  console.log(countries);
  res.status(200).json(countries);
}
