import type { Country } from './allCountry';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Country[]>,
) {
  const country = await fetch(
    `https://restcountries.com/v3.1/name/${req.query.name}`,
  ).then((res) => res.json());
  console.log(country);
  res.status(200).json(country);
}
