"use strict";

import CustomDropdown from "./CustomDropdown.js";
import LANGUAGE_OPTIONS from "../options/languages.js";

const e = React.createElement;

const LanguagePicker = ({ value, setValue }) => {
  return e(CustomDropdown, {
    options: LANGUAGE_OPTIONS,
    name: "lang",
    value,
    setValue,
  });
};

export default LanguagePicker;
