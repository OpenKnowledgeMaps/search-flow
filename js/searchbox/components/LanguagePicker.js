"use strict";

import Hiddens from "./Hiddens.js";
import LANG_OPTIONS from "../options/lang.js";
import useOutsideClick from "../hooks/useOutsideClick.js";
import highlightWorld, {cutString} from "../hooks/helpers.js";

const {useState, useRef, createElement: e} = React;


const LanguagePicker = ({values, setValues}) => {

    if (values.length === 0) {
        values.push("all-lang")
    }

    // variable to store the current document types
    let languagesList = LANG_OPTIONS

    const [open, setOpen] = useState(false);

    const [search, setSearch] = useState('');

    const handleOutsideClick = () => {
        setOpen(false);
    };

    const containerRef = useRef(null);
    useOutsideClick(containerRef, handleOutsideClick);

    const btnLabel = getLabel(values);

    if (search.length > 0) {
        const filtered = languagesList.filter((o) => o.label.toString().toLowerCase()
            .includes(search.toString().toLowerCase()));
        languagesList = filtered
    }

    // clear all selected values
    function clearSelectedValues() {
        values.length = 0;
        setValues(...values, ["all-lang"]);
    }

    // cut string to needed length according to screen width
    const titleLengths = {
        default: 30,
        smallScreen: 25,
        extraSmallScreen: 20
    };
    const screenWidth = document.documentElement.clientWidth;
    let titleLength = titleLengths.default;

    if (screenWidth < 768) {
        titleLength = titleLengths.smallScreen;
    }

    if (screenWidth < 450) {
        titleLength = titleLengths.extraSmallScreen;
    }

    return e('div', {
            style: {display: 'flex', flexDirection: "column"},
            role: "combobox",
            "aria-expanded": open,
            "aria-haspopup": 'listbox',
        },
        e("label", {
            className: 'filter-label',
            htmlFor: 'multiselect-dropdown',
        }, `select languages(s)`),
        e(
            "div",
            {
                className: "btn-group" + (open ? " open" : ""),
                style: {marginTop: 5, marginBottom: 5},
                ref: containerRef,
            },
            e(
                "button",
                {
                    type: "button",
                    id: "multiselect-dropdown",
                    className: "multiselect dropdown-toggle btn btn-default",
                    title: btnLabel,
                    "aria-haspopup": "listbox",
                    "aria-expanded": open,
                    onClick: () => setOpen((prev) => !prev),
                },
                e("div", {
                    className: "multiselect-selected-text",
                    style: {
                        color: "#818181",
                    },
                    'aria-label': `${cutString(btnLabel, titleLength)} ${values.length > 1 ? `(${values.length})` : ''}`,
                }, `${cutString(btnLabel, titleLength)} ${values.length > 1 ? "(" + values.length + ")" : ""}`),

                e("div", {
                        style: {display: 'flex', flexDirection: 'row', alignItems: 'center'},
                        'aria-hidden': 'true',
                    },

                    (values.length > 0 && !values.includes("all-lang")) &&
                    e("i", {
                        tabIndex: 0,
                        role: 'button',
                        "aria-label": "clear all selected values",
                        style: {marginRight: 25},
                        className: "fa fa-times-circle custom-icons",
                        onClick: () => {
                            clearSelectedValues()
                        },
                        onKeyDown: (e) => {
                            if (e.key === 'Enter') {
                                clearSelectedValues()
                            }
                        }
                    }),
                    e("i", {
                        style: {marginLeft: 5, fontSize: 22},
                        className: "fa fa-angle-down custom-icons",
                    }),
                ),
            ),

            e("div", {
                    className: "multiselect-container dropdown-menu custom-div",
                    'aria-labelledby': 'multiselect-dropdown',
                    role: 'listbox',
                },
                e("div", {style: {position: "relative", paddingRight: 20}},

                    e(
                        "input",
                        {
                            'aria-label': 'Enter language',
                            form: 'none',
                            className: "text-field",
                            type: "text",
                            placeholder: "Enter language",
                            style: {width: "100%", position: "relative", height: '36px', paddingLeft: 30},
                            onChange: (e => {
                                setSearch(e.target.value)
                            }),
                        },
                    ),
                    e("i", {
                        className: 'fa fa-search custom-icons',
                        style: {position: 'absolute', left: 10, top: 12},
                        'aria-hidden': 'true',
                    }),
                ),
                e(
                    "ul",
                    {
                        id: 'custom-ul',
                        className: "custom-ul",
                        role: 'listbox',
                        tabIndex: 0,
                        "aria-labelledby": "doc-types-heading",
                    },
                    ...languagesList.map((o) =>
                        o.id !== "all-lang" &&
                        e(
                            "li",
                            {
                                className: values.includes(o.id) ? "active" : "",
                                role: 'option',
                                'aria-selected': values.includes(o.id),
                                onKeyDown: (e) => {
                                    //     Sets visual tab focus on the whole ul
                                    if (e.key === 'Escape') {
                                        e.preventDefault() // Prevents scrolling down the page
                                        document.getElementById('custom-ul').focus()
                                    } else if (e.key === ' ' || e.key === 'Spacebar') {
                                        //    Prevents scrolling down the page
                                        e.preventDefault();
                                    }
                                }
                            },
                            e(
                                "a",
                                {
                                    tabIndex: 0,
                                    "aria-label": o.label,
                                    "aria-describedby": `${o.id}-desc`,

                                    onKeyDown: (e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            if (values.includes(o.id)) {
                                                setValues(values.filter((v) => v !== o.id));
                                            } else {
                                                if (values.includes("all-lang")) {
                                                    values = []
                                                }
                                                setValues([...values, o.id]);
                                            }
                                        } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                                            e.preventDefault();
                                            const nextLi = e.target.parentNode.nextElementSibling;
                                            if (nextLi) {
                                                nextLi.querySelector('a').focus();
                                            } else {
                                                const firstLi = e.target.parentNode.parentNode.firstChild;
                                                firstLi.querySelector('a').focus();
                                            }
                                        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                                            e.preventDefault();
                                            const prevLi = e.target.parentNode.previousElementSibling;
                                            if (prevLi) {
                                                prevLi.querySelector('a').focus();
                                            } else {
                                                const lastLi = e.target.parentNode.parentNode.lastChild;
                                                lastLi.querySelector('a').focus();
                                            }
                                        } else if (e.key === ' ') {
                                            e.preventDefault();
                                            if (values.includes(o.id)) {
                                                setValues(values.filter((v) => v !== o.id));
                                            } else {
                                                if (values.includes("all-lang")) {
                                                    values = []
                                                }
                                                setValues([...values, o.id]);
                                            }
                                        }
                                    }
                                },
                                e(
                                    "label",
                                    {
                                        className: "checkbox",
                                        style: {color: "#818181", fontWeight: values.includes(o.id) ? 800 : 400},
                                        'aria-hidden': false,
                                        id: `${o.id}-desc`
                                    },
                                    e("input", {
                                        type: "checkbox",
                                        value: o.id,
                                        checked: values.includes(o.id),
                                        'aria-checked': values.includes(o.id) ? "true" : "false",
                                        onChange: (e) => {
                                            if (e.key !== 'Enter' || e.key !== ' ') {
                                                if (!e.target.checked) {
                                                    setValues(values.filter((v) => v !== o.id));
                                                } else {
                                                    if (values.includes("all-lang")) {
                                                        values = []
                                                    }
                                                    setValues([...values, o.id]);
                                                }
                                            }
                                        },
                                    }),
                                    values.includes(o.id) &&
                                    e("i", {
                                        className: "fa fa-check custom-icons",
                                        style: {position: "absolute", left: 20, top: 13, marginRight: 10}
                                    }),
                                    highlightWorld(o.label, search)
                                )
                            )
                        )
                    )
                )
            )
        ),
        e(Hiddens, {
            entries: values.map((value) => ({
                name: "lang_id[]",
                value,
            })),
        })
    );
};

export default LanguagePicker;

const getLabel = (selectedValues) => {

    if (selectedValues.length === 0 || selectedValues.length === LANG_OPTIONS.length) {
        return `All languages`;
    }

    if (LANG_OPTIONS.length >= selectedValues.length > 0) {
        let text = '';

        selectedValues.forEach((value) => {
            text += LANG_OPTIONS.find((o) => o.id === value).label + (selectedValues.length > 1 ? (selectedValues.indexOf(value) !== selectedValues.length - 1 ? ', ' : '') : '');
        });
        return text
    }
};
