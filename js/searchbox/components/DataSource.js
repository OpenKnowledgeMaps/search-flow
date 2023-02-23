"use strict";

import RadioInputList from "./RadioInputList.js";
import SERVICES_OPTIONS from "../options/services.js";


const e = React.createElement;

const DataSource = ({value, setValue}) => {
  return e(RadioInputList, {
    label: "Select a data source",
    options: SERVICES_OPTIONS,
    name: "service",
    value: value,
    setValue: setValue,
  });
};

export default DataSource;
