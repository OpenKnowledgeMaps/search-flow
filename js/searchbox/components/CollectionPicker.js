"use strict";

import Hiddens from "./Hiddens.js";
import COLL_OPTIONS from "../options/coll_options.js";
import useOutsideClick from "../hooks/useOutsideClick.js";
import highlightWorld from "../hooks/helpers.js";

const {useState, useRef, createElement: e} = React;


const CollectionPicker = ({values, setValues}) => {

    if (!values) {
        values = 'worldwide';
    }

    // variable to store the current collection types
    let collOptionsList = COLL_OPTIONS

    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');

    const handleOutsideClick = () => {
        setOpen(false);
    };

    const containerRef = useRef(null);
    useOutsideClick(containerRef, handleOutsideClick);

    const btnLabel = getLabel(values);

    if (search.length > 0) {
        collOptionsList = collOptionsList.filter((o) => o.label.toString().toLowerCase()
            .includes(search.toString().toLowerCase()))
    }


    return e('div', {
            style: {display: 'flex', flexDirection: "column"},
            role: "combobox",
            "aria-expanded": open,
            "aria-haspopup": 'listbox',
            "aria-label": "Select continent or country filter",
        },
        e("label", {
            className: 'filter-label',
            htmlFor: 'multiselect-dropdown-coll',
        }, `select continent or country`),
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
                    id: "multiselect-dropdown-coll",
                    className: "multiselect dropdown-toggle btn btn-default",
                    title: btnLabel,
                    "aria-haspopup": "listbox",
                    "aria-expanded": open,
                    onClick: () => setOpen((prev) => !prev),
                    onKeyDown: (e) => {
                        if (e.key === 'Escape') {
                            e.preventDefault();
                            document.getElementById('multiselect-dropdown-coll').focus();
                            setOpen(false)
                        }
                    }
                },
                e("div", {
                        className: "multiselect-selected-text",
                        'aria-label': `${btnLabel}`,
                    },
                    e('span', null, btnLabel),
                ),
                e("div", {
                        style: {display: 'flex', flexDirection: 'row', alignItems: 'center'},
                        'aria-hidden': 'true',
                    },

                    e("i", {
                        style: {marginLeft: 5, fontSize: 22},
                        className: "fa fa-angle-down custom-icons",
                    }),
                ),
            ),

            e("div", {
                    className: "multiselect-container dropdown-menu custom-div",
                    'aria-labelledby': 'multiselect-dropdown-coll',
                    role: 'listbox',
                },
                e("div", {style: {position: "relative", paddingRight: 20}},

                    e(
                        "input",
                        {
                            id: "coll-search-input",
                            'aria-label': 'Enter continent or country',
                            form: 'none',
                            className: "text-field",
                            type: "text",
                            placeholder: "Enter continent or country",
                            style: {width: "100%", position: "relative", height: '36px', paddingLeft: 30},
                            onChange: (e => {
                                setSearch(e.target.value)
                            }),
                            onKeyDown: (e) => {
                                if (e.key === 'Escape') {
                                    e.preventDefault();
                                    document.getElementById('multiselect-dropdown-coll').focus();
                                    setOpen(false)
                                }
                                if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === "Tab") {
                                    e.preventDefault();
                                    document.getElementById(`coll-${collOptionsList[0].id}`).focus()
                                }
                                if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                                    e.preventDefault();
                                    document.getElementById(`coll-${collOptionsList[collOptionsList.length - 1].id}`).focus()
                                }
                                if (e.shiftKey && e.key === 'Tab') {
                                    document.getElementById('multiselect-dropdown-coll').focus();
                                }
                            }
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
                        id: 'custom-ul-coll',
                        className: "custom-ul",
                        role: 'listbox',
                        title: 'Collections list',
                        "aria-labelledby": "Collection-heading",
                        "aria-multiselectable": true,
                        "aria-live": "polite",
                        "aria-controls": "Coll-selector",
                    },
                    ...collOptionsList.map((o) =>
                        e(
                            "li",
                            {
                                id: `coll-${o.id}`,
                                className: values === o.id ? "active" : "",
                                role: 'option',
                                tabIndex: 0,
                                'aria-selected': values === o.id,
                                onKeyDown: (e) => {
                                    if (e.key === 'Escape') {
                                        e.preventDefault();
                                        document.getElementById('coll-search-input').focus();
                                    }
                                    if (e.key === ' ' || e.key === 'Enter') {
                                        e.preventDefault();
                                        setValues(o.id);
                                    }
                                    if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === "Tab") {
                                        e.preventDefault();
                                        let index = collOptionsList.findIndex((v) => v.id === o.id);
                                        if (index === collOptionsList.length - 1) {
                                            document.getElementById('coll-search-input').focus();
                                        } else {
                                            document.getElementById(`coll-${collOptionsList[index + 1].id}`).focus();
                                        }
                                    }
                                    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || (e.shiftKey && e.key === 'Tab')) {
                                        e.preventDefault();
                                        let index = collOptionsList.findIndex((v) => v.id === o.id);
                                        if (index === 0) {
                                            document.getElementById('coll-search-input').focus();
                                        } else {
                                            document.getElementById(`coll-${collOptionsList[index - 1].id}`).focus()
                                        }
                                    }
                                }
                            },
                            e(
                                "a", null,
                                e(
                                    "label",
                                    {
                                        className: "checkbox",
                                        style: {color: "#818181", fontWeight: values === o.id ? 800 : 400},
                                        'aria-hidden': false,
                                        id: `${o.id}-desc`
                                    },
                                    e("input", {
                                        type: "checkbox",
                                        defaultValue: o.id,
                                        checked: values === o.id,
                                        'aria-checked': values === o.id ? "true" : "false",
                                        onChange: (e) => {
                                            if (e.key !== 'Enter' || e.key !== ' ') {
                                                setValues(o.id);
                                            }
                                        },
                                    }),
                                    values === o.id &&
                                    e("i", {
                                        className: "fa fa-circle custom-icons",
                                        style: {
                                            position: "absolute",
                                            left: 20,
                                            top: 15,
                                            marginRight: 10,
                                            fontSize: 10
                                        }
                                    }),
                                    highlightWorld(o.label, search)
                                )
                            )
                        )
                    )
                )
            )
        ),
        !values.includes('worldwide') &&
        e(Hiddens, {entries: [{name: 'coll', value: values}]})
    );
};

export default CollectionPicker;

const getLabel = (selectedValues) => {

    let text = '';

    // get label from COLL_OPTIONS by selectedValues
    COLL_OPTIONS.forEach((option) => {
            if (option.id === selectedValues) {
                text = option.label;
            }
        }
    );

    return text
};
