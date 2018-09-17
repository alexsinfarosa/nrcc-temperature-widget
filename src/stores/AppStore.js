import { decorate, when, observable, action } from "mobx";
import ParamsStore from "./ParamsStore";

export default class AppStore {
  stations;
  paramsStore;
  setStations = d => (this.stations = d);
  constructor() {
    when(
      () => !this.stations,
      () => {
        fetch("stationList2.json")
          .then(res => res.json())
          .then(stns => {
            this.setStations(stns);
          })
          .catch(err => {
            console.log("Failed to load stations", err);
          });
      }
    );
    this.paramsStore = new ParamsStore();
  }
}

decorate(AppStore, {
  stations: observable,
  setStations: action
});
