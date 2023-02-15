import React from "react";
import {getSettings} from "../settings";

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
      },
      settings,
    };
  }

  render() {

    return (
        <div className={'text-5xl text-red-600 flex justify-center items-center'}>
            <div>hello world!</div>
        </div>
    );
  }
}

export default SearchBox;
