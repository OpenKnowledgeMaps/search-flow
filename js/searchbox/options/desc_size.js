"use strict";

const DESC_SIZE_OPTIONS = [
  {
    id: '300',
    label: "High quality",
    infoTitle: "more",
    infoContent: "The visualisation will only include documents with an abstract (min. 300 characters). High metadata " +
        "quality significantly improves the quality of your visualisation."
  },
  {
    id: '0',
    label: "Low quality",
    infoTitle: "more",
    infoContent: "The visualisation will include documents with and without an abstract. Low metadata quality may " +
        "significantly reduce the quality of your visualisation."
  },
];

export default DESC_SIZE_OPTIONS;
