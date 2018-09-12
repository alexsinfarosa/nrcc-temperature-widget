import { decorate, observable, action, computed, when, reaction } from "mobx";
import axios from "axios";
// import { jStat } from "jStat";
import { stations } from "../assets/stationList";

import { determineQuantiles, index, arcData, closest } from "../utils/utils";
import { format, getMonth } from "date-fns/esm";

import createHistory from "history/createBrowserHistory";
import subDays from "date-fns/subDays";
const history = createHistory();

export default class ParamsStore {
  hash = "nycthr";
  maxt;
  mint;
  constructor() {
    const query = history.location.hash.slice(1);
    const isValidQuery =
      query !== "" && stations.find(stn => stn.sid === query) !== undefined;

    isValidQuery
      ? when(
          () => true,
          () => {
            this.hash = query;
            this.station = stations.find(stn => stn.sid === query);
          }
        )
      : when(() => true, () => history.push({ hash: `#${this.hash}` }));

    when(() => !this.data, () => this.loadObservedData(this.params));
    reaction(() => this.station.sid, () => this.loadObservedData(this.params));
    reaction(
      () => this.dateOfInterest,
      () => this.loadObservedData(this.params)
    );
    when(
      () => this.isSummerOrWinter === "summer",
      () => {
        this.maxt = 90;
        this.mint = 65;
      }
    );
    when(
      () => this.isSummerOrWinter === "winter",
      () => {
        this.maxt = 32;
        this.mint = 20;
      }
    );

    reaction(
      () => this.data,
      () => console.log(this.isSummerOrWinter, this.params)
    );
  }

  isLoading = false;
  setIsLoading = d => this.isLoading;

  station = stations.find(stn => stn.sid === "nycthr");

  setStation = d => {
    this.hash = d.sid;
    history.push({ hash: `#${this.hash}` });
    this.station = d;
    this.maxt = this.isSummerOrWinter === "summer" ? 90 : 32;
    this.mint = this.isSummerOrWinter === "summer" ? 65 : 20;
    this.rainfall = 1;
    this.snowfall = 2;
  };

  rainfall = 1;
  snowfall = 2;

  dateOfInterest = subDays(new Date(), 1);
  setDateOfInterest = d => {
    this.dateOfInterest = d;
    this.maxt = this.isSummerOrWinter === "summer" ? 90 : 32;
    this.mint = this.isSummerOrWinter === "summer" ? 65 : 20;
  };

  get month() {
    return getMonth(this.dateOfInterest) + 1;
  }

  setExtreemeValues = (type, value) => {
    this[type] = value;
  };

  // datermines the seasonal extreeme call
  get isSummerOrWinter() {
    return this.month >= 4 && this.month <= 10 ? "summer" : "winter";
  }

  // returns the start of the season
  get season() {
    if (this.month >= 3 && this.month <= 5)
      return { label: "Spring", season_start: "03-01" };
    if (this.month >= 6 && this.month <= 8)
      return { label: "Summer", season_start: "06-01" };
    if (this.month >= 9 && this.month <= 11)
      return { label: "Fall", season_start: "09-01" };
    if (this.month === 12 || this.month === 1 || this.month === 2)
      return { label: "Winter", season_start: "12-01" };
  }

  // average temperature parameters
  tempParams = [
    {
      name: "avgt",
      interval: [1, 0, 0],
      duration: "mtd",
      reduce: "mean",
      maxmissing: 1
    },
    {
      name: "avgt",
      interval: [1, 0, 0],
      duration: "std",
      season_start: `${this.season.season_start}`,
      reduce: "mean",
      maxmissing: 1
    },
    {
      name: "avgt",
      interval: [1, 0, 0],
      duration: "ytd",
      reduce: "mean",
      maxmissing: 5
    }
  ];

  // average precipitation parameters
  pcpnParams = [
    {
      name: "pcpn",
      interval: [1, 0, 0],
      duration: "mtd",
      reduce: "sum",
      maxmissing: 1
    },
    {
      name: "pcpn",
      interval: [1, 0, 0],
      duration: "std",
      season_start: `${this.season.season_start}`,
      reduce: "sum",
      maxmissing: 1
    },
    {
      name: "pcpn",
      interval: [1, 0, 0],
      duration: "ytd",
      reduce: "sum",
      maxmissing: 5
    }
  ];

