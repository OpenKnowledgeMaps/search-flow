"use strict";

import BasicOptions from "./BasicOptions.js";
import DoctypesPicker from "./DoctypesPicker.js";
import Hiddens from "./Hiddens.js";
import Options from "./Options.js";
import OptionsToggle from "./OptionsToggle.js";
import SearchButton from "./SearchButton.js";
import SearchField from "./SearchField.js";
import SearchFieldORCID from "./SearchFieldORCID.js";
import SortingPicker from "./SortingPicker.js";

import { TRANSFERRED_PARAMS, getSettings } from "../settings.js";
import { trackMatomoEvent } from "../hooks/useMatomo.js";
import DataSource from "./DataSource.js";
import VisType from "./VisType.js";
import MetadataQuality from "./MetadataQuality.js";
import LanguagePicker from "./LanguagePicker.js";
import AdvancedSearchField from "./AdvancedSearchField.js";
import CollectionPicker from "./CollectionPicker.js";
import InlineDatePickerFrom from "./InlineDatePickerFrom.js";
import InlineDatePickerTo from "./InlineDatePickerTo.js";

const e = React.createElement;

class SearchBox extends React.Component {
  constructor(props) {
    super(props);

    const settings = getSettings(this.props.settings);

    this.state = {
      showOptions: settings.showOptions,
      formData: {
        query: settings.defaultQuery,
        orcid: settings.defaultORCID,
        visType: settings.defaultVisType,
        timespan: {
          from: settings.defaultFrom,
          fromPubmed: settings.defaultFromPubmed,
          fromBase: settings.defaultFrom,
          to: settings.defaultTo,
        },
        sorting: settings.defaultSorting,
        doctypes: settings.defaultDocTypes, // this value only for service='base'
        articleTypes: settings.defaultArticleTypes, // this value only for service='pubmed'
        lang_id: settings.defaultLang,
        // data source
        service: settings.defaultService,
        minDescriptionSize: settings.minDescriptionSize,
        q_advanced: settings.q_advanced,
        collection: settings.collection,
      },
      settings,
      showOptionsLabel: "Show advanced search options",
      showOptionsIcon: "fa-angle-down",
      errors: {},
    };
  }

  toggleOptions() {
    trackMatomoEvent(
      "Search box",
      this.state.showOptions ? "Hide options" : "Show options",
      "Options toggle"
    );

    this.setState({
      ...this.state,
      showOptions: !this.state.showOptions,
      showOptionsLabel: this.state.showOptions
        ? "Show advanced search options"
        : "Hide advanced search options",
      showOptionsIcon: this.state.showOptions ? "fa-angle-down" : "fa-angle-up",
    });
  }

  updateFormData(key, value) {
    this.setState({
      ...this.state,
      formData: {
        ...this.state.formData,
        [key]: value,
      },
    });
  }

  setFieldErrors(field, errors) {
    this.setState({
      ...this.state,
      errors: {
        ...this.state.errors,
        [field]: errors,
      },
    });
  }

  updateDoctypes(newValue) {
    if (
      this.state.service === "base" ||
      this.state.formData.service === "base"
    ) {
      this.updateFormData("doctypes", newValue);
    } else if (
      this.state.service === "pubmed" ||
      this.state.formData.service === "pubmed"
    ) {
      this.updateFormData("articleTypes", newValue);
    }
  }

