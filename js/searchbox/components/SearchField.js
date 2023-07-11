"use strict";


// const e = React.createElement;
const {useRef, useEffect, createElement: e} = React;

const SearchField = ({value, setValue, required}) => {

    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current.focus();
    }, []);
    
    // document.onLoad = () => {
    //     document.getElementById("searchterm").focus();
    // }


    return e("div", {style: {marginBottom: 10}},
        e("label", {htmlFor: "searchterm", className: "filter-label"}, "Enter search query (e.g. digital education)"),
        e("input", {
            id: "searchterm",
            ref: inputRef,
            required: required,
            autoFocus: true,
            type: "text",
            name: "q",
            size: "89",
            className: "text-field",
            placeholder: "",
            spellCheck: true,
            value,
            onChange: (e) => setValue(e.target.value),
        })
    )
};

export default SearchField;
