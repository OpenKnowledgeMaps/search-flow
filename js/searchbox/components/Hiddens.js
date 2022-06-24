"use strict";

const e = React.createElement;

const Hiddens = ({ entries }) => {
  return e(
    React.Fragment,
    null,
    ...entries.map((entry) =>
      e("input", { type: "hidden", name: entry.name, value: entry.value })
    )
  );
};

export default Hiddens;
