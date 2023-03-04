"use strict";

import Hiddens from "./Hiddens.js";
import LANG_OPTIONS from "../options/lang.js";
import useOutsideClick from "../hooks/useOutsideClick.js";

const {useState, useRef, createElement: e} = React;


const LanguagePicker = ({values, setValues}) => {

    // variable to store the current document types
    let docTypes = LANG_OPTIONS

    console.log(docTypes)

    const [open, setOpen] = useState(false);

    const [search, setSearch] = useState('');

    const handleOutsideClick = () => {
        setOpen(false);
    };

    const containerRef = useRef(null);
    useOutsideClick(containerRef, handleOutsideClick);

    const btnLabel = getLabel(values);

    if (search.length > 0) {
        const filtered = docTypes.filter((o) => o.label.toString().toLowerCase()
            .includes(search.toString().toLowerCase()));
        docTypes = filtered
    }

    function highlightWord(text, word) {
        if (search.length > 0 && text.toString().toLowerCase().includes(word.toString().toLowerCase())) {
            // Find the index of the first occurrence of the word
            const index = text.toLowerCase().indexOf(word.toLowerCase());

            // If the word is not found, return the original string in an array
            if (index === -1) {
                return text;
            }

            // If the word is at the beginning of the string, return two parts
            if (index === 0) {
                return e(
                    "span", {}, e("span", {style: {fontWeight: 800}}, text.slice(0, word.length)), text.slice(word.length)
                )
            }
            // Split the string into 3 parts iw word in the middle

            return e(
                "span", {}, text.slice(0, index), e("span", {style: {fontWeight: 800}}, text.slice(index, index + word.length)),
                text.slice(index + word.length)
            )
        }
        return text;
    }

    return e('div', {style: {display: 'flex', flexDirection: "column"}},
        e("label", {
            className: 'filter-label',
        }, `select languages(s)`),
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
                        color: "#818181",
                    },
                }, btnLabel),

                e("div", {style: {display: 'flex', flexDirection: 'row', alignItems: 'center'}},

                    (values.length > 0 && !values.includes("all-lang")) &&
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
                        onClick: () => {
                            clearSelectedValues(values)
                        }
                    }),
                ),
            ),

            e(
                "ul",
                {
                    className: "multiselect-container dropdown-menu custom-ul",
                },
                e("div", {style: {position: "relative"}},
                    e(
                        "input",
                        {
                            form: 'none',
                            // name: "notSent",
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
                ...docTypes.map((o) =>
                    o.id !== "all-lang" &&
                    e(
                        "li",
                        {
                            className: values.includes(o.id) ? "active" : "",
                        },
                        e(
                            "a",
                            {tabIndex: 0},
                            e(
                                "label",
                                {
                                    className: "checkbox",
                                    style: {color: "#818181", fontWeight: values.includes(o.id) ? 800 : 400}
                                },
                                e("input", {
                                    type: "checkbox",
                                    value: o.id,
                                    checked: values.includes(o.id),
                                    onChange: (e) => {
                                        if (!e.target.checked) {
                                            setValues(values.filter((v) => v !== o.id));
                                        } else {
                                            if (values.includes("all-lang")) {
                                                values = []
                                            }
                                            setValues([...values, o.id]);
                                        }
                                    },
                                }),
                                values.includes(o.id) &&
                                e("i", {
                                    className: "fa fa-check custom-icons",
                                    style: {position: "absolute", left: 20, top: 13, marginRight: 10}
                                }),
                                // o.label
                                highlightWord(o.label, search)
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

    // if (selectedValues.length === 0) {
    if (!selectedValues.length || selectedValues.length === LANG_OPTIONS.length) {
        // return "No language(s) selected";
        return `All languages`;
    }

    if (LANG_OPTIONS.length > selectedValues.length > 0) {
        let text = '';

        selectedValues.forEach((value) => {
            text += LANG_OPTIONS.find((o) => o.id === value).label + (selectedValues.length > 1 ? ', ' : '');
        });
        return `${cutString(text, 40)} ${selectedValues.length > 1 ? "(" + selectedValues.length + ")" : ""}`;
    }

    return `${selectedValues.length} languages`;
};


// cut string to length and add '...' at the end
function cutString(str, length) {
    if (str.length > length) {
        return str.substring(0, length) + '...';
    }
    return str;
}

// clear all selected values
function clearSelectedValues(values) {
    values.length = 0;
    setValues(...values, "all-lang");
}