  // if it is summer (month 4 to 10) we make the call with the following params
  summerParams = [
    {
      name: "maxt",
      interval: [1, 0, 0],
      duration: "std",
      season_start: "01-01",
      reduce: `cnt_ge_80`,
      maxmissing: 1
    },
    {
      name: "maxt",
      interval: [1, 0, 0],
      duration: "std",
      season_start: "01-01",
      reduce: `cnt_ge_90`,
      maxmissing: 1
    },
    {
      name: "maxt",
      interval: [1, 0, 0],
      duration: "std",
      season_start: "01-01",
      reduce: `cnt_ge_100`,
      maxmissing: 1
    },
    {
      name: "mint",
      interval: [1, 0, 0],
      duration: "std",
      season_start: "01-01",
      reduce: `cnt_ge_65`,
      maxmissing: 1
    },
    {
      name: "mint",
      interval: [1, 0, 0],
      duration: "std",
      season_start: "01-01",
      reduce: `cnt_ge_70`,
      maxmissing: 1
    },
    {
      name: "mint",
      interval: [1, 0, 0],
      duration: "std",
      season_start: "01-01",
      reduce: `cnt_ge_75`,
      maxmissing: 1
    },
    {
      name: "pcpn",
      interval: [1, 0, 0],
      duration: "std",
      season_start: "01-01",
      reduce: `cnt_ge_1`,
      maxmissing: 1
    },
    {
      name: "pcpn",
      interval: [1, 0, 0],
      duration: "std",
      season_start: "01-01",
      reduce: `cnt_ge_2`,
      maxmissing: 1
    },
    {
      name: "pcpn",
      interval: [1, 0, 0],
      duration: "std",
      season_start: "01-01",
      reduce: `cnt_ge_3`,
      maxmissing: 1
    }
  ];

  // if it is winter (month 1,2,3,11,12) we make the call with the following params
  winterParams = [
    {
      name: "maxt",
      interval: [1, 0, 0],
      duration: "std",
      season_start: "07-01",
      reduce: `cnt_le_32`,
      maxmissing: 1
    },
    {
      name: "maxt",
      interval: [1, 0, 0],
      duration: "std",
      season_start: "07-01",
      reduce: `cnt_le_20`,
      maxmissing: 1
    },
    {
      name: "maxt",
      interval: [1, 0, 0],
      duration: "std",
      season_start: "07-01",
      reduce: `cnt_le_15`,
      maxmissing: 1
    },
    {
      name: "mint",
      interval: [1, 0, 0],
      duration: "std",
      season_start: "07-01",
      reduce: `cnt_le_20`,
      maxmissing: 1
    },
    {
      name: "mint",
      interval: [1, 0, 0],
      duration: "std",
      season_start: "07-01",
      reduce: `cnt_le_15`,
      maxmissing: 1
    },
    {
      name: "mint",
      interval: [1, 0, 0],
      duration: "std",
      season_start: "07-01",
      reduce: `cnt_le_10`,
      maxmissing: 1
    },
    {
      name: "snow",
      interval: [1, 0, 0],
      duration: "std",
      season_start: "07-01",
      reduce: `cnt_ge_2`,
      maxmissing: 1
    },
    {
      name: "snow",
      interval: [1, 0, 0],
      duration: "std",
      season_start: "07-01",
      reduce: `cnt_ge_4`,
      maxmissing: 1
    },
    {
      name: "snow",
      interval: [1, 0, 0],
      duration: "std",
      season_start: "07-01",
      reduce: `cnt_ge_6`,
      maxmissing: 1
    }
  ];

  // the call
  get params() {
    let elems = [...this.tempParams, ...this.pcpnParams];
    this.isSummerOrWinter === "summer"
      ? (elems = [...elems, ...this.summerParams])
      : (elems = [...elems, ...this.winterParams]);

    return {
      sid: this.station.sid,
      sdate: `POR-${format(this.dateOfInterest, "MM-DD")}`,
      edate: format(this.dateOfInterest, "YYYY-MM-DD"),
      elems
    };
  }

  // main data array
  data;
  setData = d => (this.data = d);

  loadObservedData = params => {
    this.setData(undefined);
    this.setIsLoading(true);
    return axios
      .post(`${window.location.protocol}//data.rcc-acis.org/StnData`, params)
      .then(res => {
        // console.log(res.data.data);
        this.setData(res.data.data);
        this.setIsLoading(false);
      })
      .catch(err => {
        console.log("Failed to load observed data ", err);
      });
  };

