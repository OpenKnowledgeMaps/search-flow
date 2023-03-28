"use strict";

const e = React.createElement;

const SearchField = ({value, setValue, required}) => {
    return e("div", {style: {marginBottom: 10}},
        e("label", {htmlFor: "searchterm", className: "filter-label"}, "Enter search query (e.g. digital education)"),
        e("input", {
            required: required,
            autoFocus: true,
            type: "text",
            name: "q",
            size: "89",
            className: "text-field",
            id: "searchterm",
            placeholder: "",
            spellCheck: true,
            value,
            onChange: (e) => setValue(e.target.value),
        })
    )
};

export default SearchField;
