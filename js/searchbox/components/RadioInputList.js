"use strict";

import Hiddens from "./Hiddens.js";

const {createElement: e} = React;

function RadioInputList({label, options, name, value, setValue}) {

    return e(
        "div",
        {
            className: "radio-menu",
            style: {},
        },
        e("div", {
            className: 'filter-label',
            tabIndex: 0
        }, `${label}`),
        ...options.map((o) =>
                e(
                    "div",
                    {
                        className: o.id === value ? "active" : "",
                        style: {marginTop: 5},
                    },

                    e(
                        "div",
                        {
                            // role: "radiogroup",
                            "aria-label": `${name}`,
                            className: "filter-value",
                            tabIndex: 0,
                        },
                        e("input", {
                            type: "radio",
                            tabIndex: 0,
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
                                className: 'info-title',
                            },
                            e("span", {
                                    title: o.infoContent,
                                },
                                `(${o.infoTitle}`,
                                e("i", {
                                    style: {marginLeft: 5},
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
