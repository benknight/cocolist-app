import _flatten from 'lodash/flatten';
import { getBadgesFromSurvey } from './common/Badges';
import BusinessRenderData from './common/BusinessRenderData';

function sortBusinesses(a, b) {
  const dataA = new BusinessRenderData(a);
  const dataB = new BusinessRenderData(b);
  const badgesA = getBadgesFromSurvey(dataA.survey);
  const badgesB = getBadgesFromSurvey(dataB.survey);
  if (badgesA.length === badgesB.length) {
    return dataB.cocoPoints - dataA.cocoPoints;
  }
  return badgesB.length - badgesA.length;
}

export default function getBusinessesFromSurveyData(edges) {
  const businesses = _flatten(edges.map(edge => edge.node.data.Business_record_match));
  return businesses.map(({ data }) => data).sort(sortBusinesses);
}
