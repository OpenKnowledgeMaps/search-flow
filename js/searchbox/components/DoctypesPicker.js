"use strict";

import Hiddens from "./Hiddens.js";
import DOCTYPES_OPTIONS from "../options/doctypes.js";
import PUBMED_DOCTYPES_OPTIONS from "../options/doctypes_pubmed.js";
import useOutsideClick from "../hooks/useOutsideClick.js";
import highlightWorld, {cutString} from "../hooks/helpers.js";


const {useState, useRef, createElement: e} = React;


const DoctypesPicker = ({values, setValues, service}) => {

    // variable to store the current document types
    let docTypes = service === 'base' ? DOCTYPES_OPTIONS : PUBMED_DOCTYPES_OPTIONS

    const [open, setOpen] = useState(false);

    const [search, setSearch] = useState('');

    const handleOutsideClick = () => {
        setOpen(false);
    };

    const containerRef = useRef(null);
    useOutsideClick(containerRef, handleOutsideClick);

    const btnLabel = getLabel(values, service);

    if (search.length > 0) {
        const filtered = docTypes.filter((o) => o.label.toString().toLowerCase()
            .includes(search.toString().toLowerCase()));
        docTypes = filtered
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


    return e('div', {style: {display: 'flex', flexDirection: "column"}},
        e("label", {
            className: 'filter-label',
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
                    type: "button",
                    className: "multiselect dropdown-toggle btn btn-default",
                    title: btnLabel,
                    onClick: () => setOpen((prev) => !prev),
                },
                e("div", {
                        className: "multiselect-selected-text",
                        style: {
                            color: !values.length ? 'red' : "#818181",
                        },
                    },
                    `${cutString(btnLabel, titleLength)} ${values.length > 1 ? "(" + values.length + ")" : ""}`
                ),

                e("div", {style: {display: 'flex', flexDirection: 'row', alignItems: 'center'}},

                    values.length > 0 &&
                    e("i", {
                        style: {marginRight: 25},
                        className: "fa fa-times-circle custom-icons",
                        onClick: () => {
                            clearSelectedValues(values)
                        }
                    }),
                    e("i", {
                        style: {marginLeft: 5, fontSize: 22},
                        className: "fa fa-angle-down custom-icons",
                    }),
                ),
            ),
            e("div", {className: "multiselect-container dropdown-menu custom-div"},
                e("div", {style: {position: "relative", paddingRight: 20}},
                    e(
                        "input",
                        {
                            form: 'none',
                            name: "notSent",
                            className: "text-field",
                            type: "text",
                            placeholder: "Enter document type",
                            style: {width: "100%", position: "relative", height: '36px', paddingLeft: 30},
                            onChange: (e => {
                                setSearch(e.target.value)
                            })
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
                        // className: "multiselect-container dropdown-menu custom-ul",
                        className: "custom-ul",
                    },

                    e(
                        "li",
                        {
                            className: values.length === docTypes.length ? "active" : "",
                        },
                        e(
                            "a",
                            {
                                tabIndex: 0,
                                className: "multiselect-all",
                                onKeyDown: (e) => {
                                    if (e.key === 'Enter') {
                                        if (values.length === docTypes.length) {
                                            setValues([]);
                                        } else {
                                            setValues(docTypes.map((o) => o.id));
                                        }
                                    }
                                },
                            },
                            !search.length &&
                            e(
                                "label",
                                {
                                    className: "checkbox",
                                    style: {
                                        color: '#818181',
                                        fontWeight: values.length === docTypes.length ? 800 : 400
                                    }
                                },
                                e("input", {
                                    name: "multiselect_all",
                                    form: 'none',
                                    type: "checkbox",
                                    checked: values.length === docTypes.length,
                                    onChange: (e) => {
                                        if (!e.target.checked) {
                                            setValues([]);
                                        } else {
                                            setValues(docTypes.map((o) => o.id));
                                        }
                                    },
                                }),
                                values.length === docTypes.length &&
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
                            },
                            e(
                                "a",
                                {
                                    role: "menuitem",
                                    tabIndex: 0,
                                    onKeyDown: (e) => {
                                        console.log(e.key)
                                        if (e.key === 'Enter') {
                                            if (values.includes(o.id)) {
                                                setValues(values.filter((v) => v !== o.id));
                                            } else {
                                                setValues([...values, o.id]);
                                            }
                                            console.log('key down')
                                        }
                                    },
                                },
                                e(
                                    "label",
                                    {
                                        className: "checkbox",
                                        style: {color: "#818181", fontWeight: values.includes(o.id) ? 800 : 400}
                                    },
                                    e("input", {
                                        tabIndex: 0,
                                        type: "checkbox",
                                        value: o.id,
                                        checked: values.includes(o.id),
                                        // onClick: (e) => {
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
                                    // o.label
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
                name: "document_types[]",
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

// clear all selected values
function clearSelectedValues(values) {
    values.length = 0;
}
