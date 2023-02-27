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

import { TRANSFERRED_PARAMS, getSettings } from "../settings.js";
import { trackMatomoEvent } from "../hooks/useMatomo.js";
import { getTimespanBounds } from "../options/timespan.js";
import LangPicker from "./LangPicker.js";
import DataSource from "./DataSource.js";
import VisType from "./VisType.js";
import MetadataQuality from "./MetadataQuality.js";

const e = React.createElement;

class SearchBox extends React.Component {
  constructor(props) {
    super(props);

    const settings = getSettings(this.props.settings);

    this.state = {
      showOptions: settings.showOptions,
      formData: {
        query: settings.defaultQuery,
        visType: settings.defaultVisType,
        timespan: {
          type: settings.defaultTimespan,
          from: settings.defaultFrom,
          to: settings.defaultTo,
        },
        sorting: settings.defaultSorting,
        doctypes: settings.defaultDocTypes,
        lang_id: settings.defaultLang,
        // data source
        service: settings.defaultService,
        minDescriptionSize: settings.minDescriptionSize
      },
      settings,
      showOptionsLabel: "Show advanced search options",
      showOptionsIcon: "fa-angle-down",
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
      showOptionsLabel: this.state.showOptions ? "Show advanced search options" : "Hide advanced search options",
      showOptionsIcon: this.state.showOptions ? "fa-angle-down" : "fa-angle-up",
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
    const { from, to } = getTimespanBounds(newValue);

    this.setState({
      ...this.state,
      formData: {
        ...this.state.formData,
        timespan: {
          ...this.state.formData.timespan,
          type: newValue,
          from: from,
          to: to,
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

  updateVisType(newValue) {
    this.setState({
      ...this.state,
      formData: {
        ...this.state.formData,
        visType: newValue,
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

  updateLang(newValue) {
    this.setState({
      ...this.state,
      formData: {
        ...this.state.formData,
        lang_id: newValue,
      },
    });
  }

  updateService(newValue) {
    this.setState({
      ...this.state,
      formData: {
        ...this.state.formData,
        service: newValue,
      },
    });
  }

  updateMinDesksize(newValue) {
    this.setState({
      ...this.state,
      formData: {
        ...this.state.formData,
        minDescriptionSize: newValue,
      },
    });
  }

  getHiddenEntries() {
    const entries = [
      // probably required by backend, otherwise useless - same val as "service"
      // {name: "optradio", value: "base"},
    ];

    // time range
    const {type: rangeType, from, to} = this.state.formData.timespan;
    entries.push({name: "from", value: from});
    entries.push({name: "to", value: to});

    const {
      showTimeRange,
      showSorting,
      showDocTypes,
      showLang,
      showService,
      showVisType,
      showMinDesksize
    } = this.state.settings;
    if (!this.state.showOptions || !showTimeRange) {
      entries.push({name: "time_range", value: rangeType});
    }
    if (!this.state.showOptions || !showSorting) {
      entries.push({name: "sorting", value: this.state.formData.sorting});
    }
    if (!this.state.showOptions || !showDocTypes) {
      this.state.formData.doctypes.forEach((value) => {
        entries.push({name: "document_types[]", value});
      });
    }
    if (!this.state.showOptions || !showLang) {
      entries.push({name: "lang_id", value: this.state.formData.lang_id});
    }
    if (!showService) {
      entries.push({name: "service", value: this.state.formData.service});
    } else {
      entries.push({name: "service", value: this.state.formData.service});
    }

    if (showVisType) {
      entries.push({name: "vis_type", value: this.state.formData.visType});
    }

    // const {minDescriptionSize, contentProvider} = this.state.settings;
    const {contentProvider} = this.state.settings;
    const {titleExpansion, abstractExpansion} = this.state.settings;
    const {keywordsExpansion, collection} = this.state.settings;
    const {q_advanced} = this.state.settings;


    // if (minDescriptionSize) {
    //   entries.push({name: "min_descsize", value: minDescriptionSize});
    // }

    if (showMinDesksize) {
      entries.push({name: "min_descsize", value: this.state.formData.minDescriptionSize});
    }
    
    if (contentProvider) {
      entries.push({name: "repo", value: contentProvider});
    }
    if (collection) {
      entries.push({name: "coll", value: collection});
    }
    if (titleExpansion) {
      entries.push({name: "title", value: titleExpansion});
    }
    if (abstractExpansion) {
      entries.push({ name: "abstract", value: abstractExpansion });
    }
    if (keywordsExpansion) {
      entries.push({ name: "keywords", value: keywordsExpansion });
    }
    if (q_advanced) {
      entries.push({ name: "q_advanced", value: q_advanced })
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
    const {
      showTimeRange,
      showSorting,
      showDocTypes,
      showLang,
      showService,
      showVisType,
      showMinDesksize
    } = this.state.settings;
    const hasOptions = showTimeRange || showSorting || showDocTypes || showLang || showVisType || showMinDesksize;

    const actionUrl = this.getFormActionUrl();
    const hiddenEntries = this.getHiddenEntries();

    const showExtraTimePickers =
        showTimeRange && this.state.formData.timespan.type === "custom-range";

    return e(
        "div",
        {className: "search_box"},
        e(
            "form",
            {
              action: actionUrl,
              method: "POST",
              target: "_self",
            },
            showService &&
            e(DataSource, {
              value: this.state.formData.service,
              setValue: this.updateService.bind(this),
            }),
            hasOptions &&
            e(OptionsToggle, {
              label: this.state.showOptionsLabel,
              icon: this.state.showOptionsIcon,
              onClick: this.toggleOptions.bind(this),
            }),
            this.state.showOptions &&
            e(
                Options,
                null,
                e(
                    BasicOptions,
                    null,
                    // showTimeRange &&
                    // e(TimespanPicker, {
                    //   value: this.state.formData.timespan.type,
                    //   setValue: this.updateTimespanType.bind(this),
                    // }),
                    (showVisType && this.state.formData.service === "base") &&
                    e(VisType, {
                      value: this.state.formData.visType,
                      setValue: this.updateVisType.bind(this),
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
                    }),
                    showLang &&
                    e(LangPicker, {
                      value: this.state.formData.lang_id,
                      setValue: this.updateLang.bind(this),
                    }),
                ),
                // e(
                //     AdvancedOptions,
                //     null,
                //     showExtraTimePickers &&
                //     e(
                //         "div",
                //         {className: "options_timespan"},
                //         e(InlineDatePicker, {
                //           label: "From",
                //           value: this.state.formData.timespan.from,
                //           onChange: this.updateTimespanFrom.bind(this),
                //         }),
                //         e(InlineDatePicker, {
                //           label: "To",
                //           value: this.state.formData.timespan.to,
                //           onChange: this.updateTimespanTo.bind(this),
                //         })
                //     )
                // )
                (showMinDesksize && this.state.formData.service === "base") &&
                e(MetadataQuality, {
                  value: this.state.formData.minDescriptionSize,
                  setValue: this.updateMinDesksize.bind(this),
                }),
            ),
            e(SearchField, {
              value: this.state.formData.query,
              setValue: this.updateQuery.bind(this),
            }),
            e(Hiddens, {entries: hiddenEntries}),
            e(SearchButton)
        )
    );
  }
}

export default SearchBox;
