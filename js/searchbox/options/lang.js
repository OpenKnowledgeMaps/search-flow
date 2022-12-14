"use strict";

import LangOptionsData from '../options/lang_options.json' assert { type: "json" };


const LANG_OPTIONS = LangOptionsData.map((item)=>(item.label && item.id) && item).sort((a, b) => a.name > b.name ? -1 : 1)


export default LANG_OPTIONS;
