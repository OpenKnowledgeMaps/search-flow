"use strict";

import CustomDropdown from "./CustomDropdown.js";
import SORTING_OPTIONS from "../options/sorting.js";

const e = React.createElement;

const SortingPicker = ({ value, setValue }) => {
  return e(CustomDropdown, {
    options: SORTING_OPTIONS,
    name: "sorting",
    value,
    setValue,
  });
};

export default SortingPicker;
