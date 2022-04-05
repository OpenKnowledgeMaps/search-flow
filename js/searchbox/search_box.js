"use strict";

const e = React.createElement;

// settings table: https://docs.google.com/spreadsheets/d/1C2v8IE_yVkxNHQ5aNC0mebcZ_BsojEeO4ZVn8GcaYsQ/edit#gid=0
const DEFAULT_SETTINGS = {
  // features on/off
  showTimeRange: true,
  showDocTypes: true,
  showSorting: true,
  // default (preselected) values
  defaultDocTypes: ["121"],
  defaultSorting: "most-relevant",
  // hidden values
  titleExpansion: "",
  abstractExpansion: "",
  keywordsExpansion: "",
};

const isTrue = (value) => value && (value === "true" || parseInt(value) > 0);

const getSettings = () => {
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

const DEFAULT_FROM = "1665-01-01";
const DEFAULT_TO = new Date().toISOString().split("T")[0];

class SearchBox extends React.Component {
  constructor(props) {
    super(props);

    const settings = getSettings();

    this.state = {
      showOptions: false,
      formData: {
        query: "",
        timespan: {
          type: TIMESPAN_OPTIONS[0].id,
          from: DEFAULT_FROM,
          to: DEFAULT_TO,
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
    let newFrom = DEFAULT_FROM;
    let newTo = DEFAULT_TO;
    if (newValue === "last-month") {
      let newFromDate = new Date(DEFAULT_TO);
      newFromDate.setMonth(newFromDate.getMonth() - 1);
      newFrom = newFromDate.toISOString().split("T")[0];
    }
    if (newValue === "last-year") {
      let newFromDate = new Date(DEFAULT_TO);
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
      { name: "min_descsize", value: 300 },
      // probably required by backend, otherwise useless - same val as "service"
      { name: "optradio", value: "base" },
      { name: "lang_id", value: "all" },
    ];

    // time range
    const { type: rangeType, from, to } = this.state.formData.timespan;
    entries.push({ name: "from", value: from });
    entries.push({ name: "to", value: to });

    if (!this.state.showOptions) {
      entries.push({ name: "time_range", value: rangeType });

      // sorting
      entries.push({ name: "sorting", value: this.state.formData.sorting });
      // document types
      this.state.formData.doctypes.forEach((value) => {
        entries.push({ name: "document_types[]", value });
      });
    }

    const { titleExpansion, abstractExpansion, keywordsExpansion } =
      this.state.settings;

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

  render() {
    // TODO implement all settings
    const { showTimeRange, showSorting, showDocTypes } = this.state.settings;

    const hiddenEntries = this.getHiddenEntries();

    return e(
      "div",
      { className: "search_box" },
      e(
        "form",
        {
          action: `search?service=${"base"}&embed=true`,
          method: "POST",
          target: "_self",
        },
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

const OptionsToggle = ({ label, onClick }) => {
  return e(
    "div",
    { className: "refine-search", onClick: onClick },
    label,
    " ",
    e("i", { className: "refine-search fa fa-angle-down" })
  );
};

const SearchField = ({ value, setValue }) => {
  return e("input", {
    autoFocus: true,
    type: "text",
    name: "q",
    size: "89",
    className: "text-field",
    id: "searchterm",
    placeholder: "Enter your search term",
    spellCheck: true,
    value,
    onChange: (e) => setValue(e.target.value),
  });
};

const SearchButton = ({ onClick }) => {
  return e(
    "button",
    {
      type: "submit",
      className: "submit-btn",
      onClick: onClick,
    },
    "GO"
  );
};

const domContainer = document.querySelector("#search_box_container");
ReactDOM.render(e(SearchBox), domContainer);
