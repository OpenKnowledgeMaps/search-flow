"use strict";

import Hiddens from "./Hiddens.js";
import useOutsideClick from "../hooks/useOutsideClick.js";


const {useState, useRef, useEffect, createElement: e} = React;


function RadioInputList({label, options, name, value, setValue}) {

    const [showPopover, setShowPopover] = useState(false);
    const [popoverId, setPopoverId] = useState('');

    // for useOutsideClick hook but not working with popover in first item in list...
    const handleOutsideClick = () => {
        setShowPopover(false);
        setPopoverId('');
    };

    const containerRef = useRef(null);

    useOutsideClick(containerRef, handleOutsideClick);

    const popoverRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (popoverRef.current && !popoverRef.current.contains(e.target)) {
                setShowPopover(false);
                setPopoverId('');
            }
        };

        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [popoverRef]);

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

                        e('div', {
                            key: `${o.label}-${o.infoTitle}-popover`,
                            id: `${o.label}-${o.infoTitle}-popover`,
                            className: 'popover__wrapper',
                            // ref: containerRef,
                        }, [
                            e('div', {
                                    key: `${o.id}-${o.label}-${options.indexOf(o)}-info-title`,
                                    className: 'info-title',
                                    role: 'button',
                                    tabIndex: 0,
                                    'aria-label': 'Information',
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
                                        if (!popoverId || popoverId !== o.label) {
                                            setPopoverId(o.label);
                                            setShowPopover(true);
                                        }
                                        if (popoverId === o.label) {
                                            setShowPopover(false);
                                            setPopoverId('');
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
                        ]),
                    ),

                e(Hiddens, {entries: [{name, value}]})
            ),
        ),
    );
}

export default RadioInputList;
