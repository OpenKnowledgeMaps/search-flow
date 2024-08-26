"use strict";


const SORTING_OPTIONS = [
  {
    id: "most-relevant",
    label: "Most relevant",
    infoTitle: "more",
    infoContent: "To determine the most relevant documents, we use the relevance ranking provided by the data source. Data sources mainly use text similarity between your query and the article metadata to determine the relevance ranking."
  },
  {
    id: "most-recent",
    label: "Most recent",
    infoTitle: "more",
    infoContent: "The visualisation will only include the latest documents matching your query. "
  },
];

export default SORTING_OPTIONS;
