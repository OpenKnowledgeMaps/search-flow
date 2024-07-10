"use strict";


const {useRef, useEffect, createElement: e} = React;

const SearchFieldORCID = ({value, setValue, required}) => {

    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    return e("div", {style: {marginBottom: 10}},
        e("label", {htmlFor: "searchterm", className: "filter-label"}, "Enter researcher ORCiD (e.g. 0000-1111-2222-3333)"),
        e("input", {
            id: "searchterm_orcid",
            ref: inputRef,
            required: required,
            autoFocus: true,
            type: "text",
            name: "orcid",
            size: "89",
            className: "text-field",
            placeholder: "",
            spellCheck: true,
            value,
            onChange: (e) => setValue(e.target.value),
        })
    )
};

export default SearchFieldORCID;
