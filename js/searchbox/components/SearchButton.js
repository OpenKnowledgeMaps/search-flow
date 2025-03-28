"use strict";

const e = React.createElement;

const SearchButton = ({ onClick, disabled }) => {
  return e(
    "button",
    {
      type: "submit",
      className: "submit-btn",
      onClick,
      disabled
    },
    "Create Overview"
  );
};

export default SearchButton;
