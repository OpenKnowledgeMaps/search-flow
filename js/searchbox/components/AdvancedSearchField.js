"use strict";

import useOutsideClick from "../hooks/useOutsideClick.js";

const {useState, useRef, useEffect, createElement: e} = React;

const AdvancedSearchField = ({value, setValue}) => {
    const [showPopover, setShowPopover] = useState(false);
    const [popoverId, setPopoverId] = useState('');

    // message for popover
    const infoMessage = `This optional search field enables you to search directly in individual metadata fields available in BASE. For example, to create a visualisation for an individual author you can search in the dcorcid field e.g. dcorcid:0000-0002-1894-5040. If you would like to restrict your search to a specific region please use the dccoverage field e.g. dccoverage:”Rocky Mountains”.`

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

    return e("div",
        null,
        e("label", {htmlFor: "searchterm", className: "filter-label"}, "Enter advanced query - optional"),
        e('div', {
            key: `q-advanced-popover`,
            id: `q-advanced-popover`,
            className: 'popover__wrapper',
        }, [
            e('div', {
                    key: `q-advanced-info-title`,
                    style: {fontWeight: 800, fontSize: 10, cursor: 'pointer'},
                    className: 'info-title',
                    role: 'button',
                    tabIndex: 0,
                    ref: containerRef,
                    'aria-label': 'Information',
                    onKeyDown: (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            setShowPopover(!showPopover);
                            setPopoverId(`q-advanced-popover`);
                        } else if (e.key === 'Escape') {
                            setShowPopover(false);
                            setPopoverId('');
                        }
                    },
                    onClick: () => {
                        if (popoverId === `q-advanced-popover`) {
                            setShowPopover(false);
                            setPopoverId('');
                        } else {
                            setShowPopover(true);
                            setPopoverId(`q-advanced-popover`);
                        }
                    },
                }, '(MORE',
                e("i", {
                    style: {marginLeft: 5},
                    className: "fa fa-info-circle",
                }),
                ")"),
            (popoverId === `q-advanced-popover` && showPopover) &&
            e('div', {
                style: {
                    visible: showPopover ? 'visible' : 'hidden',
                    marginTop: 5,
                    marginLeft: 4,
                },
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
                e('div', {className: "popover__title"}),
                e('div', {className: "popover__message"}, infoMessage),
            ]),
        ]),
        e("input", {
            required: false,
            autoFocus: false,
            type: "text",
            name: "q_advanced",
            size: "89",
            className: "text-field",
            id: "searchterm_advanced",
            spellCheck: true,
            value,
            onChange: (e) => setValue(e.target.value),
        })
    )
};

export default AdvancedSearchField;
