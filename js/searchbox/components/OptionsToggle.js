"use strict";

const e = React.createElement;

const OptionsToggle = ({ label, onClick }) => {
  return e(
    "div",
    { className: "refine-search", onClick: onClick },
    label,
    " ",
    e("i", { className: "refine-search fa fa-angle-down" })
  );
};

export default OptionsToggle;
