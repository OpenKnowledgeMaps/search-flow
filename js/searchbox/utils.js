"use strict";

const { useEffect } = React;

const useOutsideClick = (ref, handler) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handler();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [ref]);
};

const getTimespanDates = (timespan) => {
  switch (timespan.type) {
    case "last-month":
      // TODO
      return ["", ""];
    case "last-year":
      // TODO
      return ["", ""];
    case "user-defined":
      // TODO
      return [timespan.from, timespan.to];
    case "any-time":
    default:
      return ["", ""];
  }
};

const getDoctypesString = (doctypes) => {
  return doctypes.map((t) => `document_types[]=${t}`).join("&");
};
