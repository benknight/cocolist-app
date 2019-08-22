import { getBadgesFromSurvey } from './badges';
import BusinessRenderData from './BusinessRenderData';

export default function sortBusinesses(a, b) {
  const dataA = new BusinessRenderData(a);
  const dataB = new BusinessRenderData(b);
  const badgesA = getBadgesFromSurvey(dataA.survey);
  const badgesB = getBadgesFromSurvey(dataB.survey);
  if (badgesA.length === badgesB.length) {
    return dataB.cocoPoints - dataA.cocoPoints;
  }
  return badgesB.length - badgesA.length;
}
