"use strict";

import TIMESPAN_OPTIONS, {
  DEFAULT_FROM,
  DEFAULT_TO,
  getTimespanBounds,
} from "./options/timespan.js";
import DOCTYPES_OPTIONS from "./options/doctypes.js";

// settings table: https://docs.google.com/spreadsheets/d/1C2v8IE_yVkxNHQ5aNC0mebcZ_BsojEeO4ZVn8GcaYsQ/edit#gid=0
export const DEFAULT_SETTINGS = {
  // features on/off
  showOptions: false,
  showTimeRange: true,
  showDocTypes: true,
  showSorting: true,
  // default (preselected) values
  defaultQuery: "",
  defaultDocTypes: ["121"],
  defaultSorting: "most-relevant",
  defaultTimespan: TIMESPAN_OPTIONS[0].id,
  defaultFrom: DEFAULT_FROM,
  defaultTo: DEFAULT_TO,
  // hidden values
  minDescriptionSize: undefined,
  contentProvider: undefined,
  titleExpansion: "",
  abstractExpansion: "",
  keywordsExpansion: "",
};

// set of all parameters that will be passed from the search box url to the search url (because of fail page)
// marked "query parameter" in the spreadsheet
export const TRANSFERRED_PARAMS = new Set([
  "show_time_range",
  "show_doc_types",
  "show_sorting",
]);

/**
 * Returns a settings object. The object should contain the same properties as the DEFAULT_SETTINGS
 * object, where some properties' values are overriden with config and query settings.
 *
 * @param {object} outerSettings object with parameters defined in the post_data global variable
 * @returns {object} object with final settings
 */
export const getSettings = (outerSettings) => {
  const configSettings = getConfigSettings(outerSettings);
  const querySettings = getQuerySettings();

  // default settings < config (js object) settings < query (url) settings
  const settings = {
    ...DEFAULT_SETTINGS,
    ...configSettings,
    ...querySettings,
  };

  return settings;
};

const getConfigSettings = (outerSettings = {}) => {
  const settings = {};

  // features on/off
  if (typeof outerSettings.showOptions === "boolean") {
    settings.showOptions = outerSettings.showOptions;
  }

  // default (preselected) values
  if (typeof outerSettings.q === "string") {
    // the value is also in outerSettings.query, but it's somewhat escaped
    settings.defaultQuery = outerSettings.q.replace(/\\/g, "");
  }
  if (typeof outerSettings.time_range === "string") {
    settings.defaultTimespan = outerSettings.time_range;
  }
  if (typeof outerSettings.from === "string") {
    settings.defaultFrom = outerSettings.from;
  }
  if (typeof outerSettings.to === "string") {
    settings.defaultTo = outerSettings.to;
  }
  if (Array.isArray(outerSettings.document_types)) {
    settings.defaultDocTypes = outerSettings.document_types;
  }
  if (typeof outerSettings.sorting === "string") {
    settings.defaultSorting = outerSettings.sorting;
  }

  // hidden values
  if (["string", "number"].includes(typeof outerSettings.min_descsize)) {
    settings.minDescriptionSize = outerSettings.min_descsize;
  }
  if (typeof outerSettings.repo === "string") {
    settings.contentProvider = outerSettings.repo;
  }
  if (typeof outerSettings.title === "string") {
    settings.titleExpansion = outerSettings.title;
  }
  if (typeof outerSettings.abstract === "string") {
    settings.abstractExpansion = outerSettings.abstract;
  }
  if (typeof outerSettings.keywords === "string") {
    settings.keywordsExpansion = outerSettings.keywords;
  }

  return settings;
};

