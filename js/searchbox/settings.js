"use strict";

// settings table: https://docs.google.com/spreadsheets/d/1C2v8IE_yVkxNHQ5aNC0mebcZ_BsojEeO4ZVn8GcaYsQ/edit#gid=0
export const DEFAULT_SETTINGS = {
  // features on/off
  showTimeRange: true,
  showDocTypes: true,
  showSorting: true,
  // default (preselected) values
  defaultDocTypes: ["121"],
  defaultSorting: "most-relevant",
  defaultFrom: "1665-01-01",
  defaultTo: new Date().toISOString().split("T")[0],
  // hidden values
  minDescriptionSize: undefined,
  titleExpansion: "",
  abstractExpansion: "",
  keywordsExpansion: "",
};

const isTrue = (value) => value && (value === "true" || parseInt(value) > 0);

export const getSettings = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const settings = { ...DEFAULT_SETTINGS };

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
