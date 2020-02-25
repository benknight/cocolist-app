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
              Slug
            }
          }
        }
      }
    }
  `);

  const data =
    citySelection &&
    cities.edges.map(edge => edge.node.data).find(data => data.Name === citySelection);

  if (!data) {
    return [null, setCitySelection];
  }

  return [{ ...data, selection: citySelection }, setCitySelection];
}
