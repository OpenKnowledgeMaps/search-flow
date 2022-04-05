"use strict";

const { useState, useRef } = React;

const DOCTYPES_OPTIONS = [
  // TODO add more
  { id: "4", label: "Audio" },
  { id: "11", label: "Book" },
  { id: "111", label: "Book part" },
  { id: "13", label: "Conference object" },
  { id: "16", label: "Course material" },
  { id: "7", label: "Dataset" },
  { id: "5", label: "Image/video" },
  { id: "12", label: "Journal/newspaper" },
  { id: "121", label: "Journal/newspaper article" },
  { id: "122", label: "Journal/newspaper other content" },
];

const DEFAULT_VAL = "12";

const DoctypesPicker = ({ values, setValues }) => {
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

      e("span", { className: "multiselect-selected-text" }, getLabel(values)),
      " ",
      e("b", { className: "caret" })
    ),
    e(
      "ul",
      {
        className: "multiselect-container dropdown-menu",
        style: { maxHeight: 250, overflow: "hidden auto" },
      },
      e(
        "li",
        {
          className: values.length === DOCTYPES_OPTIONS.length ? "active" : "",
        },
        e(
          "a",
          { tabIndex: 0, className: "multiselect-all" },
          e(
            "label",
            { className: "checkbox" },
            e("input", {
              type: "checkbox",
              checked: values.length === DOCTYPES_OPTIONS.length,
              onChange: (e) => {
                if (!e.target.checked) {
                  setValues([]);
                } else {
                  setValues(DOCTYPES_OPTIONS.map((o) => o.id));
                }
              },
            }),
            " ",
            "Select all"
          )
        )
      ),
      ...DOCTYPES_OPTIONS.map((o) =>
        e(
          "li",
          {
            className: values.includes(o.id) ? "active" : "",
          },
          e(
            "a",
            { tabIndex: 0 },
            e(
              "label",
              { className: "checkbox" },
              e("input", {
                type: "checkbox",
                value: o.id,
                checked: values.includes(o.id),
                onChange: (e) => {
                  if (!e.target.checked) {
                    setValues(values.filter((v) => v !== o.id));
                  } else {
                    setValues([...values, o.id]);
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
    e(Hiddens, {
      entries: values.map((value) => ({
        name: "document_types[]",
        value,
      })),
    })
  );
};

const getLabel = (selectedValues) => {
  if (selectedValues.length === 0) {
    return "No document type";
  }

  if (selectedValues.length === 1) {
    return "1 document type";
  }

  if (selectedValues.length === DOCTYPES_OPTIONS.length) {
    return "All document types";
  }

  return `${selectedValues.length} document types`;
};