  getHiddenEntries() {
    const entries = [];

    const {
      showTimeRange,
      showSorting,
      showDocTypes,
      showLang,
      showService,
      showOptionsButton,
      showVisType,
      showMinDescsize,
      showQadvanced,
      showCollection,
    } = this.state.settings;

    this.state.showOptions
      ? (this.state.showOptionsLabel = "Hide advanced search options")
      : (this.state.showOptionsLabel = "Show advanced search options");

    if (!this.state.showOptions || !showTimeRange) {
      // (this.state.settings.defaultService === 'pubmed' || this.state.formData.service === 'pubmed')
      this.state.formData.service === "pubmed"
        ? entries.push({
            name: "from",
            value: this.state.formData.timespan.fromPubmed,
          })
        : entries.push({
            name: "from",
            value: this.state.formData.timespan.from,
          });
      entries.push({ name: "to", value: this.state.formData.timespan.to });
    }

    if (!this.state.showOptions || !showSorting) {
      entries.push({
        name: "sorting",
        value: this.state.settings.defaultSorting,
      });
    } else {
      entries.push({ name: "sorting", value: this.state.formData.sorting });
    }

    if (showVisType) {
      if (
        this.state.settings.defaultService === "base" ||
        this.state.formData.service === "base"
      ) {
        entries.push({ name: "vis_type", value: this.state.formData.visType });
      }
    } else {
      if (
        this.state.settings.defaultService === "base" ||
        this.state.formData.service === "base"
      ) {
        entries.push({
          name: "vis_type",
          value: this.state.settings.defaultVisType,
        });
      }
      if (
        this.state.settings.defaultService === "pubmed" ||
        this.state.formData.service === "pubmed"
      ) {
        entries.push({ name: "vis_type", value: "overview" });
      }
    }

    if (this.state.formData.service === "base") {
      if (!this.state.showOptions || !showMinDescsize) {
        entries.push({
          name: "min_descsize",
          value: this.state.settings.minDescriptionSize,
        });
      } else {
        entries.push({
          name: "min_descsize",
          value: this.state.formData.minDescriptionSize,
        });
      }
    }

    if (!this.state.showOptions || !showDocTypes) {
      if (
        this.state.formData.service === "base" ||
        this.state.service === "base"
      ) {
        this.state.formData.doctypes.forEach((value) => {
          entries.push({ name: "document_types[]", value });
        });
      } else if (
        this.state.formData.service === "pubmed" ||
        this.state.service === "pubmed"
      ) {
        this.state.formData.articleTypes.forEach((value) => {
          entries.push({ name: "article_types[]", value });
        });
      }
    }

    if (this.state.formData.service === "base") {
      if (!this.state.showOptions || !showLang) {
        this.state.formData.lang_id.forEach((value) => {
          entries.push({ name: "lang_id[]", value });
        });
      }
    }

    if (!showService) {
      entries.push({
        name: "service",
        value: this.state.settings.defaultService,
      });
    } else {
      entries.push({ name: "service", value: this.state.formData.service });
    }

    const { contentProvider } = this.state.settings;
    const { titleExpansion, abstractExpansion } = this.state.settings;
    const { keywordsExpansion } = this.state.settings;
    const { q_advanced } = this.state.settings;
    const collection = this.state.settings.collection;

    if (contentProvider) {
      entries.push({ name: "repo", value: contentProvider });
    }

    if (
      (this.state.formData.service === "base" ||
        this.state.service === "base") &&
      (!this.state.showOptions || !showCollection)
    ) {
      if (collection && collection.length <= 3) {
        entries.push({ name: "coll", value: collection });
      }
    }

    if (titleExpansion) {
      entries.push({ name: "title", value: titleExpansion });
    }
    if (abstractExpansion) {
      entries.push({ name: "abstract", value: abstractExpansion });
    }
    if (keywordsExpansion) {
      entries.push({ name: "keywords", value: keywordsExpansion });
    }
    if (!this.state.showOptions || !showQadvanced) {
      entries.push({
        name: "q_advanced",
        value: this.state.settings.q_advanced,
      });
    } else {
      entries.push({
        name: "q_advanced",
        value: this.state.formData.q_advanced,
      });
    }

    if (this.state.formData.service === "orcid") {
      entries.push({ name: "orcid", value: this.state.formData.orcid });
    }

    return entries;
  }

  getFormActionUrl() {
    const queryParams = new URLSearchParams(window.location.search);

    Array.from(queryParams.keys()).forEach((param) => {
      if (!TRANSFERRED_PARAMS.has(param)) {
        queryParams.delete(param);
      }
    });

    queryParams.append("service", this.state.formData.service);
    queryParams.append("embed", "true");

    const queryString = queryParams.toString();

    return `search?${queryString}`;
  }

