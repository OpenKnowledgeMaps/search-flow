"use strict";

import Hiddens from "./Hiddens.js";
import useOutsideClick from "../hooks/useOutsideClick.js";
import PopoverInfo from "./PopoverInfo.js";


const {useState, useRef, useEffect, createElement: e} = React;


function RadioInputList({label, options, name, value, setValue}) {

    return e(
        "fieldset",
        {
            className: "radio-menu",
            role: "radiogroup",
            "aria-labelledby": `${label}-label`,
        },
        e(
            "div",
            {
                id: `${label}-label`,
                className: 'filter-label',
            }, `${label}`),
        e("div", {
                className: "items-flex-container",
            },
            ...options.map((o) =>
                    e(
                        "div",
                        {
                            key: `${o.id}-${o.label}-${options.indexOf(o)}-option`,
                            className: o.id === value ? "active" : "",
                            style: {display: 'flex', flexDirection: "row"},
                        },

                        e(
                            "div",
                            {
                                id: `${o.id}-radio`,
                                'aria-label': `${o.label}`,
                                className: "filter-value",
                            },
                            e("input", {
                                type: "radio",
                                value: o.id,
                                checked: o.id === value,
                                tabIndex: 0,
                                // onClick: () => setValue(o.id),
                                onChange: () => setValue(o.id),
                                onKeyDown: (e) => {
                                    if (e.key === 'Enter') {
                                        setValue(o.id);
                                    }
                                },
                                "aria-checked": o.id === value

                            }),
                            e("label", {
                                htmlFor: o.id,
                                style: {
                                    fontSize: 14,
                                    fontWeight: 400,
                                    color: '#818181',
                                    cursor: 'pointer', // add cursor pointer
                                    userSelect: 'none', // disable text selection
                                },
                                onClick: () => setValue(o.id), // add click handler
                            }, o.label)
                        ),

                        e(PopoverInfo, {o: o, options: options}),
                    ),

                e(Hiddens, {entries: [{name, value}]})
            ),
        ),
    );
}

export default RadioInputList;
