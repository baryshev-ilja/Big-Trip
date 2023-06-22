import GeneralPresenter from './presenter/general-presenter.js';
import PointsModel from './model/points-model.js';
import {generateFilter} from './mock/filter.js';

const siteMainElement = document.querySelector('.page-body');
const siteHeaderMenuElement = siteMainElement.querySelector('.trip-main');
const siteHeaderNavElement = siteHeaderMenuElement.querySelector('.trip-controls__navigation');
const siteHeaderFiltersElement = siteHeaderMenuElement.querySelector('.trip-controls__filters');
const siteEventsContainerElement = siteMainElement.querySelector('.trip-events');

const pointsModel = new PointsModel();

const filters = generateFilter(pointsModel.points);

const mainPresenter = new GeneralPresenter({
  tripEventsContainer: siteEventsContainerElement,
  routeContainer: siteHeaderMenuElement,
  menuContainer: siteHeaderNavElement,
  filtersContainer: siteHeaderFiltersElement,
  pointsModel,
  filters: filters
});

mainPresenter.init();
