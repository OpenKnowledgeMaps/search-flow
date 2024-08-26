"use strict";

const e = React.createElement;

const SearchButton = ({ onClick }) => {
  return e(
    "button",
    {
      type: "submit",
      className: "submit-btn",
      onClick: onClick,
    },
    "Create Overview"
  );
};

export default SearchButton;
