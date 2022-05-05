"use strict";

import AdvancedOptions from "./AdvancedOptions.js";
import BasicOptions from "./BasicOptions.js";
import DoctypesPicker from "./DoctypesPicker.js";
import Hiddens from "./Hiddens.js";
import InlineDatePicker from "./InlineDatePicker.js";
import Options from "./Options.js";
import OptionsToggle from "./OptionsToggle.js";
import SearchButton from "./SearchButton.js";
import SearchField from "./SearchField.js";
import SortingPicker from "./SortingPicker.js";
import TimespanPicker from "./TimespanPicker.js";

import {
  DEFAULT_SETTINGS,
  TRANSFERRED_PARAMS,
  getSettings,
} from "../settings.js";
import { trackMatomoEvent } from "../hooks/useMatomo.js";

const e = React.createElement;

class SearchBox extends React.Component {
  constructor(props) {
    super(props);

    const settings = getSettings(this.props.settings);

    this.state = {
      showOptions: settings.showOptions,
      formData: {
        query: settings.defaultQuery,
        timespan: {
          type: settings.defaultTimespan,
          from: settings.defaultFrom,
          to: settings.defaultTo,
        },
        sorting: settings.defaultSorting,
        doctypes: settings.defaultDocTypes,
      },
      settings,
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
    });
  }

  updateQuery(newValue) {
    this.setState({
      ...this.state,
      formData: {
        ...this.state.formData,
        query: newValue,
      },
    });
  }

  updateTimespanType(newValue) {
    if (this.state.formData.timespan.type === newValue) {
      return;
    }
    let newFrom = DEFAULT_SETTINGS.defaultFrom;
    let newTo = DEFAULT_SETTINGS.defaultTo;
    if (newValue === "last-month") {
      let newFromDate = new Date(DEFAULT_SETTINGS.defaultTo);
      newFromDate.setMonth(newFromDate.getMonth() - 1);
      newFrom = newFromDate.toISOString().split("T")[0];
    }
    if (newValue === "last-year") {
      let newFromDate = new Date(DEFAULT_SETTINGS.defaultTo);
      newFromDate.setFullYear(newFromDate.getFullYear() - 1);
      newFrom = newFromDate.toISOString().split("T")[0];
    }

    this.setState({
      ...this.state,
      formData: {
        ...this.state.formData,
        timespan: {
          ...this.state.formData.timespan,
          type: newValue,
          from: newFrom,
          to: newTo,
        },
      },
    });
  }

  updateTimespanFrom(newValue) {
    this.setState({
      ...this.state,
      formData: {
        ...this.state.formData,
        timespan: {
          ...this.state.formData.timespan,
          from: newValue,
        },
      },
    });
  }

  updateTimespanTo(newValue) {
    this.setState({
      ...this.state,
      formData: {
        ...this.state.formData,
        timespan: {
          ...this.state.formData.timespan,
          to: newValue,
        },
      },
    });
  }

  updateSorting(newValue) {
    this.setState({
      ...this.state,
      formData: {
        ...this.state.formData,
        sorting: newValue,
      },
    });
  }

  updateDoctypes(newValue) {
    this.setState({
      ...this.state,
      formData: {
        ...this.state.formData,
        doctypes: newValue,
      },
    });
  }

  getHiddenEntries() {
    const entries = [
      // probably required by backend, otherwise useless - same val as "service"
      { name: "optradio", value: "base" },
      { name: "lang_id", value: "all" },
    ];

    // time range
    const { type: rangeType, from, to } = this.state.formData.timespan;
    entries.push({ name: "from", value: from });
    entries.push({ name: "to", value: to });

    const { showTimeRange, showSorting, showDocTypes } = this.state.settings;
    if (!this.state.showOptions || !showTimeRange) {
      entries.push({ name: "time_range", value: rangeType });
    }
    if (!this.state.showOptions || !showSorting) {
      entries.push({ name: "sorting", value: this.state.formData.sorting });
    }
    if (!this.state.showOptions || !showDocTypes) {
      this.state.formData.doctypes.forEach((value) => {
        entries.push({ name: "document_types[]", value });
      });
    }

    const { minDescriptionSize, contentProvider } = this.state.settings;
    const { titleExpansion, abstractExpansion } = this.state.settings;
    const { keywordsExpansion } = this.state.settings;

    if (minDescriptionSize) {
      entries.push({ name: "min_descsize", value: minDescriptionSize });
    }
    if (contentProvider) {
      entries.push({ name: "repo", value: contentProvider });
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

    return entries;
  }

  getFormActionUrl() {
    const queryParams = new URLSearchParams(window.location.search);

    Array.from(queryParams.keys()).forEach((param) => {
      if (!TRANSFERRED_PARAMS.has(param)) {
        queryParams.delete(param);
      }
    });

    queryParams.append("service", "base");
    queryParams.append("embed", "true");

    const queryString = queryParams.toString();

    return `search?${queryString}`;
  }

  render() {
    const { showTimeRange, showSorting, showDocTypes } = this.state.settings;
    const hasOptions = showTimeRange || showSorting || showDocTypes;

    const actionUrl = this.getFormActionUrl();
    const hiddenEntries = this.getHiddenEntries();

    return e(
      "div",
      { className: "search_box" },
      e(
        "form",
        {
          action: actionUrl,
          method: "POST",
          target: "_self",
        },
        hasOptions &&
          e(OptionsToggle, {
            label: "Refine your search",
            onClick: this.toggleOptions.bind(this),
          }),
        this.state.showOptions &&
          e(
            Options,
            null,
            e(
              BasicOptions,
              null,
              showTimeRange &&
                e(TimespanPicker, {
                  value: this.state.formData.timespan.type,
                  setValue: this.updateTimespanType.bind(this),
                }),
              showSorting &&
                e(SortingPicker, {
                  value: this.state.formData.sorting,
                  setValue: this.updateSorting.bind(this),
                }),
              showDocTypes &&
                e(DoctypesPicker, {
                  values: this.state.formData.doctypes,
                  setValues: this.updateDoctypes.bind(this),
                })
            ),
            e(
              AdvancedOptions,
              null,
              this.state.formData.timespan.type === "user-defined" &&
                e(
                  "div",
                  { className: "options_timespan" },
                  e(InlineDatePicker, {
                    label: "From",
                    value: this.state.formData.timespan.from,
                    onChange: this.updateTimespanFrom.bind(this),
                  }),
                  e(InlineDatePicker, {
                    label: "To",
                    value: this.state.formData.timespan.to,
                    onChange: this.updateTimespanTo.bind(this),
                  })
                )
            )
          ),
        e(SearchField, {
          value: this.state.formData.query,
          setValue: this.updateQuery.bind(this),
        }),
        e(Hiddens, { entries: hiddenEntries }),
        e(SearchButton)
      )
    );
  }
}

export default SearchBox;
