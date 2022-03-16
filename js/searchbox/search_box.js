"use strict";

const e = React.createElement;

//const ENDPOINT_URL = "https://dev.openknowledgemaps.org/enkore-demo/search";
const ENDPOINT_URL = "search";

const DEFAULT_SETTINGS = {
  showVisMode: false, // WIP
  showDataSource: false, // WIP
  showTimeRange: true,
  showDocTypes: true,
  showRelevancy: true,
  showLanguage: false, // WIP
};

const isTrue = (value) => value && (value === "true" || parseInt(value) > 0);

const getSettings = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const settings = { ...DEFAULT_SETTINGS };

  // TODO implement all

  if (queryParams.has("show_time_range")) {
    settings.showTimeRange = isTrue(queryParams.get("show_time_range"));
  }
  if (queryParams.has("show_doc_types")) {
    settings.showDocTypes = isTrue(queryParams.get("show_doc_types"));
  }
  if (queryParams.has("show_sorting")) {
    settings.showRelevancy = isTrue(queryParams.get("show_sorting"));
  }

  return settings;
};

class SearchBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showOptions: false,
      // TODO define the defaults properly
      formData: {
        query: "",
        timespan: {
          type: TIMESPAN_OPTIONS[0].id,
          from: "1665-01-01",
          to: new Date().toISOString().split("T")[0],
        },
        relevancy: RELEVANCY_OPTIONS[0].id,
        doctypes: ["121"],
      },
    };
  }

  toggleOptions() {
    this.setState({
      ...this.state,
      showOptions: !this.state.showOptions,
    });

    const message = JSON.stringify({
      source: "searchbox",
      event: "resize",
    });
    window.parent.postMessage(message, "*");
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
    this.setState({
      ...this.state,
      formData: {
        ...this.state.formData,
        timespan: {
          ...this.state.formData.timespan,
          type: newValue,
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

  updateRelevancy(newValue) {
    this.setState({
      ...this.state,
      formData: {
        ...this.state.formData,
        relevancy: newValue,
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

  submit() {
    const { query, relevancy, doctypes, timespan } = this.state.formData;

    const [from, to] = getTimespanDates(timespan);
    const fromString = from ? `from=${from}&` : "";
    const toString = to ? `to=${to}&` : "";
    const doctypesString = getDoctypesString(doctypes);

    window.open(
      `${ENDPOINT_URL}?type=get&service=base&q=${query}&sorting=${relevancy}&min_descsize=300&${fromString}${toString}${doctypesString}&embed=true`,
      "_self"
    );
  }

  render() {
    // TODO implement all settings
    const { showTimeRange, showRelevancy, showDocTypes } = getSettings();

    return e(
      "div",
      { className: "search_box" },
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
            showRelevancy &&
              e(RelevancyPicker, {
                value: this.state.formData.relevancy,
                setValue: this.updateRelevancy.bind(this),
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
        onEnter: this.submit.bind(this),
      }),
      e(SearchButton, { onClick: () => this.submit() })
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

const SearchField = ({ value, setValue, onEnter }) => {
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
    onKeyPress: (e) => {
      if (e.key.toLowerCase() === "enter") {
        onEnter();
      }
    },
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
