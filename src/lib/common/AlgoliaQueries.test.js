import { flatten } from './AlgoliaQueries';
import mock from './AlgoliaQueries.json';

describe('AlgoliaQueries', () => {
  let flattenedData;

  it('should flatten data without throwing an error', () => {
    flattenedData = flatten(mock.data);
  });

  it('should format one  correctly', () => {
    expect(flattenedData[0]).toMatchObject({
      slug: 'babas-kitchen',
      name: 'Baba’s Kitchen',
      category_en: ['Indian'],
      category_vi: ['Ấn Độ'],
      cities_en: ['Saigon', 'Danang'],
      cities_vi: ['Sài Gòn', 'Đà Nẵng'],
      neighborhoods_en: {
        Danang: ['Hoi An'],
        Saigon: ['District 1', 'District 2'],
      },
      neighborhoods_vi: {
        Danang: ['Hội An'],
        Saigon: ['Quận 1', 'Quận 2'],
      },
    });
  });
});
