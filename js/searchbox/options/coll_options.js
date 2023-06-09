"use strict";

import COUNTRIES from "./countries.js";

// default value always should be the first element in the array
const DefaultColl = [{id: 'worldwide', label: 'Worldwide'}];

// List of continents
const Continents = [
  {id: 'caf', label: 'Africa'},
  {id: 'cas', label: 'Asia'},
  {id: 'cau', label: 'Australia/Oceania'},
  {id: 'ceu', label: 'Europe'},
  {id: 'cna', label: 'North America'},
  {id: 'csa', label: 'South America'},
  {id: 'cww', label: 'Web server without geographic relation (org)'},
];


// Combine continents and countries into one array with id and label where the label is the country name, id is the country "alpha-2" code

const COLL_OPTIONS = Continents.concat(COUNTRIES.map(country => {
  return {id: country["alpha-2"].toLowerCase(), label: country.name}
})).sort((a, b) => {
  return a.label.localeCompare(b.label);
});

// make array from DefaultColl and COLL_OPTIONS and make DefaultColl the first element in the array
COLL_OPTIONS.unshift(...DefaultColl);

export default COLL_OPTIONS;

