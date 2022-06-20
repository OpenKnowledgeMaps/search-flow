"use strict";

const TIMESPAN_OPTIONS = [
  { id: "any-time", label: "All time" },
  { id: "last-month", label: "Last month" },
  { id: "last-year", label: "Last year" },
  // formerly known as "user-defined" (this name is still used in the legacy form)
  // renamed to "custom-range" as a UX request
  { id: "custom-range", label: "Custom range" },
];

export default TIMESPAN_OPTIONS;

export const DEFAULT_FROM = "1665-01-01";
export const DEFAULT_TO = new Date().toISOString().split("T")[0];

export const getTimespanBounds = (
  timespan,
  customFrom = DEFAULT_FROM,
  customTo = DEFAULT_TO
) => {
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
    case "custom-range": {
      return { from: customFrom, to: customTo };
    }
    default:
      return { from: DEFAULT_FROM, to: DEFAULT_TO };
  }
};
