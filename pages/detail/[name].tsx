import { useRouter } from 'next/router';
import useSWR from 'swr';

function Detail() {
  const { name } = useRouter().query;
  const { data } = useSWR(`/api/country?name=${name}`, {
    fetcher: (url) => fetch(url).then((r) => r.json()),
  });
  console.log(data);
  return <h1>detail</h1>;
}

export default Detail;
