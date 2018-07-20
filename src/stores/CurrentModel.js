import { decorate, computed } from "mobx";
// import { format, getYear, isAfter } from "date-fns/esm";

export default class CurrentModel {
  paramsStore;
  constructor(appStore) {
    this.paramsStore = appStore.paramsStore;
  }

  // get modelData() {
  //   const data = this.paramsStore.data;

  //   return data.map(el => {
  //     let p = {};
  //     p.date = el[0];
  //   });
  // }
}

decorate(CurrentModel, {
  modelData: computed
});
