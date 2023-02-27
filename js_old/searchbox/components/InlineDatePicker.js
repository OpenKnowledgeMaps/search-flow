"use strict";

const e = React.createElement;

const InlineDatePicker = ({ label, value, onChange }) => {
  return e(
    "span",
    { className: "inline_date_picker" },
    e("strong", null, label + ": "),
    e("input", {
      type: "date",
      value,
      onChange: (e) => onChange(e.target.value),
    })
  );
};

export default InlineDatePicker;
