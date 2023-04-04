"use strict";

import {DEFAULT_FROM, DEFAULT_TO, PUBMED_DEFAULT_FROM} from "./options/timespan.js";
import DOCTYPES_OPTIONS from "./options/doctypes.js";
import VIS_TYPE_OPTIONS from "./options/vis_type.js";
import SORTING_OPTIONS from "./options/sorting.js";
import LANG_OPTIONS from "./options/lang.js";
import SERVICES_OPTIONS from "./options/services.js";
import DESK_SIZE_OPTIONS from "./options/desk_size.js";
import PUBMED_DOCTYPES_OPTIONS from "./options/doctypes_pubmed.js";


const pubMedDefaultId = PUBMED_DOCTYPES_OPTIONS
    .filter(option => option.id !== 'retracted publication')
    .map(option => option.id);

// settings table: https://docs.google.com/spreadsheets/d/1C2v8IE_yVkxNHQ5aNC0mebcZ_BsojEeO4ZVn8GcaYsQ/edit#gid=0
export const DEFAULT_SETTINGS = {
  // features on/off
  showOptions: false,
  showTimeRange: true,
  showDocTypes: true,
  showSorting: true,
  showLang: true,
  showService: true,
  showVisType: true,
  showMinDesksize: true,
  showQadvanced: false,
  showCollection: false,

  // default (preselected) values
  defaultQuery: "",
  defaultDocTypes: ["121"], // deafult value for service='base'
  defaultDocTypesPubmed: pubMedDefaultId, // deafult value for service='pubmed'

  defaultSorting: "most-relevant",
  defaultFrom: DEFAULT_FROM, // deafult value for service='base' it changes if service='pubmed'
  defaultTo: DEFAULT_TO,
  defaultLang: ["all-lang"],

  defaultVisType: VIS_TYPE_OPTIONS[0].id,
  minDescriptionSize: DESK_SIZE_OPTIONS[0].id,
  contentProvider: undefined,
  collection: undefined,
  // collection: 'worldwide',
  titleExpansion: "",
  abstractExpansion: "",
  keywordsExpansion: "",
  q_advanced: "",
  // Data Source (new param)
  defaultService: SERVICES_OPTIONS[0].id,  // by default chosen service is 'base'
};

