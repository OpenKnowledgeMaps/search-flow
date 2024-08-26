"use strict";

const {useState, useRef, createElement: e} = React;

const OptionsToggle = ({label, icon, onClick}) => {

  return e(
      "div",
      {
          className: "refine-search",
          tabIndex: 0,
          onClick: onClick,
          onKeyDown: (e) => {
              if (e.key === 'Enter') {
                  onClick()
              }
          },
      },
      label,
      " ",
      e("i", {className: `refine-search fa ${icon}`})
  );
};

export default OptionsToggle;
