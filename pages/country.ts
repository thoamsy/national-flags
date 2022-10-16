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
  languages: Record<string, string>;
  borders: string[];
  area: number;
  flags: Record<string, string>;
  flag: string;
};
