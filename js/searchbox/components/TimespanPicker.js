"use strict";

import CustomDropdown from "./CustomDropdown.js";
import TIMESPAN_OPTIONS from "../options/timespan.js";
import InlineDatePicker from "./InlineDatePicker.js";

const e = React.createElement;

const TimespanPicker = ({value, setValue}) => {

    return e("div", null,
        e("div", {
            className: 'filter-label',
            tabIndex: 0
        }, `Select time range`),

        e("div",
            {
                className: "time-range-container",
            },
            e(InlineDatePicker, {
                label: "From",
                value: value.from,
                onChange: (from) => setValue({...value, from}),
            }),
            e(InlineDatePicker, {
                label: "To",
                value: value.from,
                onChange: (from) => setValue({...value, from}),
            })
        ),
    )

};
// return e(CustomDropdown, {
//   options: TIMESPAN_OPTIONS,
//   name: "time_range",
//   value,
//   setValue,
// });
// };

export default TimespanPicker;
