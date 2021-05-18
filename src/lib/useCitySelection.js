import { graphql, useStaticQuery } from 'gatsby';
import useLocalStorage from './useLocalStorage';

export default function useCitySelection() {
  const [citySelection, setCitySelection] = useLocalStorage('citySelection');
  const { cities } = useStaticQuery(graphql`
    {
      cities: allAirtable(
        filter: { table: { eq: "Cities" }, data: { Published: { eq: true } } }
      ) {
        edges {
          node {
            data {
              Name
              URL
            }
          }
        }
      }
    }
  `);

  const data =
    citySelection &&
    cities.edges.map(edge => edge.node.data).find(data => data.Name === citySelection);

  let city = null;

  if (data) {
    city = {
      name: data.Name,
      slug: data.URL,
    };
  }

  return [city, setCitySelection];
}
