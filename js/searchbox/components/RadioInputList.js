"use strict";

import Hiddens from "./Hiddens.js";


const {useState, createElement: e} = React;


function RadioInputList({label, options, name, value, setValue}) {

    const [showPopover, setShowPopover] = useState(false);

    const handlePopover = () => {
        setShowPopover(!showPopover);
    };

    return e(
        "div",
        {
            className: "radio-menu",
            style: {},
        },
        e("div", {
            className: 'filter-label',
        }, `${label}`),
        e("div", {
                className: "items-flex-container",
            },
            ...options.map((o) =>
                    e(
                        "div",
                        {
                            className: o.id === value ? "active" : "",
                            style: {display: 'flex', flexDirection: "row"},
                        },

                        e(
                            "div",
                            {
                                'aria-label': `${name}`,
                                className: "filter-value",
                                // tabIndex: 0,
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
                            // o.label,
                            e("label", {
                                htmlFor: o.id,
                                // className: "radio-label",
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
                        e('div', {className: 'popover__wrapper'},
                            e('div', {
                                    className: 'info-title',
                                }, `(${o.infoTitle}`,
                                e("i", {
                                    style: {marginLeft: 5},
                                    className: "fa fa-info-circle",
                                }),
                                ")"),
                            e('div', {
                                    className: 'popover__content'
                                    // className: (options.indexOf(o) === (options.length - 1)) ? 'popover__content_left' : 'popover__content',
                                },
                                e('div', {className: "popover__title"}, ['BASE', 'PubMed'].includes(o.infoTitle) ? o.infoTitle : ""),
                                e('div', {className: "popover__message"}, o.infoContent),
                            )
                        ),
                    ),
                e(Hiddens, {entries: [{name, value}]})
            ),
        ),
    );
}

export default RadioInputList;
