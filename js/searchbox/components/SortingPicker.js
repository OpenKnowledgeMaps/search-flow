"use strict";

import RadioInputList from "./RadioInputList.js";
import SORTING_OPTIONS from "../options/sorting.js";

const e = React.createElement;

const SortingPicker = ({value, setValue}) => {
  return e(RadioInputList, {
    label: "Select ranking",
    options: SORTING_OPTIONS,
    name: "sorting",
    value: value,
    setValue: setValue,
  });
};

export default SortingPicker;
