"use strict";

import {LangOptions} from './lang_options.js';

const LANG_OPTIONS = LangOptions.map((item)=>(item.label && item.id) && item)
    .sort((a, b) => (a.label > b.label) ? 1 : -1)

// put All Languages on the start of array
LANG_OPTIONS.map((item) => {
    if (item.id==="all-lang"){
        const index = LANG_OPTIONS.indexOf(item);
        LANG_OPTIONS.splice(0, 0, LANG_OPTIONS.splice(index, 1)[0]);
    }
})

export default LANG_OPTIONS;
