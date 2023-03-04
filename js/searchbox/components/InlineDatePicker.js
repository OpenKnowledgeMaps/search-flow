"use strict";

const e = React.createElement;

const InlineDatePicker = ({ label, value, onChange }) => {
  return e(
      "div",
      {className: "inline_date_picker filter-label"},
      e("strong", null, label),
      e("input", {
          className: "date-field",
          type: "date",
          value,
          onChange: (e) => onChange(e.target.value),
      })
  );
};

export default InlineDatePicker;