const getQuerySettings = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const settings = {};

  // features on/off
  if (queryParams.hasValid("show_time_range", TYPE_BOOL)) {
    settings.showTimeRange = queryParams.get("show_time_range") === "true";
  }
  if (queryParams.hasValid("show_doc_types", TYPE_BOOL)) {
    settings.showDocTypes = queryParams.get("show_doc_types") === "true";
  }
  if (queryParams.hasValid("show_sorting", TYPE_BOOL)) {
    settings.showSorting = queryParams.get("show_sorting") === "true";
  }

  // default (preselected) values
  if (queryParams.hasValid("time_range", TYPE_TIMESPAN)) {
    settings.defaultTimespan = queryParams.get("time_range");

    const customFrom = queryParams.hasValid("from", TYPE_DATE)
      ? queryParams.get("from")
      : undefined;
    const customTo = queryParams.hasValid("to", TYPE_DATE)
      ? queryParams.get("to")
      : undefined;

    const { from, to } = getTimespanBounds(
      settings.defaultTimespan,
      customFrom,
      customTo
    );

    settings.defaultFrom = from;
    settings.defaultTo = to;
  }
  if (queryParams.hasValid("document_types[]", TYPE_DOCTYPES)) {
    settings.defaultDocTypes = queryParams.getAll("document_types[]");
  }
  if (queryParams.hasValid("sorting", TYPE_SORTING)) {
    settings.defaultSorting = queryParams.get("sorting");
  }

  // hidden values
  if (queryParams.hasValid("min_descsize", TYPE_INT(0))) {
    settings.minDescriptionSize = queryParams.get("min_descsize");
  }
  if (queryParams.hasValid("repo", TYPE_SINGLE)) {
    settings.contentProvider = queryParams.get("repo");
  }
  if (queryParams.hasValid("title", TYPE_SINGLE)) {
    settings.titleExpansion = queryParams.get("title");
  }
  if (queryParams.hasValid("abstract", TYPE_SINGLE)) {
    settings.abstractExpansion = queryParams.get("abstract");
  }
  if (queryParams.hasValid("keywords", TYPE_SINGLE)) {
    settings.keywordsExpansion = queryParams.get("keywords");
  }

  return settings;
};

const TYPE_BOOL = {
  validator: (values) =>
    values.length === 1 && ["true", "false"].includes(values[0]),
  description: "Only the values 'true' and 'false' are allowed.",
};
const TYPE_TIMESPAN = {
  validator: (values) =>
    !values.some((value) => !TIMESPAN_OPTIONS.some((opt) => opt.id === value)),
  description: `Only the values '${TIMESPAN_OPTIONS.map((o) => o.id).join(
    "', '"
  )}' are allowed.`,
};
const TYPE_DOCTYPES = {
  validator: (values) =>
    !values.some((value) => !DOCTYPES_OPTIONS.some((opt) => opt.id === value)),
  description: "Only the BASE document ids (codes) are allowed.",
};
const TYPE_INT = (from, to) => ({
  validator: (values) => {
    if (!values.length === 1) {
      return false;
    }

    const num = parseInt(values[0]);
    if (isNaN(num)) {
      return false;
    }

    if (typeof from === "number" && num < from) {
      return false;
    }

    if (typeof to === "number" && num > to) {
      return false;
    }

    return true;
  },
  description: `The value must be a number${parseRange(from, to)}.`,
});
const TYPE_SORTING = {
  validator: (values) =>
    values.length === 1 && ["most-relevant", "most-recent"].includes(values[0]),
  description: "Only the values 'most-relevant' and 'most-recent' are allowed.",
};
const TYPE_SINGLE = {
  validator: (values) => values.length <= 1,
  description: "Specifying multiple values is prohibited.",
};
const TYPE_DATE = {
  validator: (values) =>
    values.length === 1 &&
    values[0].match(/^[12]?\d{3}-\d{2}-\d{2}$/) &&
    !isNaN(new Date(values[0])),
  description: "Only valid dates in format YYYY-MM-DD are allowed.",
};
const TYPE_ANY = {
  validator: () => true,
  description: "Any value can be used.",
};

URLSearchParams.prototype.hasValid = function (name, type) {
  if (!this.has(name)) {
    return false;
  }

  const values = this.getAll(name);
  if (!type.validator(values)) {
    console.warn(
      `The value of the parameter '${name}' is invalid. ${type.description} Default value will be used.`
    );

    return false;
  }

  return true;
};

const parseRange = (from, to) => {
  if (typeof from === "number" && typeof to === "number") {
    return ` in range from ${from} to ${to}`;
  }

  if (typeof from === "number") {
    return ` greater than or equal to ${from}`;
  }

  if (typeof to === "number") {
    return ` less than or equal to ${from}`;
  }

  return "";
};
