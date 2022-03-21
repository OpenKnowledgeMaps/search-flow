"use strict";

const Options = ({ children }) => {
  return e("div", { className: "options" }, children);
};

const BasicOptions = ({ children }) => {
  return e("div", { className: "basic_options" }, children);
};

const AdvancedOptions = ({ children }) => {
  return e("div", { className: "advanced_options" }, children);
};

const TIMESPAN_OPTIONS = [
  { id: "any-time", label: "All time" },
  { id: "last-month", label: "Last month" },
  { id: "last-year", label: "Last year" },
  { id: "user-defined", label: "Custom range" },
];

const TimespanPicker = ({ value, setValue }) => {
  return e(CustomDropdown, {
    options: TIMESPAN_OPTIONS,
    name: "time_range",
    value,
    setValue,
  });
};

const SORTING_OPTIONS = [
  { id: "most-relevant", label: "Most relevant" },
  { id: "most-recent", label: "Most recent" },
];

const SortingPicker = ({ value, setValue }) => {
  return e(CustomDropdown, {
    options: SORTING_OPTIONS,
    name: "sorting",
    value,
    setValue,
  });
};

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

const CustomDropdown = ({ options, name, value, setValue }) => {
  const [open, setOpen] = useState(false);

  const handleOutsideClick = () => {
    setOpen(false);
  };

  const containerRef = useRef(null);
  useOutsideClick(containerRef, handleOutsideClick);

  return e(
    "div",
    { className: "btn-group" + (open ? " open" : ""), ref: containerRef },
    e(
      "button",
      {
        type: "button",
        className: "multiselect dropdown-toggle btn btn-default",
        title: "TODO",
        onClick: () => setOpen((prev) => !prev),
      },

      e(
        "span",
        { className: "multiselect-selected-text" },
        options.find((o) => o.id === value).label
      ),
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

const Hiddens = ({ entries }) => {
  return e(
    React.Fragment,
    null,
    ...entries.map((entry) =>
      e("input", { type: "hidden", name: entry.name, value: entry.value })
    )
  );
};
