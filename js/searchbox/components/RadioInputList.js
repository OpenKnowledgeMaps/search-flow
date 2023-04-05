"use strict";

import Hiddens from "./Hiddens.js";
import useOutsideClick from "../hooks/useOutsideClick.js";


const {useState, useRef, createElement: e} = React;


function RadioInputList({label, options, name, value, setValue}) {

    const [showPopover, setShowPopover] = useState(false);
    const [popoverId, setPopoverId] = useState('');

    const handleOutsideClick = () => {
        setShowPopover(false);
        setPopoverId('');
    };

    const containerRef = useRef(null);
    useOutsideClick(containerRef, handleOutsideClick);


    return e(
        "fieldset",
        // "div",
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
                            key: `${o.id}-${o.label}-option`,
                            className: o.id === value ? "active" : "",
                            style: {display: 'flex', flexDirection: "row"},
                        },

                        e(
                            "div",
                            {
                                id: `${o.id}-radio`,
                                'aria-label': `${o.label}`,
                                className: "filter-value",
                                // tabIndex: 0,
                                // onClick: () => setValue(o.id),
                                // onKeyDown: (e) => {
                                //     if (e.key === 'Enter') {
                                //         setValue(o.id);
                                //     }
                                // },
                                // "aria-checked": o.id === value
                            },
                            e("input", {
                                type: "radio",
                                value: o.id,
                                checked: o.id === value,
                                tabIndex: 0,
                                onClick: () => setValue(o.id),
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

                        e('div', {
                            key: `${o.id}-popover`,
                            id: `${o.label}-popover`,
                            className: 'popover__wrapper',
                        }, [
                            e('div', {
                                    key: `${o.id}-info-title`,
                                    className: 'info-title',
                                    role: 'button',
                                    tabIndex: 0,
                                    'aria-label': 'Information',
                                    // ref: containerRef,
                                    onKeyDown: (e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            setShowPopover(!showPopover);
                                            setPopoverId(o.label);
                                        } else if (e.key === 'Escape') {
                                            setShowPopover(false);
                                            setPopoverId('');
                                        }
                                    },
                                    onClick: () => {
                                        if (popoverId === o.label) {
                                            setShowPopover(false);
                                            setPopoverId('');
                                        } else {
                                            setShowPopover(true);
                                            setPopoverId(o.label);
                                        }
                                    },
                                }, `(${o.infoTitle}`,
                                e("i", {
                                    style: {marginLeft: 5},
                                    className: "fa fa-info-circle",
                                }),
                                ")"),
                            (popoverId === o.label && showPopover) &&
                            e('div', {
                                style: {visible: showPopover ? 'visible' : 'hidden'},
                                className: 'popover__content',
                                role: 'dialog',
                                'aria-labelledby': 'info-title',
                                onKeyDown: (e) => {
                                    if (e.key === 'Escape') {
                                        setShowPopover(false);
                                        setPopoverId('');
                                    }
                                },
                            }, [
                                e('div', {
                                    className: 'popover__title'
                                }, ['BASE', 'PubMed'].includes(o.infoTitle) ? o.infoTitle : ""),
                                e('div', {
                                    className: 'popover__message',
                                    id: 'popover-message'
                                }, o.infoContent),
                            ]),
                        ])
                    ),
                e(Hiddens, {entries: [{name, value}]})
            ),
        ),
    );
}

export default RadioInputList;
