"use strict";

// import AdvancedOptions from "./AdvancedOptions.js";
import BasicOptions from "./BasicOptions.js";
import DoctypesPicker from "./DoctypesPicker.js";
import InlineDatePicker from "./InlineDatePicker.js";
import Hiddens from "./Hiddens.js";
import Options from "./Options.js";
import OptionsToggle from "./OptionsToggle.js";
import SearchButton from "./SearchButton.js";
import SearchField from "./SearchField.js";
import SortingPicker from "./SortingPicker.js";

import {TRANSFERRED_PARAMS, getSettings} from "../settings.js";
import {trackMatomoEvent} from "../hooks/useMatomo.js";
import DataSource from "./DataSource.js";
import VisType from "./VisType.js";
import MetadataQuality from "./MetadataQuality.js";
import PUBMED_DOCTYPES_OPTIONS from "../options/doctypes_pubmed.js";
import LanguagePicker from "./LanguagePicker.js";
import {DEFAULT_FROM, DEFAULT_TO, PUBMED_DEFAULT_FROM} from "../options/timespan.js";
import AdvancedSearchField from "./AdvancedSearchField.js";
// import {getServiceBounds} from "../options/service_bounds.js";


const e = React.createElement;


const pubMedDefaultId = []

PUBMED_DOCTYPES_OPTIONS.forEach((option) => {
  if (option.id !== 'retracted publication') {
    pubMedDefaultId.push(option.id)
  }
});

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
          from: settings.defaultFrom,
          to: settings.defaultTo,
        },
        sorting: settings.defaultSorting,
        doctypes: settings.defaultDocTypes, // this value only for service='base'
        doctypesPubmed: pubMedDefaultId, // this value only for service='pubmed'
        lang_id: settings.defaultLang,
        // data source
        service: settings.defaultService,
        minDescriptionSize: settings.minDescriptionSize,
        q_advanced: settings.q_advanced,
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

  updateAdvancedQuery(newValue) {
    this.setState({
      ...this.state,
      formData: {
        ...this.state.formData,
        q_advanced: newValue,
      },
    });
  }

  updateTimespanFrom(newValue) {
    this.setState({
      ...this.state,
      formData: {
        ...this.state.formData,
        timespan: {
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
    let docTypesType = []
    let from = ''
    let to = DEFAULT_TO
    if (newValue === 'base') {
      docTypesType = this.state.settings.defaultDocTypes
      from = DEFAULT_FROM
    } else if (newValue === 'pubmed') {
      docTypesType = pubMedDefaultId
      from = PUBMED_DEFAULT_FROM
    }

    // const {docTypesType} = getServiceBounds(newValue);

    this.setState({
      ...this.state,
      formData: {
        ...this.state.formData,
        service: newValue,
        doctypes: docTypesType,
        timespan: {
          from: from,
          to: to,
        }
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

    // no needed form has fields from/to
    // // time range
    // const {type: rangeType, from, to} = this.state.formData.timespan;
    // entries.push({name: "from", value: from});
    // entries.push({name: "to", value: to});

    const {
      showTimeRange,
      showSorting,
      showDocTypes,
      showLang,
      showService,
      showVisType,
      showMinDesksize,
      showQadvanced
    } = this.state.settings;

    if (!this.state.showOptions || !showTimeRange) {
      entries.push({name: "from", value: this.state.settings.defaultFrom});
      entries.push({name: "to", value: this.state.settings.defaultTo});
    }

    if (!this.state.showOptions || !showSorting) {
      entries.push({name: "sorting", value: this.state.settings.defaultSorting});
    } else {
      entries.push({name: "sorting", value: this.state.formData.sorting});
    }
    if (this.state.formData.service === 'base') {
      if (!this.state.showOptions || !showVisType) {
        entries.push({name: "vis_type", value: this.state.settings.defaultVisType});
      } else {
        entries.push({name: "vis_type", value: this.state.formData.visType});
      }
    }
    if (this.state.formData.service === 'base') {
      if (!this.state.showOptions || !showMinDesksize) {
        entries.push({name: "min_descsize", value: this.state.settings.minDescriptionSize});
      } else {
        entries.push({name: "min_descsize", value: this.state.formData.minDescriptionSize});
      }

    }
    if (!this.state.showOptions || !showDocTypes) {
      this.state.formData.doctypes.forEach((value) => {
        entries.push({name: "document_types[]", value});
      });
    }
    if (!this.state.showOptions || !showLang) {
      this.state.formData.lang_id.forEach((value) => {
        entries.push({name: "lang_id[]", value});
      });
    }

    if (!showService) {
      entries.push({name: "service", value: this.state.settings.defaultService});
    } else {
      entries.push({name: "service", value: this.state.formData.service});
    }

    // if (showVisType) {
    //   entries.push({name: "vis_type", value: this.state.formData.visType});
    // }

    // const {minDescriptionSize, contentProvider} = this.state.settings;
    const {contentProvider} = this.state.settings;
    const {titleExpansion, abstractExpansion} = this.state.settings;
    const {keywordsExpansion, collection} = this.state.settings;
    // const {q_advanced} = this.state.settings;


    // if (minDescriptionSize) {
    //   entries.push({name: "min_descsize", value: minDescriptionSize});
    // }

    // if (showMinDesksize) {
    //   entries.push({name: "min_descsize", value: this.state.formData.minDescriptionSize});
    // }

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
      entries.push({name: "abstract", value: abstractExpansion});
    }
    if (keywordsExpansion) {
      entries.push({name: "keywords", value: keywordsExpansion});
    }
    // if (q_advanced) {
    //   entries.push({ name: "q_advanced", value: q_advanced })
    // }

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
      showVisType,
      showMinDesksize,
      showQadvanced
    } = this.state.settings;
    const hasOptions = showTimeRange || showSorting || showDocTypes || showLang || showVisType || showMinDesksize;

    const actionUrl = this.getFormActionUrl();
    const hiddenEntries = this.getHiddenEntries();


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
                {style: {marginBottom: 15},},
                e(
                    BasicOptions,
                    null,
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
                      service: this.state.formData.service,
                    }),
                    showLang &&
                    e(LanguagePicker, {
                      values: this.state.formData.lang_id,
                      setValues: this.updateLang.bind(this),
                    }),
                    showTimeRange &&
                    e("div", null,
                        e("div", {
                          className: 'filter-label',
                        }, `Select time range`),
                        e("div",
                            {
                              className: "time-range-container",
                            },
                            e(InlineDatePicker, {
                              service: this.state.formData.service,
                              name: "from",
                              label: "From",
                              value: this.state.formData.timespan.from,
                              setValue: this.updateTimespanFrom.bind(this),
                            }),
                            e(InlineDatePicker, {
                              service: this.state.formData.service,
                              name: "to",
                              label: "To",
                              value: this.state.formData.timespan.to,
                              setValue: this.updateTimespanTo.bind(this)
                            })
                        ),
                    ),
                    (showMinDesksize && this.state.formData.service === "base") &&
                    e(MetadataQuality, {
                      value: this.state.formData.minDescriptionSize,
                      setValue: this.updateMinDesksize.bind(this),
                    }),
                ),
            ),
            ((showQadvanced && this.state.formData.service === "base") &&
                e(AdvancedSearchField, {
                  value: this.state.formData.q_advanced,
                  setValue: this.updateAdvancedQuery.bind(this),
                })
            ),

            e(SearchField, {
              value: this.state.formData.query,
              setValue: this.updateQuery.bind(this),
              required: (!(this.state.formData.service === "base" && showQadvanced)),
            }),
            e(Hiddens, {entries: hiddenEntries}),
            e(SearchButton)
        )
    );
  }
}

export default SearchBox;
