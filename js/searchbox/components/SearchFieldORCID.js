"use strict";

const { useRef, useEffect, createElement: e } = React;

const SearchFieldORCID = ({
  value,
  setValue,
  required,
  errors,
  setErrors,
  validators,
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleBlur = () => {
    const newValue = inputRef.current.value;

    if (validators) {
      const newErrors = validators.reduce((acc, validator) => {
        const error = validator(newValue);
        if (error) {
          acc.push(error);
        }
        return acc;
      }, []);

      setErrors(newErrors);
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
    errors &&
      errors.length > 0 &&
      e(
        "div",
        { style: { color: "red", marginTop: 5 }, "aria-live": "polite" },
        errors.map((error) => e("div", { key: error }, error))
      )
  );
};

export default SearchFieldORCID;
