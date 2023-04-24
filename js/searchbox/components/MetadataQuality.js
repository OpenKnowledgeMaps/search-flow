"use strict";

import RadioInputList from "./RadioInputList.js";
import DESC_SIZE_OPTIONS from "../options/desc_size.js";

const e = React.createElement;

const MetadataQuality = ({value, setValue}) => {
  return e(RadioInputList, {
    label: "Select metadata quality",
    options: DESC_SIZE_OPTIONS,
    name: "min_descsize",
    value: value,
    setValue: setValue,
  });
};

export default MetadataQuality;
