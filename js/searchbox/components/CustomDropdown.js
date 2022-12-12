"use strict";

import Hiddens from "./Hiddens.js";
import useOutsideClick from "../hooks/useOutsideClick.js";

const { useState, useRef, createElement: e } = React;

const CustomDropdown = ({ options, name, value, setValue }) => {
  const [open, setOpen] = useState(false);

  const handleOutsideClick = () => {
    setOpen(false);
  };

  const containerRef = useRef(null);
  useOutsideClick(containerRef, handleOutsideClick);

  const selectedOption = options.find((o) => o.id === value);
  const btnLabel = selectedOption ? cutLabel(selectedOption.label, 18)  : "";

  // returns cutted string if it's longer than expected length of symbols
  function cutLabel(label, n){
    return (label.length > n) ? `${label.slice(0, n-1)}...` : label;
  };

  return e(
    "div",
    { className: "btn-group" + (open ? " open" : ""), ref: containerRef },
    e(
      "button",
      {
        type: "button",
        className: "multiselect dropdown-toggle btn btn-default",
        title: btnLabel,
        onClick: () => setOpen((prev) => !prev),
      },

      e("span", { className: "multiselect-selected-text" }, btnLabel),
      " ",
      e("b", { className: "caret" })
    ),
    e(
      "ul",
      {
        className: "multiselect-container dropdown-menu",
        style: { maxHeight: 250, overflow: "hidden auto" },
      },
      ...options.map((o) =>
        e(
          "li",
          {
            className: o.id === value ? "active" : "",
          },
          e(
            "a",
            { tabIndex: 0 },
            e(
              "label",
              { className: "checkbox" },
              e("input", {
                type: "radio",
                value: o.id,
                checked: o.id === value,
                onChange: (e) => {
                  if (e.target.checked) {
                    setValue(o.id);
                    setOpen(false);
                  }
                },
              }),
              " ",
              o.label
            )
          )
        )
      )
    ),
    e(Hiddens, { entries: [{ name, value }] })
  );
};

export default CustomDropdown;
