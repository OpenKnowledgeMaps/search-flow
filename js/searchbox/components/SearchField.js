"use strict";

const e = React.createElement;

const SearchField = ({ value, setValue }) => {
  return e("input", {
    required: true,
    autoFocus: true,
    type: "text",
    name: "q",
    size: "89",
    className: "text-field",
    id: "searchterm",
    placeholder: "Enter your search term",
    spellCheck: true,
    value,
    onChange: (e) => setValue(e.target.value),
  });
};

export default SearchField;
