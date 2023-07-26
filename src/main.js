import GeneralPresenter from './presenter/general-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import MenuPresenter from './presenter/menu-presenter.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';

import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';

import {render, remove} from './framework/render.js';
import {MenuItem} from './const.js';

import StatsView from './view/stats-view.js';
import AddNewPointButtonView from './view/add-new-point-button-view.js';
import PointsApiService from './api/points-api-service.js';
import UiBlocker from './framework/ui-blocker/ui-blocker';

const AUTHORISATION = 'Basic 45h5hgk57dw0ght7450ekfe0';
const END_POINT = 'https://19.ecmascript.pages.academy/big-trip';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

const uiBlocker = new UiBlocker({
  lowerLimit: TimeLimit.LOWER_LIMIT,
  upperLimit: TimeLimit.UPPER_LIMIT,
});

const siteMainElement = document.querySelector('.page-body');
const siteHeaderMenuElement = siteMainElement.querySelector('.trip-main');
const siteHeaderNavElement = siteHeaderMenuElement.querySelector('.trip-controls__navigation');
const siteHeaderFiltersElement = siteHeaderMenuElement.querySelector('.trip-controls__filters');
const siteEventsContainerElement = siteMainElement.querySelector('.trip-events');

const pointsModel = new PointsModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORISATION)
});
const filterModel = new FilterModel();

let statsComponent = null;

const newPointButtonComponent = new AddNewPointButtonView({
  onNewPointButtonClick: handleNewPointButtonFetch
});

const generalPresenter = new GeneralPresenter({
  listContainer: siteEventsContainerElement,
  pointsModel,
  filterModel,
  onNewPointDestroy: handleNewPointButtonClose,
  newPointBtnAborting: handleNewPointButtonClickError,
  newPointBtnSuccess: handleNewPointButtonClickSuccess,
});

const filterPresenter = new FilterPresenter({
  filterContainer: siteHeaderFiltersElement,
  filterModel,
  pointsModel,
});

const menuPresenter = new MenuPresenter({
  menuContainer: siteHeaderNavElement,
});

const tripInfoPresenter = new TripInfoPresenter({
  tripInfoContainer: siteHeaderMenuElement,
  pointsModel: pointsModel,
});

function handleNewPointButtonClose() {
  newPointButtonComponent.element.disabled = false;
  generalPresenter.showListMessage();
}

function handleNewPointButtonFetch() {
  generalPresenter.checkOnline();
}

function handleNewPointButtonClickSuccess() {
  generalPresenter.createPoint();
  generalPresenter.hideListMessage();
  newPointButtonComponent.element.disabled = true;
}

function handleNewPointButtonClickError() {
  uiBlocker.block();
  newPointButtonComponent.shake();
  uiBlocker.unblock();
}

render(newPointButtonComponent, siteHeaderMenuElement);
newPointButtonComponent.element.disabled = true;

const menuClickHandler = (menuItem) => {
  switch (menuItem) {
    case MenuItem.STATS:
      generalPresenter.destroy();
      statsComponent = new StatsView(pointsModel.points);
      render(statsComponent, siteEventsContainerElement);
      newPointButtonComponent.element.disabled = true;
      break;
    case MenuItem.TABLE:
      generalPresenter.destroy();
      generalPresenter.init();
      remove(statsComponent);
      newPointButtonComponent.element.disabled = false;
      break;
  }
};

pointsModel.init()
  .finally(() => {
    newPointButtonComponent.element.disabled = false;

    if (!pointsModel.offers.length && !pointsModel.destinations.length) {
      newPointButtonComponent.element.disabled = true;
    }
  });
generalPresenter.init();
filterPresenter.init();
tripInfoPresenter.init();
menuPresenter.init(menuClickHandler);
