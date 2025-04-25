"use strict";

import RadioInputList from "./RadioInputList.js";
import SERVICES_OPTIONS from "../options/services.js";


const e = React.createElement;

const DataSource = ({value, setValue}) => {
    const filteredOptions = SERVICES_OPTIONS.filter(option => option.id !== 'orcid');
    return e("div", {className: "datasource-style"},
        e(RadioInputList, {
            label: "Select a data source",
            options: filteredOptions,
            name: "service",
            value: value,
            setValue: setValue,
        })
    )
};

export default DataSource;
