"use strict";

import Hiddens from "./Hiddens.js";
import DOCTYPES_OPTIONS from "../options/doctypes.js";
import PUBMED_DOCTYPES_OPTIONS from "../options/doctypes_pubmed.js";
import useOutsideClick from "../hooks/useOutsideClick.js";
import highlightWorld from "../hooks/helpers.js";


const {useState, useRef, createElement: e} = React;


const DoctypesPicker = ({values, setValues, service}) => {

    let hiddenEntriesName = service === 'base' ? "document_types[]" : 'article_types[]'

    // set optional docs values instead empty array
    const optionalDocs = service === 'base' ? ['121'] : PUBMED_DOCTYPES_OPTIONS.filter(option => option.id !== 'retracted publication').map(option => option.id)

    // variable to store the current document types
    let docTypes = service === 'base' ? DOCTYPES_OPTIONS : PUBMED_DOCTYPES_OPTIONS

    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');

    const handleOutsideClick = () => {
        setOpen(false);
    };

    // for closing dropdown on outside click
    const containerRef = useRef(null);
    useOutsideClick(containerRef, handleOutsideClick);

    const btnLabel = getLabel(values, service);

    if (search.length > 0) {
        docTypes = docTypes.filter((o) => o.label.toString().toLowerCase()
            .includes(search.toString().toLowerCase()))
    }

    function clearSelectedValues(values) {
        // set optional docs values instead empty array
        setValues(optionalDocs);
    }

    function isEqual(array1, array2) {
        return !(array1.length === array2.length && array1.every((value, index) => value === array2[index]));
    }

    // compare values and docTypes to set checked or not to select all doctypes
    function compare() {
        return values.length === docTypes.length && values.every((value, index) => value === docTypes[index].id)
    }

    return e('div', {
            style: {display: 'flex', flexDirection: "column"},
            role: "combobox",
            "aria-expanded": open,
            "aria-haspopup": 'listbox',
            "aria-label": "Select doctype(s) filter",
        },
        e("label", {
            className: 'filter-label',
            htmlFor: 'multiselect-dropdown-doctypes',
        }, `select doctype(s)`),
        e(
            "div",
            {
                className: "btn-group" + (open ? " open" : ""),
                style: {marginTop: 5, marginBottom: 5},
                ref: containerRef
            },
            e(
                "button",
                {
                    id: "multiselect-dropdown-doc",
                    type: "button",
                    className: "multiselect dropdown-toggle btn btn-default",
                    title: btnLabel,
                    "aria-haspopup": "listbox",
                    "aria-expanded": open,
                    onClick: () => setOpen((prev) => !prev),
                    onKeyDown: (e) => {
                        if (e.key === 'Escape') {
                            e.preventDefault();
                            document.getElementById('multiselect-dropdown-doc').focus();
                            setOpen(false)
                        }
                    }
                },
                e("div", {
                        className: "multiselect-selected-text",
                        style: {
                            color: !values.length ? 'red' : "#818181",
                        },
                        'aria-label': `${btnLabel}`,
                    },
                    e('span', null, btnLabel),
                ),
                e("span", {className: 'multiselect-selected-text-count'},
                    `${values.length > 1 ? "(" + values.length + ")" : ""}`
                ),

                e("div", {
                        style: {display: 'flex', flexDirection: 'row', alignItems: 'center'},
                        'aria-hidden': true,
                    },

                    isEqual(values, optionalDocs) &&
                    e("i", {
                        id: "doc-clear-all-btn",
                        tabIndex: 0,
                        role: 'button',
                        style: {marginRight: 25},
                        "aria-label": "clear all selected types",
                        className: "fa fa-times-circle custom-icons",
                        onClick: () => {
                            clearSelectedValues(values)
                        },
                        onKeyDown: (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                clearSelectedValues(values)
                                document.getElementById('multiselect-dropdown-doc').focus();
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
                    'aria-labelledby': 'multiselect-dropdown-doctypes'
                },
                e("div", {style: {position: "relative", paddingRight: 20}},
                    e(
                        "input",
                        {
                            id: "doc-search-input",
                            form: 'none',
                            name: "notSent",
                            className: "text-field",
                            type: "text",
                            placeholder: "Enter document type",
                            style: {width: "100%", position: "relative", height: '36px', paddingLeft: 30},
                            onChange: (e => {
                                setSearch(e.target.value)
                            }),
                            onKeyDown: (e) => {
                                if (e.key === 'Escape') {
                                    e.preventDefault();
                                    document.getElementById('multiselect-dropdown-doc').focus();
                                    setOpen(false)
                                }
                                if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === "Tab") {
                                    e.preventDefault();
                                    document.getElementById("doctypes-all").focus()
                                }
                                if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                                    e.preventDefault();
                                    document.getElementById(`doctypes-${docTypes[docTypes.length - 1].id}`).focus()
                                }
                                if (e.shiftKey && e.key === 'Tab') {
                                    if (document.getElementById(`doc-clear-all-btn`)) {
                                        document.getElementById(`doc-clear-all-btn`).focus()
                                    } else {
                                        document.getElementById('multiselect-dropdown-doc').focus();
                                    }

                                }
                            }
                        },
                    ),
                    e("i", {
                        className: 'fa fa-search custom-icons',
                        style: {position: 'absolute', left: 10, top: 12}
                    }),
                ),
                e(
                    "ul",
                    {
                        id: 'custom-ul-doctypes',
                        className: "custom-ul",
                        role: 'listbox',
                        title: 'Doctypes list',
                        "aria-labelledby": "doctypes-heading",
                        "aria-multiselectable": true,
                        "aria-live": "polite",
                        "aria-controls": "doctypes-selector",
                    },
                    e(
                        "li",
                        {
                            className: values.length === docTypes.length ? "active" : "",
                            id: `doctypes-all`,
                            role: 'option',
                            tabIndex: 0,
                            'aria-selected': values,
                            onKeyDown: (e) => {
                                if (e.key === 'Escape') {
                                    e.preventDefault();
                                    document.getElementById('doc-search-input').focus();
                                }
                                if (e.key === ' ' || e.key === 'Enter') {
                                    e.preventDefault();
                                    if (values.length === docTypes.length) {
                                        setValues([]);
                                    } else {
                                        setValues(docTypes.map((o) => o.id));
                                    }
                                }
                                if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === "Tab") {
                                    e.preventDefault();
                                    document.getElementById(`doctypes-${docTypes[0].id}`).focus();
                                }
                                if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || (e.shiftKey && e.key === 'Tab')) {
                                    e.preventDefault();
                                    document.getElementById('doc-search-input').focus();
                                }
                            },
                        },
                        e(
                            "a", null,
                            docTypes.length > 0 &&
                            e(
                                "label",
                                {
                                    className: "checkbox",
                                    style: {
                                        color: '#818181',
                                        fontWeight: compare() ? 800 : 400
                                    }
                                },
                                e("input", {
                                    name: "multiselect_all",
                                    form: 'none',
                                    type: "checkbox",
                                    checked: compare(),
                                    onChange: (e) => {
                                        if (!e.target.checked) {
                                            setValues([]);
                                        } else {
                                            setValues(docTypes.map((o) => o.id));
                                        }
                                    },
                                }),
                                compare() &&
                                e("i", {
                                    className: "fa fa-check custom-icons",
                                    style: {position: "absolute", left: 20, top: 13, marginRight: 10}
                                }),
                                "Select all"
                            )
                        )
                    ),
                    ...docTypes.map((o) =>
                        e(
                            "li",
                            {
                                className: values.includes(o.id) ? "active" : "",
                                id: `doctypes-${o.id}`, // add the id attribute
                                role: 'option',
                                tabIndex: 0,
                                'aria-selected': values.includes(o.id),
                                onKeyDown: (e) => {
                                    if (e.key === 'Escape') {
                                        e.preventDefault();
                                        document.getElementById('doc-search-input').focus();
                                    }
                                    if (e.key === ' ' || e.key === 'Enter') {
                                        e.preventDefault();
                                        if (values.includes(o.id)) {
                                            setValues(values.filter((v) => v !== o.id));
                                        } else {
                                            setValues([...values, o.id]);
                                        }
                                    }
                                    if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === "Tab") {
                                        e.preventDefault();
                                        let index = docTypes.findIndex((v) => v.id === o.id);
                                        if (index === docTypes.length - 1) {
                                            document.getElementById('doc-search-input').focus();
                                        } else {
                                            const nextIndex = index === docTypes.length - 1 ? 0 : index + 1;
                                            document.getElementById(`doctypes-${docTypes[nextIndex].id}`).focus();
                                        }
                                    }
                                    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || (e.shiftKey && e.key === 'Tab')) {
                                        e.preventDefault();
                                        let index = docTypes.findIndex((v) => v.id === o.id);
                                        if (index === 0) {
                                            document.getElementById('doc-search-input').focus();
                                        } else {
                                            const prevIndex = index === 0 ? docTypes.length - 1 : index - 1;
                                            document.getElementById(`doctypes-${docTypes[prevIndex].id}`).focus();
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
                                        style: {color: "#818181", fontWeight: values.includes(o.id) ? 800 : 400},
                                        'aria-hidden': false,
                                        id: `${o.id}-label-doctypes`,
                                    },
                                    e("input", {
                                        tabIndex: 0,
                                        type: "checkbox",
                                        value: o.id,
                                        checked: values.includes(o.id),
                                        'aria-checked': values.includes(o.id) ? "true" : "false",
                                        'aria-labelledby': `${o.id}-label-doctypes`,
                                        onChange: (e) => {
                                            if (e.key !== 'Enter') {
                                                if (!e.target.checked) {
                                                    setValues(values.filter((v) => v !== o.id));
                                                } else {
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
                name: hiddenEntriesName,
                value,
            })),
        })
    );
};

export default DoctypesPicker;

const getLabel = (selectedValues, service) => {
    let docTypes = service === 'base' ? DOCTYPES_OPTIONS : PUBMED_DOCTYPES_OPTIONS

    if (selectedValues.length === 0) {
        return "No type(s) selected";
    }

    if (docTypes.length >= selectedValues.length > 0) {
        let text = '';
        selectedValues.forEach((value) => {
            text += docTypes.find((o) => o.id === value).label + (selectedValues.length > 1 ? (selectedValues.indexOf(value) !== selectedValues.length - 1 ? ', ' : '') : '');
        });
        return text;
    }
};
