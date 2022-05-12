"use strict";

const TIMESPAN_OPTIONS = [
  { id: "any-time", label: "All time" },
  { id: "last-month", label: "Last month" },
  { id: "last-year", label: "Last year" },
  { id: "user-defined", label: "Custom range" },
];

export default TIMESPAN_OPTIONS;

export const DEFAULT_FROM = "1665-01-01";
export const DEFAULT_TO = new Date().toISOString().split("T")[0];

export const getTimespanBounds = (timespan) => {
  switch (timespan) {
    case "last-month": {
      const newFromDate = new Date(DEFAULT_TO);
      newFromDate.setMonth(newFromDate.getMonth() - 1);

      return { from: newFromDate.toISOString().split("T")[0], to: DEFAULT_TO };
    }
    case "last-year": {
      const newFromDate = new Date(DEFAULT_TO);
      newFromDate.setFullYear(newFromDate.getFullYear() - 1);

      return { from: newFromDate.toISOString().split("T")[0], to: DEFAULT_TO };
    }
    default:
      return { from: DEFAULT_FROM, to: DEFAULT_TO };
  }
};