// set of all parameters that will be passed from the search box url to the search url (because of fail page)
// marked "query parameter" in the spreadsheet
export const TRANSFERRED_PARAMS = new Set([
  "show_time_range",
  "show_doc_types",
  "show_sorting",
  "show_lang",
  "show_service",
  "show_vis_type",
  "show_min_descsize",
  "show_q_advanced",
  "show_coll",
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

  if (Array.isArray(outerSettings.lang_id)) {
    settings.defaultLang = outerSettings.lang_id;
  }

  if (typeof outerSettings.service === "string") {
    settings.defaultService = outerSettings.service;
  }

  // hidden values
  if (typeof outerSettings.vis_type === "string") {
    // TODO move to preselected once we implement the toggle
    settings.defaultVisType = outerSettings.vis_type;
  }
  if (["string", "number"].includes(typeof outerSettings.min_descsize)) {
    settings.minDescriptionSize = outerSettings.min_descsize;
  }
  if (typeof outerSettings.repo === "string") {
    settings.contentProvider = outerSettings.repo;
  }
  if (typeof outerSettings.coll === "string") {
    settings.collection = outerSettings.collection;
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
  if (typeof outerSettings.q_advanced === "string") {
    settings.q_advanced = outerSettings.q_advanced;
  }

  return settings;
};

const getQuerySettings = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const settings = {};

  // Search query parameters value
  const search_params = queryParams.searchParams;

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
  if (queryParams.hasValid("show_lang", TYPE_BOOL)) {
    settings.showLang = queryParams.get("show_lang") === "true";
  }
  if (queryParams.hasValid("show_service", TYPE_BOOL)) {
    settings.showService = queryParams.get("show_service") === "true";
  }
  if (queryParams.hasValid("show_vis_type", TYPE_BOOL)) {
    settings.showVisType = queryParams.get("show_vis_type") === "true";
  }
  if (queryParams.hasValid("show_min_descsize", TYPE_BOOL)) {
    settings.showMinDesksize = queryParams.get("show_min_descsize") === "true";
  }
  if (queryParams.hasValid("show_q_advanced", TYPE_BOOL)) {
    settings.showQadvanced = queryParams.get("show_q_advanced") === "true";
  }

  if (queryParams.hasValid("show_coll", TYPE_BOOL)) {
    settings.showCollection = queryParams.get("show_coll") === "true";
  }

  if (queryParams.has("from")) {
    if (queryParams.hasValid("from", TYPE_DATE)) {
      settings.defaultFrom = queryParams.hasValid("from", TYPE_DATE)
          ? queryParams.get("from")
          : undefined;
    } else {
      (queryParams.get('service') === 'pubmed')
          ? settings.defaultFrom = PUBMED_DEFAULT_FROM
          : settings.defaultFrom = DEFAULT_SETTINGS.defaultFrom;
    }
  }

  if (queryParams.has("to")) {
    if (queryParams.hasValid("to", TYPE_DATE)) {
      settings.defaultTo = queryParams.hasValid("to", TYPE_DATE)
          ? queryParams.get("to")
          : undefined;
    } else {
      settings.defaultTo = DEFAULT_SETTINGS.defaultTo;
    }
  }

  if (queryParams.has("document_types[]")) {
    if (queryParams.get('service') === 'base') {
      if (queryParams.hasValid("document_types[]", TYPE_DOCTYPES)) {
        settings.defaultDocTypes = queryParams.getAll("document_types[]");
      } else {
        settings.defaultDocTypes = DEFAULT_SETTINGS.defaultDocTypes;
      }
    } else if (queryParams.get('service') === 'pubmed') {
      if (queryParams.hasValid("document_types[]", TYPE_DOCTYPES_PUBMED)) {
        settings.defaultDocTypes = queryParams.getAll("document_types[]");
      } else {
        settings.defaultDocTypes = DEFAULT_SETTINGS.defaultDocTypesPubmed;
      }
    }
  }

  if (queryParams.hasValid("sorting", TYPE_OPTION(SORTING_OPTIONS))) {
    settings.defaultSorting = queryParams.get("sorting");
  }

  if (queryParams.hasValid("lang_id[]", TYPE_LANGTYPES)) {
    settings.defaultLang = queryParams.getAll("lang_id[]");
  }

  if (queryParams.hasValid("service", TYPE_OPTION(SERVICES_OPTIONS))) {
    settings.defaultService = queryParams.get("service");

  } else {
    settings.defaultService = DEFAULT_SETTINGS.defaultService;
  }
  if (queryParams.hasValid("min_descsize", TYPE_OPTION(DESK_SIZE_OPTIONS))) {
    settings.minDescriptionSize = queryParams.get("min_descsize");
  }

  // hidden values
  if (queryParams.hasValid("vis_type", TYPE_OPTION(VIS_TYPE_OPTIONS))) {
    settings.defaultVisType = queryParams.get("vis_type");
  }

  if (queryParams.hasValid("repo", TYPE_SINGLE)) {
    settings.contentProvider = queryParams.get("repo");
  }
  if (queryParams.hasValid("coll", TYPE_SINGLE)) {
    settings.collection = queryParams.get("coll");
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
  if (queryParams.hasValid("q_advanced", TYPE_SINGLE)) {
    settings.q_advanced = queryParams.get("q_advanced");
  }

  return settings;
};

const TYPE_BOOL = {
  validator: (values) =>
      values.length === 1 && ["true", "false"].includes(values[0]),
  description: "Only the values 'true' and 'false' are allowed.",
};
const TYPE_DOCTYPES = {
  validator: (values) =>
      !values.some((value) => !DOCTYPES_OPTIONS.some((opt) => opt.id === value)),
  description: "Only the BASE document ids (codes) are allowed.",
};

const TYPE_DOCTYPES_PUBMED = {
  validator: (values) =>
      !values.some((value) => !PUBMED_DOCTYPES_OPTIONS.some((opt) => opt.id === value)),
  description: "Only the PUBMED document ids (codes) are allowed.",

};

const TYPE_LANGTYPES = {
  validator: (values) =>
      !values.some((value) => !LANG_OPTIONS.some((opt) => opt.id === value)),
  description: "Only the BASE languages ids (codes) are allowed.",
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
const TYPE_OPTION = (options) => ({
  validator: (values) =>
    values.length === 1 && options.some((opt) => opt.id === values[0]),
  description: `Only the values '${options
    .map((o) => o.id)
    .join("', '")}' are allowed.`,
});
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

    if (name==="lang_id"){

      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set('lang_id', DEFAULT_SETTINGS.defaultLang)
      const newParams = searchParams.toString()
      window.location.replace(`${window.location.pathname}?${newParams}`)
      console.warn(
        `The value of the parameter '${name}' is invalid. ${type.description} Default value will be used.`
      );
    }

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
