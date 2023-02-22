"use strict";

import Hiddens from "./Hiddens.js";

const {createElement: e} = React;

function RadioInputList({label, options, name, value, setValue}) {

    // const selectedOption = options.find((o) => o.id === value);
    // const btnLabel = selectedOption ? selectedOption.label : "";

    return e(
        "div",
        {
            // className: "dropdown-menu",
            style: {maxHeight: 250, marginBottom: 10},
        },
        e("div", {className: 'filter-label'}, `${label}`),
        ...options.map((o) =>
                e(
                    "div",
                    {
                        className: o.id === value ? "active" : "",
                        style: {marginTop: 5},
                    },

                    e(
                        "label",
                        {
                            className: "filter-value",
                        },
                        e("input", {
                            // style: {marginRight: 5, marginTop: '2px', verticalAlign: 'top'},
                            type: "radio",
                            value: o.id,
                            checked: o.id === value,
                            onChange: (e) => {
                                if (e.target.checked) {
                                    setValue(o.id);
                                }
                            },

                        }),
                        o.label,
                        e('span',
                            {
                                style: {
                                    marginLeft: 5,
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                }
                            },
                            e("span", {
                                    title: o.infoContent,
                                    hover: {text: '#333333'}
                                },
                                `(${o.infoTitle}`,
                                e("i", {
                                    style: {marginLeft: 5, hover: {text: '#333333'}},
                                    className: "fa fa-info-circle",
                                }),
                                ")"
                            )
                        )
                    )
                ),
            e(Hiddens, {entries: [{name, value}]})
        )
    );
}

export default RadioInputList;
