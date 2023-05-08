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
import CollectionPicker from "./CollectionPicker.js";


const e = React.createElement;


const pubMedDefaultId = PUBMED_DOCTYPES_OPTIONS
    .filter(option => option.id !== 'retracted publication')
    .map(option => option.id);


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
          fromPubmed: settings.defaultFromPubmed,
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

  updateTimespanFromPubmed(newValue) {
    this.setState({
      ...this.state,
      formData: {
        ...this.state.formData,
        timespan: {
          fromPubmed: newValue,
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
    if (this.state.service === 'base' || this.state.formData.service === 'base') {
      this.setState({
        ...this.state,
        formData: {
          ...this.state.formData,
          doctypes: newValue,
        },
      });
    } else if (this.state.service === 'pubmed' || this.state.formData.service === 'pubmed') {
      this.setState({
        ...this.state,
        formData: {
          ...this.state.formData,
          articleTypes: newValue,
        },
      });
    }
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

    if (newValue === 'base') {
      this.setState({
        ...this.state,
        formData: {
          ...this.state.formData,
          service: newValue,
          doctypes: this.state.settings.defaultDocTypes,
          timespan: {
            from: DEFAULT_FROM,
            to: DEFAULT_TO,
          }
        },
      });
    } else if (newValue === 'pubmed') {
      this.setState({
        ...this.state,
        formData: {
          ...this.state.formData,
          service: newValue,
          doctypes: this.state.settings.defaultDocTypes,
          timespan: {
            fromPubmed: PUBMED_DEFAULT_FROM,
            to: DEFAULT_TO,
          }
        },
      });
    }
  }


  updateMinDescsize(newValue) {
    this.setState({
      ...this.state,
      formData: {
        ...this.state.formData,
        minDescriptionSize: newValue,
      },
    });
  }

  updateColl(newValue) {
    this.setState({
      ...this.state,
      formData: {
        ...this.state.formData,
        collection: newValue,
      },
    });
  }


  getHiddenEntries() {
    const entries = [];

    const {
      showTimeRange,
      showSorting,
      showDocTypes,
      showLang,
      showService,
      showVisType,
      showMinDescsize,
      showQadvanced,
      showCollection,
    } = this.state.settings;

    // if (!this.state.showOptions || !showTimeRange) {
    //   entries.push({name: "from", value: this.state.settings.defaultFrom});
    //   entries.push({name: "to", value: this.state.settings.defaultTo});
    // }

    this.state.showOptions
        ? this.state.showOptionsLabel = "Hide advanced search options"
        : this.state.showOptionsLabel = "Show advanced search options"


    if (!this.state.showOptions || !showTimeRange) {
      (this.state.service === 'pubmed' || this.state.formData.service === 'pubmed')
          ? entries.push({name: "from", value: this.state.formData.timespan.fromPubmed})
          : entries.push({name: "from", value: this.state.formData.timespan.from});
      entries.push({name: "to", value: this.state.formData.timespan.to});
    }

    if (!this.state.showOptions || !showSorting) {
      entries.push({name: "sorting", value: this.state.settings.defaultSorting});
    } else {
      entries.push({name: "sorting", value: this.state.formData.sorting});
    }

    if (showVisType) {
      if (this.state.service === 'base' || this.state.formData.service === 'base') {
        entries.push({name: "vis_type", value: this.state.formData.visType});
      }
    } else {
      if (this.state.service === 'base' || this.state.formData.service === 'base') {
        entries.push({name: "vis_type", value: this.state.settings.defaultVisType});
      }
    }


    if (this.state.formData.service === 'base') {
      if (!this.state.showOptions || !showMinDescsize) {
        entries.push({name: "min_descsize", value: this.state.settings.minDescriptionSize});
      } else {
        entries.push({name: "min_descsize", value: this.state.formData.minDescriptionSize});
      }

    }

    if (!this.state.showOptions || !showDocTypes) {
      if (this.state.formData.service === 'base' || this.state.service === 'base') {
        this.state.formData.doctypes.forEach((value) => {
          entries.push({name: "document_types[]", value});
        });
      } else if (this.state.formData.service === 'pubmed' || this.state.service === 'pubmed') {
        this.state.formData.articleTypes.forEach((value) => {
          entries.push({name: "article_types[]", value});
        });
      }
    }

    if (this.state.formData.service === 'base') {
      if (!this.state.showOptions || !showLang) {
        this.state.formData.lang_id.forEach((value) => {
          entries.push({name: "lang_id[]", value});
        });
      }
    }

    if (!showService) {
      entries.push({name: "service", value: this.state.settings.defaultService});
    } else {
      entries.push({name: "service", value: this.state.formData.service});
    }

    // const {minDescriptionSize, contentProvider} = this.state.settings;
    const {contentProvider} = this.state.settings;
    const {titleExpansion, abstractExpansion} = this.state.settings;
    const {keywordsExpansion} = this.state.settings;
    const {q_advanced} = this.state.settings;
    const collection = this.state.settings.collection;


    if (contentProvider) {
      entries.push({name: "repo", value: contentProvider});
    }

    // old optional condition
    // if (collection) {
    //   entries.push({name: "coll", value: collection});
    // }

    if ((this.state.formData.service === 'base' || this.state.service === 'base') && (!this.state.showOptions || !showCollection)) {
      if (collection && collection.length <= 3) {
        entries.push({name: "coll", value: collection});
      }
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

    if (q_advanced) {
      entries.push({name: "q_advanced", value: q_advanced})
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
      showVisType,
      showMinDescsize,
      showQadvanced,
      showCollection
    } = this.state.settings;
    const hasOptions = showTimeRange || showSorting || showDocTypes || showLang || showVisType || showMinDescsize || showQadvanced || showCollection;

    const actionUrl = this.getFormActionUrl();
    const hiddenEntries = this.getHiddenEntries();

    // temporary decision to fix unpredictable behaviour of the date 'from' value
    let dateFrom;
    if (this.state.formData.service === 'pubmed') {
      dateFrom = this.state.formData.timespan.fromPubmed ? this.state.formData.timespan.fromPubmed : this.state.settings.defaultFromPubmed;
      // console.log('dateFromPubmed', this.state.formData.timespan.fromPubmed);
    } else {
      dateFrom = this.state.formData.timespan.from ? this.state.formData.timespan.from : this.state.settings.defaultFrom;
      // console.log('dateFrom BASE', this.state.formData.timespan.from);
    }
    let dateTo = this.state.formData.timespan.to || this.state.settings.defaultTo;
    // console.log('dateTo', this.state.formData.timespan.to)


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
                      values: this.state.formData.service === "pubmed" ? this.state.formData.articleTypes : this.state.formData.doctypes,
                      setValues: this.updateDoctypes.bind(this),
                      service: this.state.formData.service,
                    }),
                    (showLang && this.state.formData.service === "base") &&
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
                              value: dateFrom,
                              setValue: this.state.formData.service === "pubmed" ? this.updateTimespanFromPubmed.bind(this) : this.updateTimespanFrom.bind(this),
                            }),
                            e(InlineDatePicker, {
                              service: this.state.formData.service,
                              name: "to",
                              label: "To",
                              value: dateTo,
                              setValue: this.updateTimespanTo.bind(this)
                            })
                        ),
                    ),
                    (showCollection && this.state.formData.service === "base") &&
                    e(CollectionPicker,
                        {
                          values: this.state.formData.collection,
                          setValues: this.updateColl.bind(this)
                        },),

                    (showMinDescsize && this.state.formData.service === "base") &&
                    e(MetadataQuality, {
                      value: this.state.formData.minDescriptionSize,
                      setValue: this.updateMinDescsize.bind(this),
                    }),
                ),
                ((showQadvanced && this.state.formData.service === "base") &&
                    e(AdvancedSearchField, {
                      value: this.state.formData.q_advanced,
                      setValue: this.updateAdvancedQuery.bind(this),
                    })
                ),
            ),
            e(SearchField, {
              value: this.state.formData.query,
              setValue: this.updateQuery.bind(this),
              required: (!(this.state.formData.service === "base" && showQadvanced && this.state.formData.q_advanced.length > 0)),
            }),
            e(Hiddens, {entries: hiddenEntries}),
            e(SearchButton)
        )
    );
  }
}

export default SearchBox;
