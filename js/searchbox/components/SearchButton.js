"use strict";

const e = React.createElement;

const SearchButton = ({ onClick }) => {
  return e(
    "button",
    {
      type: "submit",
      className: "submit-btn",
      // className: "px-10 py-5 bg-slate-700 hover:bg-slate-500 text-white text-3xl font-bold rounded border",
      onClick: onClick,
    },
    "GO"
  );
};

export default SearchButton;
