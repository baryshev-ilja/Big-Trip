import ContentPresenter from './presenter/content-presenter.js';
import {createWaypointTemplate} from './mock/waypoint-mock.js';

const siteMainElement = document.querySelector('.page-body');
const siteHeaderMenuElement = siteMainElement.querySelector('.trip-main');
const siteHeaderNavElement = siteHeaderMenuElement.querySelector('.trip-controls__navigation');
const siteHeaderFiltersElement = siteHeaderMenuElement.querySelector('.trip-controls__filters');
const siteEventsContainerElement = siteMainElement.querySelector('.trip-events');

const contentPresenter = new ContentPresenter({
  tripEventsContainer: siteEventsContainerElement,
  routeContainer: siteHeaderMenuElement,
  menuContainer: siteHeaderNavElement,
  filtersContainer: siteHeaderFiltersElement
});

contentPresenter.init();

console.log(createWaypointTemplate());
console.log(createWaypointTemplate());