  render() {
    const {
      showTimeRange,
      showSorting,
      showDocTypes,
      showLang,
      showService,
      showOptionsButton,
      showVisType,
      showMinDescsize,
      showQadvanced,
      showCollection,
    } = this.state.settings;
    const hasOptions =
      showTimeRange ||
      showSorting ||
      showDocTypes ||
      showLang ||
      showVisType ||
      showMinDescsize ||
      showQadvanced ||
      showCollection;

    const actionUrl = this.getFormActionUrl();
    const hiddenEntries = this.getHiddenEntries();

    // handle event for changing timespan from/to without unpredictable behaviour
    const handleFromChange = (event) => {
      if (this.state.formData.service === "pubmed") {
        this.state.formData.timespan.fromPubmed = event;
      }
      if (this.state.formData.service === "base") {
        this.state.formData.timespan.from = event;
      }
    };

    const handleToChange = (event) => {
      this.state.formData.timespan.to = event;
    };

    // check if service is pubmed and if so, remove vis_type and min_descsize from hiddenEntries, this filters for base only
    if (this.state.formData.service === "pubmed") {
      // check if hiddenEntries contains vis_type, min_descsize
      hiddenEntries.forEach((entry, index) => {
        if (entry.name === "vis_type") {
          // set new "vis_type" value to “overview” for pubmed
          hiddenEntries[index].value = "overview";
        }
        if (entry.name === "min_descsize") {
          // remove min_descsize from hiddenEntries
          hiddenEntries.splice(index, 1);
        }
      });
    }

    const hasErrors = Object.keys(this.state.errors).length > 0;

    return e(
      "div",
      {
        className: "search_box",
        "aria-label": "Open Knowledge Maps Search Box",
      },
      e(
        "form",
        {
          action: actionUrl,
          method: "POST",
          target: "_self",
          "aria-label": "Open Knowledge Maps Search Box form",
        },
        showService &&
          e(DataSource, {
            value: this.state.formData.service,
            setValue: this.updateFormData.bind(this, "service"),
          }),
        hasOptions &&
          showOptionsButton &&
          this.state.formData.service !== "orcid" &&
          e(OptionsToggle, {
            label: this.state.showOptionsLabel,
            icon: this.state.showOptionsIcon,
            onClick: this.toggleOptions.bind(this),
          }),
        this.state.showOptions &&
          e(
            Options,
            { style: { marginBottom: 15 } },
            e(
              BasicOptions,
              null,
              showVisType &&
                this.state.formData.service === "base" &&
                e(VisType, {
                  value: this.state.formData.visType,
                  setValue: this.updateFormData.bind(this, "visType"),
                }),
              showSorting &&
                e(SortingPicker, {
                  value: this.state.formData.sorting,
                  setValue: this.updateFormData.bind(this, "sorting"),
                }),
              showDocTypes &&
                e(DoctypesPicker, {
                  values:
                    this.state.formData.service === "pubmed"
                      ? this.state.formData.articleTypes
                      : this.state.formData.doctypes,
                  setValues: this.updateDoctypes.bind(this),
                  service: this.state.formData.service,
                }),
              showLang &&
                this.state.formData.service === "base" &&
                e(LanguagePicker, {
                  values: this.state.formData.lang_id,
                  setValues: this.updateFormData.bind(this, "lang_id"),
                }),
              showTimeRange &&
                e(
                  "div",
                  null,
                  e(
                    "div",
                    {
                      className: "filter-label",
                    },
                    `Select time range`
                  ),
                  e(
                    "div",
                    {
                      className: "time-range-container",
                    },
                    e(InlineDatePickerFrom, {
                      service: this.state.formData.service,
                      name: "from",
                      valueBase: this.state.formData.timespan.from,
                      valuePubmed: this.state.formData.timespan.fromPubmed,
                      setValue: handleFromChange,
                    }),
                    e(InlineDatePickerTo, {
                      service: this.state.formData.service,
                      name: "to",
                      value: this.state.formData.timespan.to,
                      setValueTo: handleToChange,
                    })
                  )
                ),
              showCollection &&
                this.state.formData.service === "base" &&
                e(CollectionPicker, {
                  values: this.state.formData.collection,
                  setValues: this.updateFormData.bind(this, "collection"),
                }),

              showMinDescsize &&
                this.state.formData.service === "base" &&
                e(MetadataQuality, {
                  value: this.state.formData.minDescriptionSize,
                  setValue: this.updateFormData.bind(
                    this,
                    "minDescriptionSize"
                  ),
                })
            ),
            showQadvanced &&
              this.state.formData.service === "base" &&
              e(AdvancedSearchField, {
                value: this.state.formData.q_advanced,
                setValue: this.updateFormData.bind(this, "q_advanced"),
              })
          ),
        this.state.formData.service != "orcid" &&
          e(SearchField, {
            value: this.state.formData.query,
            setValue: this.updateFormData.bind(this, "query"),
            required: !(
              this.state.formData.service === "base" &&
              showQadvanced &&
              this.state.formData.q_advanced.length > 0
            ),
          }),
        this.state.formData.service === "orcid" &&
          e(SearchFieldORCID, {
            required: true,
            value: this.state.formData.orcid,
            setValue: this.updateFormData.bind(this, "orcid"),
            errors: this.state.errors.orcid,
            setErrors: this.setFieldErrors.bind(this, 'orcid'),
          }),
        e(Hiddens, { entries: hiddenEntries }),
        e(SearchButton, { disabled: hasErrors })
      )
    );
  }
}

export default SearchBox;
