"use strict";

import CustomDropdown from "./CustomDropdown.js";
import TIMESPAN_OPTIONS from "../options/timespan.js";

const e = React.createElement;

const TimespanPicker = ({ value, setValue }) => {
  return e(CustomDropdown, {
    options: TIMESPAN_OPTIONS,
    name: "time_range",
    value,
    setValue,
  });
};

export default TimespanPicker;