  get seasonalType() {
    return this.isSummerOrWinter === "summer"
      ? [
          {
            type: "maxt",
            range: [80, 90, 100],
            elem: this.maxt,
            steps: 10,
            min: 80,
            max: 100,
            defaultValue: 90,
            marks: {
              80: {
                style: {
                  whiteSpace: "nowrap"
                },
                label: "80 °F"
              },
              90: {
                style: {
                  whiteSpace: "nowrap"
                },
                label: "90 °F"
              },
              100: {
                style: {
                  whiteSpace: "nowrap"
                },
                label: "100 °F"
              }
            }
          },
          {
            type: "mint",
            range: [65, 70, 75],
            elem: this.mint,
            steps: 5,
            min: 65,
            max: 75,
            defaultValue: 65,
            marks: {
              65: {
                style: {
                  whiteSpace: "nowrap"
                },
                label: "65 °F"
              },
              70: {
                style: {
                  whiteSpace: "nowrap"
                },
                label: "70 °F"
              },
              75: {
                style: {
                  whiteSpace: "nowrap"
                },
                label: "75 °F"
              }
            }
          },
          {
            type: "rainfall",
            range: [1, 2, 3],
            elem: this.rainfall,
            steps: 1,
            min: 1,
            max: 3,
            defaultValue: 1,
            marks: {
              1: {
                style: {
                  whiteSpace: "nowrap"
                },
                label: "1 in"
              },
              2: {
                style: {
                  whiteSpace: "nowrap"
                },
                label: "2 in"
              },
              3: {
                style: {
                  whiteSpace: "nowrap"
                },
                label: "3 in"
              }
            }
          }
        ]
      : [
          {
            type: "maxt",
            range: [32, 20, 15],
            elem: this.maxt,
            steps: 5,
            min: 15,
            max: 32,
            defaultValue: 32,
            marks: {
              32: {
                style: {
                  whiteSpace: "nowrap"
                },
                label: "32 °F"
              },
              20: {
                style: {
                  whiteSpace: "nowrap"
                },
                label: "20 °F"
              },
              15: {
                style: {
                  whiteSpace: "nowrap"
                },
                label: "15 °F"
              }
            }
          },
          {
            type: "mint",
            range: [20, 15, 10],
            elem: this.mint,
            steps: 5,
            min: 10,
            max: 20,
            defaultValue: 20,
            marks: {
              20: {
                style: {
                  whiteSpace: "nowrap"
                },
                label: "20 °F"
              },
              15: {
                style: {
                  whiteSpace: "nowrap"
                },
                label: "15 °F"
              },
              10: {
                style: {
                  whiteSpace: "nowrap"
                },
                label: "10 °F"
              }
            }
          },
          {
            type: "snowfall",
            range: [2, 4, 6],
            elem: this.snowfall,
            steps: 2,
            min: 2,
            max: 6,
            defaultValue: 2,
            marks: {
              2: {
                style: {
                  whiteSpace: "nowrap"
                },
                label: "2 in"
              },
              4: {
                style: {
                  whiteSpace: "nowrap"
                },
                label: "4 in"
              },
              6: {
                style: {
                  whiteSpace: "nowrap"
                },
                label: "6 in"
              }
            }
          }
        ];
  }

  get keys() {
    let extremeKeys;

    this.isSummerOrWinter === "summer"
      ? (extremeKeys = {
          maxt80: { label: "Days > 80", type: "maxt", isSlider: true },
          maxt90: { label: "Days > 90", type: "maxt", isSlider: true },
          maxt100: { label: "Days > 100", type: "maxt", isSlider: true },
          mint65: { label: "Nights > 65", type: "mint", isSlider: true },
          mint70: { label: "Nights > 70", type: "mint", isSlider: true },
          mint75: { label: "Nights > 75", type: "mint", isSlider: true },
          rain1: { label: "Rainfall > 1", type: "rainfall", isSlider: true },
          rain2: { label: "Rainfall > 2", type: "rainfall", isSlider: true },
          rain3: { label: "Rainfall > 3", type: "rainfall", isSlider: true }
        })
      : (extremeKeys = {
          maxt32: { label: "Days < 32", type: "maxt", isSlider: true },
          maxt20: { label: "Days < 20", type: "maxt", isSlider: true },
          maxt15: { label: "Days < 15", type: "maxt", isSlider: true },
          mint20: { label: "Nights < 20", type: "mint", isSlider: true },
          mint15: { label: "Nights < 15", type: "mint", isSlider: true },
          mint10: { label: "Nights < 10", type: "mint", isSlider: true },
          snow2: { label: "Snowfall > 2", type: "snowfall", isSlider: true },
          snow4: { label: "Snowfall > 4", type: "snowfall", isSlider: true },
          snow6: { label: "Snowfall > 6", type: "snowfall", isSlider: true }
        });

    return {
      tempMonth: {
        label: format(this.dateOfInterest, "MMMM"),
        type: "avgTemp",
        isSlider: false
      },
      tempSeason: {
        label: this.season.label,
        type: "avgTemp",
        isSlider: false
      },
      tempYear: { label: "This Year", type: "avgTemp", isSlider: false },
      pcpnMonth: {
        label: format(this.dateOfInterest, "MMMM"),
        type: "avgPcpn",
        isSlider: false
      },
      pcpnSeason: {
        label: this.season.label,
        type: "avgPcpn",
        isSlider: false
      },
      pcpnYear: { label: "This Year", type: "avgPcpn", isSlider: false },
      ...extremeKeys
    };
  }

