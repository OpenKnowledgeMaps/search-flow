"use strict";

const e = React.createElement;

const AdvancedSearchField = ({value, setValue}) => {
    const infoMessage = `This optional search field enables you to search directly in individual metadata fields " +
        "available in BASE. For example, to create a visualisation for an individual author you can search in the " +
        "dcorcid field e.g. dcorcid:0000-0002-1894-5040. If you would like to restrict your search to a specific " +
        "region please use the dccoverage field e.g. dccoverage:”Rocky Mountains”.`
    return e("div", {style: {marginBottom: 10}},
        e("label", {htmlFor: "searchterm", className: "filter-label"}, "Enter advanced query - optional"),
        e('div', {className: 'popover__wrapper'},
            e('div', {
                    className: 'info-title',
                    style: {fontWeight: 800, fontSize: 10, cursor: 'pointer'},
                }, '(MORE',
                e("i", {
                    style: {marginLeft: 5},
                    className: "fa fa-info-circle",
                }),
                ")"),
            e('div', {
                    className: 'popover__content',
                    style: {marginTop: 1}
                },
                e('div', {className: "popover__title"},),
                e('div', {className: "popover__message"}, infoMessage),
            )
        ),
        e("input", {
            required: true,
            autoFocus: true,
            type: "text",
            name: "q_advanced",
            size: "89",
            className: "text-field",
            id: "searchterm_advanced",
            placeholder: value,
            spellCheck: true,
            value,
            onChange: (e) => setValue(e.target.value),
        })
    )
};

export default AdvancedSearchField;
