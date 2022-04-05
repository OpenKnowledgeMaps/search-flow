"use strict";

import SearchBox from "./components/SearchBox.js";

const e = React.createElement;

const domContainer = document.querySelector("#search_box_container");
ReactDOM.render(e(SearchBox), domContainer);
