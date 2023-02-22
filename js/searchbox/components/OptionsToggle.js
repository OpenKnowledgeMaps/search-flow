"use strict";

// const e = React.createElement;
const {useState, useRef, createElement: e} = React;

const OptionsToggle = ({label, icon, onClick}) => {

  return e(
      "div",
      {className: "refine-search", onClick: onClick},
      label,
      " ",
      e("i", {className: `refine-search fa ${icon}`})
  );
};

export default OptionsToggle;
