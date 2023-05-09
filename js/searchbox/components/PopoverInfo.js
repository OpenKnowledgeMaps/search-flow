"use strict";

import useOutsideClick from "../hooks/useOutsideClick.js";

const {useState, useRef, useEffect, createElement: e} = React;

function PopoverInfo({o, options}) {
    const [showPopover, setShowPopover] = useState(false);
    const [popoverId, setPopoverId] = useState();

    // for useOutsideClick hook
    const handleOutsideClick = () => {
        setShowPopover(false);
        setPopoverId('');
    };

    const containerRef = useRef(null);

    useOutsideClick(containerRef, handleOutsideClick);

    return e('div', {
            key: `${o.label}-${o.infoTitle}-popover`,
            id: `${o.label}-${o.infoTitle}-popover`,
            className: 'popover__wrapper',
            ref: containerRef,
        },
        e('div', {
                key: `${o.id}-${o.label}-${options.indexOf(o)}-info-title`,
                id: `${o.label}`,
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
                    setPopoverId(o.label);
                    setShowPopover(!showPopover);
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
            },
            e('div', {
                className: 'popover__title'
            }, ['BASE', 'PubMed'].includes(o.infoTitle) ? o.infoTitle : ""),
            e('div', {
                className: 'popover__message',
                id: 'popover-message'
            }, o.infoContent),
        ),
    )
}

export default PopoverInfo;
