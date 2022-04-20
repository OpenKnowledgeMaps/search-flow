"use strict";

import TIMESPAN_OPTIONS from "./options/timespan.js";

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
  defaultFrom: "1665-01-01",
  defaultTo: new Date().toISOString().split("T")[0],
  // hidden values
  minDescriptionSize: undefined,
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

const isTrue = (value) => value && (value === "true" || parseInt(value) > 0);

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
  if (typeof outerSettings.query === "string") {
    settings.defaultQuery = outerSettings.query;
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
  if (queryParams.has("show_time_range")) {
    settings.showTimeRange = isTrue(queryParams.get("show_time_range"));
  }
  if (queryParams.has("show_doc_types")) {
    settings.showDocTypes = isTrue(queryParams.get("show_doc_types"));
  }
  if (queryParams.has("show_sorting")) {
    settings.showSorting = isTrue(queryParams.get("show_sorting"));
  }

  // default (preselected) values
  if (queryParams.has("document_types[]")) {
    settings.defaultDocTypes = queryParams.getAll("document_types[]");
  }
  if (queryParams.has("sorting")) {
    settings.defaultSorting = queryParams.get("sorting");
  }

  // hidden values
  if (queryParams.has("min_descsize")) {
    settings.minDescriptionSize = queryParams.get("min_descsize");
  }
  if (queryParams.has("title")) {
    settings.titleExpansion = queryParams.get("title");
  }
  if (queryParams.has("abstract")) {
    settings.abstractExpansion = queryParams.get("abstract");
  }
  if (queryParams.has("keywords")) {
    settings.keywordsExpansion = queryParams.get("keywords");
  }

  return settings;
};
