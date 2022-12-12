"use strict";

import CustomDropdown from "./CustomDropdown.js";
import LANG_OPTIONS from "../options/lang.js";

const e = React.createElement;

const LangPicker = ({ value, setValue }) => {
  return e(CustomDropdown, {
    options: LANG_OPTIONS,
    name: "lang",
    value,
    setValue,
  });
};

export default LangPicker;
