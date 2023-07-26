import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import Chart from 'chart.js';
import ChartDatalabels from 'chartjs-plugin-datalabels';
import {BackgroundColorChart} from '../const.js';
import {
  getHumanizedTimeDiff,
  getPriceForAllTypes,
  getTotalCountPointsOfType,
  getDurationForAllTypes
} from '../utils/stats.js';

const BAR_HEIGHT = 55;

const renderPriceChart = (priceCtx, points) => {
  const priceForAllTypes = getPriceForAllTypes(points);
  const types = [...priceForAllTypes.keys()].map((value) => value.toUpperCase());
  const prices = [...priceForAllTypes.values()];
  const backgroundColors = types.map((type) => BackgroundColorChart[type.toLowerCase()]);
  const backgroundColorsHover = backgroundColors.map((color) => `${color.slice(0, color.length - 6)})`);

  return new Chart(priceCtx, {
    plugins: [ChartDatalabels],
    type: 'horizontalBar',
    data: {
      labels: types,
      datasets: [{
        data: prices,
        backgroundColor: backgroundColors,
        hoverBackgroundColor: backgroundColorsHover,
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `€ ${val}`,
        },
      },
      title: {
        display: true,
        text: 'MONEY',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 30,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const renderTypesCountChart = (typeCtx, points) => {
  const typeTotalCount = getTotalCountPointsOfType(points);
  const types = [...typeTotalCount.keys()].map((value) => value.toUpperCase());
  const counts = [...typeTotalCount.values()];
  const backgroundColors = types.map((type) => BackgroundColorChart[type.toLowerCase()]);
  const backgroundColorsHover = backgroundColors.map((color) => `${color.slice(0, color.length - 6)})`);


  return new Chart(typeCtx, {
    plugins: [ChartDatalabels],
    type: 'horizontalBar',
    data: {
      labels: types,
      datasets: [{
        data: counts,
        backgroundColor: backgroundColors,
        hoverBackgroundColor: backgroundColorsHover,
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${val}x`,
        },
      },
      title: {
        display: true,
        text: 'TYPE',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 30,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const renderTimeChart = (timeCtx, points) => {
  const timeForAllTypes = getDurationForAllTypes(points);
  const types = [...timeForAllTypes.keys()].map((value) => value.toUpperCase());
  const times = [...timeForAllTypes.values()];
  const backgroundColors = types.map((type) => BackgroundColorChart[type.toLowerCase()]);
  const backgroundColorsHover = backgroundColors.map((color) => `${color.slice(0, color.length - 6)})`);

  return new Chart(timeCtx, {
    plugins: [ChartDatalabels],
    type: 'horizontalBar',
    data: {
      labels: types,
      datasets: [{
        data: times,
        backgroundColor: backgroundColors,
        hoverBackgroundColor: backgroundColorsHover,
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${getHumanizedTimeDiff(val)}`,
        },
      },
      title: {
        display: true,
        text: 'TIME-SPEND',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 30,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatsTemplate = () => (
  `<section class="statistics">
  <h2 class="visually-hidden">Trip statistics</h2>

  <div class="statistics__item">
    <canvas class="statistics__chart" id="money" width="900"></canvas>
  </div>

  <div class="statistics__item">
    <canvas class="statistics__chart" id="type" width="900"></canvas>
  </div>

  <div class="statistics__item">
    <canvas class="statistics__chart" id="time-spend" width="900"></canvas>
  </div>
  </section>`
);

export default class StatsView extends AbstractStatefulView {
  #uniquePoints = null;

  #priceChart = null;
  #typeChart = null;
  #timeChart = null;

  constructor(points) {
    super();
    this._state = points;
    this.#uniquePoints = getTotalCountPointsOfType(this._state).size;

    this.#setCharts();
  }

  get template() {
    return createStatsTemplate();
  }

  #resetCharts() {
    this.#priceChart = null;
    this.#typeChart = null;
    this.#timeChart = null;
  }

  removeElement() {
    super.removeElement();

    if (this.#priceChart !== null || this.#typeChart !== null || this.#timeChart !== null) {
      this.#resetCharts();
    }
  }

  #setCharts() {
    if (this.#priceChart !== null || this.#typeChart !== null || this.#timeChart !== null) {
      this.#resetCharts();
    }

    const moneyCtx = this.element.querySelector('#money');
    const typeCtx = this.element.querySelector('#type');
    const timeCtx = this.element.querySelector('#time-spend');

    moneyCtx.height = BAR_HEIGHT * this.#uniquePoints;
    typeCtx.height = BAR_HEIGHT * this.#uniquePoints;
    timeCtx.height = BAR_HEIGHT * this.#uniquePoints;

    this.#priceChart = renderPriceChart(moneyCtx, this._state);
    this.#typeChart = renderTypesCountChart(typeCtx, this._state);
    this.#timeChart = renderTimeChart(timeCtx, this._state);
  }
}
