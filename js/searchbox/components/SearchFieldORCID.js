"use strict";

const { useRef, useState, useEffect, createElement: e } = React;

const SearchFieldORCID = ({ value, setValue, required, errors, setErrors }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleBlur = () => {
    const newValue = inputRef.current.value;

    const isValid = /^\d{4}-\d{4}-\d{4}-\d{4}$/.test(newValue);
    if (!isValid && newValue.length > 0) {
      setErrors(["Please enter a valid ORCiD"]);
    } else {
      setErrors([""]);
    }
  };

  return e(
    "div",
    { style: { marginBottom: 10 } },
    e(
      "label",
      { htmlFor: "searchterm_orcid", className: "filter-label" },
      "Enter researcher ORCiD (e.g. 0000-1111-2222-3333)"
    ),
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
      onChange: handleChange,
      onBlur: handleBlur,
    }),
    errors && errors.length > 0 &&
      e(
        "div",
        { style: { color: "red", marginTop: 5 }, 'aria-live': "polite" },
        errors.map(error => e("div", { key: error }, error))
      )
  );
};

export default SearchFieldORCID;
