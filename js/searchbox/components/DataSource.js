"use strict";

import RadioInputList from "./RadioInputList.js";

const DATA_SOURCE = [
  {
    id: "base",
    label: "All disciplines",
    infoTitle: "BASE",
    infoContent: "BASE provides access to more than 300 million documents for all disciplines from more than 10,000 content providers. BASE is operated by Bielefeld University Library."
  },
  {
    id: "pubmed",
    label: "Life sciences",
    infoTitle: "PubMed",
    infoContent: "PubMed comprises more than 35 million citations for biomedical literature from MEDLINE, life science journals, and online books. PubMed is operated by the U.S. National Library of Medicine (NLM)."
  },
];

const e = React.createElement;

const DataSource = ({value, setValue}) => {
  return e(RadioInputList, {
    label: "Select a data source",
    options: DATA_SOURCE,
    name: "service",
    value: value,
    setValue: setValue,
  });
};

export default DataSource;
