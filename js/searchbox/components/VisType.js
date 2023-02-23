"use strict";

import RadioInputList from "./RadioInputList.js";
import VIS_TYPE_OPTIONS from "../options/vis_type.js";

const e = React.createElement;

const VisType = ({value, setValue}) => {
  return e(RadioInputList, {
    label: "Select visualization type",
    options: VIS_TYPE_OPTIONS,
    name: "vis_type",
    value: value,
    setValue: setValue,
  });
};

export default VisType;