  get gauge() {
    let results = [];
    if (this.data) {
      Object.keys(this.keys).forEach((elem, i) => {
        let p = {};
        const label = this.keys[elem].label;
        const type = this.keys[elem].type;
        const isSlider = this.keys[elem].isSlider;
        const dates = this.data.map(d => d[0]);
        const values = this.data.map(
          d => (d[i + 1] === "T" ? 0.0001 : parseFloat(d[i + 1]))
        );

        let original = dates
          .map((date, i) => {
            const value = values[i];
            return value === "M" || isNaN(value) ? null : { date, value };
          })
          .filter(d => d);

        const datesCleaned = original.map(obj => obj.date);
        const valuesCleaned = original.map(obj => obj.value);
        let quantiles = determineQuantiles(valuesCleaned.slice(0, -1));

        let daysAboveThisYear;
        let mean;
        if (
          type === "maxt" ||
          type === "mint" ||
          type === "rainfall" ||
          type === "snowfall"
        ) {
          daysAboveThisYear = parseFloat(valuesCleaned.slice(-1)[0]).toFixed(0);
          mean = quantiles["50"].toFixed(0);
        } else if (type === "avgPcpn") {
          daysAboveThisYear = parseFloat(valuesCleaned.slice(-1)[0]).toFixed(2);
          mean = quantiles["50"].toFixed(2);
        } else {
          daysAboveThisYear = parseFloat(valuesCleaned.slice(-1)[0]).toFixed(1);
          mean = quantiles["50"].toFixed(1);
        }

        const active = index(daysAboveThisYear, quantiles);
        const gaugeData = arcData(quantiles, type);
        let sliderStyle;
        if (isSlider)
          sliderStyle = this.seasonalType.filter(t => t.type === type)[0];

        const gaugeDataNoCircles = gaugeData.filter(
          obj =>
            obj.name !== "Min" &&
            obj.name !== "25%" &&
            obj.name !== "Mean" &&
            obj.name !== "75%" &&
            obj.name !== "Max"
        );

        const colors = gaugeDataNoCircles.map(d => d.fill);

        let graphData = datesCleaned.map((date, i) => {
          let barColorIdx = closest(valuesCleaned[i], Object.values(quantiles));
          const barColor = colors[barColorIdx];
          let bar = parseFloat(valuesCleaned[i]) - parseFloat(mean);

          return {
            date,
            value: valuesCleaned[i],
            mean,
            bar,
            barColor
          };
        });

        const csvData = datesCleaned.map((date, i) => ({
          date,
          value: parseFloat(valuesCleaned[i])
        }));

        p = {
          colors,
          original,
          label,
          type,
          elem,
          daysAboveThisYear,
          quantiles,
          mean,
          active,
          gaugeData,
          isSlider,
          sliderStyle,
          graphData,
          csvData
        };
        results.push(p);
      });
      // console.log(results);
      return results;
    }
  }

  get avgTemps() {
    if (this.gauge) {
      return this.gauge.filter(
        o =>
          o.elem === "tempMonth" ||
          o.elem === "tempSeason" ||
          o.elem === "tempYear"
      );
    }
  }

  get avgPcpns() {
    if (this.gauge) {
      return this.gauge.filter(
        o =>
          o.elem === "pcpnMonth" ||
          o.elem === "pcpnSeason" ||
          o.elem === "pcpnYear"
      );
    }
  }

  get extremeMaxtT() {
    if (this.gauge) {
      return this.gauge.filter(o => o.elem === `maxt${this.maxt}`);
    }
  }

  get extremeMinT() {
    if (this.gauge) {
      return this.gauge.filter(o => o.elem === `mint${this.mint}`);
    }
  }

  get extremeRainSnow() {
    if (this.gauge) {
      return this.isSummerOrWinter === "summer"
        ? this.gauge.filter(o => o.elem === `rain${this.rainfall}`)
        : this.gauge.filter(o => o.elem === `snow${this.snowfall}`);
    }
  }

  get seasonalExtreme() {
    if (this.gauge) {
      return [
        ...this.extremeMaxtT,
        ...this.extremeMinT,
        ...this.extremeRainSnow
      ];
    }
  }
}

decorate(ParamsStore, {
  isLoading: observable,
  setIsLoading: action,
  station: observable,
  hash: observable,
  setStation: action,
  maxt: observable,
  setMaxt: action,
  mint: observable,
  setMint: action,
  rainfall: observable,
  setRainfall: action,
  snowfall: observable,
  setSnowfall: action,
  isSummerOrWinter: computed,
  season: computed,
  params: computed,
  data: observable,
  setData: action,
  gauge: computed,
  seasonalType: computed,
  keys: computed,
  avgTemps: computed,
  avgPcpns: computed,
  extremeMaxtT: computed,
  extremeMinT: computed,
  extremeRainSnow: computed,
  seasonalExtreme: computed,
  dateOfInterest: observable,
  setDateOfInterest: action,
  month: computed
});
