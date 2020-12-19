var search_options;
    
var updateOptions = function(post_data) {
    for (let post_field_key in post_data) {
        let post_field = post_data[post_field_key];
        for (let dropdown of config.options.dropdowns) {
            if(dropdown.id === post_field_key) {
                for (let dropdown_field of dropdown.fields) {
                    if(dropdown_field.id === post_field || (Array.isArray(post_field) && post_field.includes(dropdown_field.id))) {
                        dropdown_field.selected = true;
                        if(dropdown.id === "time_range" && dropdown_field.id === "user-defined") {
                            for(let input of dropdown_field.inputs) {
                                if(post_data.hasOwnProperty(input.id)) {
                                    input.text = post_data[input.id];
                                }
                            }
                        }
                    } else {
                        dropdown_field.selected = false;
                    }
                }
                break;
            }
        }
    }
}

var chooseOptions = function () {
    search_options = SearchOptions;

    switch (config.service) {
        case "plos":
            config.options = options_plos;
            break;

        case "pubmed":
            config.options = options_pubmed;
            break;

        case "doaj":
            config.options = options_doaj;
            break;

        case "base":
            config.options = options_base;
            break;

        default:
            config.options = options_doaj;
    }


    if(typeof post_data !== "undefined") {
        updateOptions(post_data);
    }
    search_options.init("#filter-container", config.options, true);

    config.options.dropdowns.forEach(function (entry) {
        if (typeof entry.width === "undefined") {
            entry.width = "110px";
        }
        search_options.select_multi('.dropdown_multi_' + entry.id, entry.name, entry.width, config.options)
    })

    var valueExists = function (key, value) {
        var find = config.options.dropdowns.filter(
                function (data) {
                    return data[key] === value;
                }
        );

        return (find.length > 0) ? (true) : (false);
    }
    
    var getFirstSelectedOption = function(id) {
        for(let dropdown of config.options.dropdowns) {
            if(dropdown.id === id && dropdown.hasOwnProperty("fields")) {
                for(let field of dropdown.fields) {
                    if (field.selected === true) {
                        return field.id;
                    }
                }
                return dropdown.fields[0].id;
            } else {
                return "";
            }
        }
    }
    
    var getInputDate = function(id) {
        for(let dropdown of config.options.dropdowns) {
            if(dropdown.id === "time_range") {
                for(let field of dropdown.fields) {
                    if (field.id === "user-defined") {
                        for(let input of field.inputs) {
                            if(input.id === id) {
                                return input.text;
                            }
                        }
                    }
                }
            }
        }
    }
    
    if (valueExists("id", "time_range")) {
        let value = getFirstSelectedOption("time_range");
        if(value !== "user-defined") {
            let start_date = (config.service === "base")?("1665-01-01"):("1809-01-01");
            search_options.addDatePickerFromTo("#from", "#to", value, start_date);
        } else {
            let start_date = getInputDate("from");
            let end_date = getInputDate("to");
            search_options.addDatePickerFromTo("#from", "#to", value, start_date, end_date, true);
        }
        
    } else if (valueExists("id", "year_range")) {
        let value = getFirstSelectedOption("time_range");
        
        if(value !== "user-defined") {
            let start_year = "1809";
            search_options.setDateRangeFromPreset("#from", "#to", value, start_year);
        } else {
            let start_year = getInputDate("from");
            let end_year = getInputDate("to");
            search_options.setDateRangeFromPreset("#from", "#to", value, start_year, end_year, true);
        }
    }

    // if languages are set in options do the populate here
    if (config.options.languages !== undefined) {
        populateLanguageSelector();
    } else {
        clearLanguageSelector();
    }
}

var bringLanguageCodeToTop = function (code) {
    var languageIdx = config.options.languages.findIndex(function (language) { 
        return language.code == code;
    })

    if (languageIdx !== -1) {
        var language = config.options.languages[languageIdx]
        config.options.languages.splice(languageIdx, 1);
        config.options.languages.unshift(language)
    }
}

var populateLanguageSelector = function () {
    var select = d3.select("#base-language-selector-container")
        .insert('select', "#input-container")
        .attr("id", "lang_id")
        .style("width", "350px")
        .style("overflow", "auto")
        .attr("class", "dropdown_multi_language_selector")
        .style("vertical-align", "top")
        .attr("name","lang_id")

    // set "all languages" option
    select.append("option")
        .attr("value", "all")
        .text("All Languages")

    // find corresponding 3 char language code of browser language
    var browserLang = search_options.get639_2Frombcp47(window.navigator.language);

    // move browser to top of language list
    if (browserLang !== null) {
        bringLanguageCodeToTop(browserLang);
    }

    // move english to the very top above browser language
    bringLanguageCodeToTop("eng");

    config.options.languages.forEach(function (option) {
        var current_option = select
                .append("option")
                .attr("value", option.code)
                .text( option.lang_in_eng + " (" + option.lang_in_lang + ")");

    })

    $(function () { $('.dropdown_multi_language_selector').multiselect({
        allSelectedText: "All "
            , nonSelectedText: "No "
            , nSelectedText: "Selected Language"
            , buttonWidth: ''
            , numberDisplayed: 2
            , maxHeight: 230
            , enableFiltering: true
            , enableCaseInsensitiveFiltering: true
    } ); } )
}

var clearLanguageSelector = function () {
    $("#base-language-selector-container").html('')
}

var config = {};

$(document).ready(function () {
    $('[data-toggle="popover"]').popover({trigger: "hover", placement: "top"}); 

    var changeLibrary = function () {
        config.service = $("input[name='optradio']:checked").val();
        //var radio_val = $(this).val();
        //config.service = radio_val;
        $("#searchform").attr("action", "search?service=" + config.service);

        search_options.user_defined_date = false;
        $("#filter-container").html("");

        $(".map-examples").css("display", "none");
        $(".map-examples." + config.service).css("display", "inline-block");

        chooseOptions();


    }; 

    $("input[name='optradio']").change(changeLibrary);

    chooseOptions();

    $("#searchform").attr("action", "search?service=" + config.service);

    changeLibrary();

    if (search_term_focus) {
        document.getElementById("searchterm").focus({preventScroll: true});
    }
    
    if(show_filters) {
        $("#filters").removeClass("frontend-hidden");
    }
})

$("#searchform").submit(function (e) {
    var ua = window.navigator.userAgent;
    var iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
    var webkit = !!ua.match(/WebKit/i);
    var iOSSafari = iOS && webkit && !ua.match(/CriOS/i);

    if(iOSSafari) {
        $("#searchform").attr("target", "");
    }

    if (!(browser === "Firefox" || browser === "Safari" || browser === "Chrome")) {
        let alert_message = 'You are using an unsupported browser.'
                            + ' We strongly suggest to switch to one of the supported browsers'
                            + ' before continuing. Otherwise, the search may not work as expected.'
                            + '\n\nSupported browsers are the latest versions of Edge, Firefox, Chrome, Safari, and Opera.'
                            + '\n\nDo you still want to continue?';
        if (!confirm(alert_message)) {
            $("#searchform").attr("target", "");
            e.preventDefault();
        }
    }

})

var SearchOptions = {
    user_defined_date: false,
    init: function (tag, data) {

        var self = this;
        self.drawOptions(tag, data);

    },
    drawOptions: function (tag, data) {
        var self = this;

        var div = d3.select(tag).append('div')
                .attr("id", "filter-btn")
                .attr("class", "divity")

        div.append('a')
                .attr("class", "pointer refine-search")
                .text("Refine your search ")
                .append('span')
                .attr("class", "awesome")
                .text("")

        var filters = d3.select(tag).append('div')
                .attr('id', 'filters')
                .attr('class', 'divity frontend-hidden')

        d3.select(tag).append('div')
                .attr('id', 'input-container')
                .attr('class', 'divity frontend-hidden')

        data.dropdowns.forEach(function (entry) {
            
            if(entry.hasOwnProperty("display") && entry.display === "none") {
                return;
            }

            if (entry.type == "input") {
                var new_input = filters.insert("div", "#input-container")
                        .attr("class", entry.class)

                new_input.append("label")
                        .attr("for", entry.id)
                        .text(entry.label)
                        .style("margin-left", "8px")

                new_input.append("input")
                        .attr("id", entry.id)
                        .attr("name", entry.id)
                        .attr("type", "text")
                        .attr("size", "5")
                        .attr("value", entry.value)

            } else if (entry.type = "dropdown") {

                var new_select = filters
                        .insert('select', "#input-container")
                        .attr("id", entry.id)
                        .style("width", "350px")
                        .style("overflow", "auto")
                        .attr("class", "dropdown_multi_" + entry.id)
                        .style("vertical-align", "top")
                        .attr("name", entry.id)

                if (entry.multiple) {
                    new_select.attr("name", entry.id + "[]")
                    new_select.attr("multiple", "multiple")
                }

                entry.fields.forEach(function (option) {
                    var current_option = new_select
                            .append('option')
                            .attr("value", option.id)
                            .text(option.text);

                    if (option.selected) {
                        current_option.attr("selected", "");
                    }

                    if (option.inputs != null) {
                        option.inputs.forEach(function (input) {
                            d3.select("#input-container")
                                    .append("label")
                                    .attr("for", input.id)
                                    .text(input.label)
                                    .style("margin-right", "8px")

                            d3.select("#input-container")
                                    .append("input")
                                    .attr("id", input.id)
                                    .attr("name", input.id)
                                    .attr("class", input.class)
                                    .attr("type", "text")
                                    .attr("size", "18")
                        })
                    }
                })
            }
        })
        /*filters.append("div")
         .attr("class", "submit-btn")
         .append("a")
         .attr("id", "submit-btn")
         .attr("href", "#")
         .attr("class", "frontend-btn")
         .style("vertical-align", "middle")
         .text("Submit");
         
         /*d3.select(tag).append("div")
         .attr("id", "stats")
         .attr("class", "divity")
         .html("<p>Loading...</p>")*/

        $("#filter-btn").click(function () {
            $("#filters").toggleClass("frontend-hidden");
            //$("#stats").toggleClass("frontend-hidden");

            var closed = $("#filters").css("display") == "none";

            if (closed) {
                $("#input-container").css("display", "none");
            } else if (self.user_defined_date) {
                $("#input-container").css("display", "block");
            }

        });

    },
    select_multi: function (dropdown_class, entity, width, data) {

        var self = this;

         $(function () {
            $(dropdown_class).multiselect({
                allSelectedText: "All " + entity
                , nonSelectedText: "No " + entity
                , nSelectedText: entity
                , buttonWidth: width
                , maxHeight: 250
                , includeSelectAllOption: true
                , numberDisplayed: function () {
                    let is_multiple = $(dropdown_class).prop("multiple");
                    return is_multiple ? 0 : 1;
                }()
                , onChange: function (element, checked) {
                    if (checked === true) {
                        if(dropdown_class === ".dropdown_multi_time_range") {
                            if (element.val() !== "user-defined") {
                                self.user_defined_date = false;
                                d3.select("#input-container").style("display", "none");
                            } else {
                                self.user_defined_date = true;
                                d3.select("#input-container").style("display", "block");
                            }

                            self.setDateRangeFromPreset("#from", "#to", element.val(), data.start_date);
                        }
                    }
                }
            });

        })
    },
    setDateRangeFromPreset: function (from, to, val, start_date, end_date, hide_inputs) {
        var self = this;
        
        var current_date = new Date();
        var current_year = current_date.getFullYear();
        
        var start = new Date();
        var end = new Date();
        
        //set ranges for date picker
        var start_date_object = new Date(start_date);
        var start_year = start_date_object.getFullYear();
        
        var range = start_year + ":" + current_year;
        $(from).datepicker("option", "yearRange", range);
        $(to).datepicker("option", "yearRange", range);
        
        switch (val) {

            case "user-defined":
                self.user_defined_date = true;
                if(typeof end_date !== "undefined") {
                    this.setDateFields(from, to, start_date, end_date);
                }
                if(typeof hide_inputs === "undefined" || hide_inputs === false) {
                    d3.select("#input-container").style("display", "block");
                }
                break;

                //full date
            case "any-time":
                start.setTime(Date.parse(start_date));
                this.setDateFields(from, to, start, end);
                
                break;

            case "last-month":
                start.setMonth(end.getMonth() - 1);
                this.setDateFields(from, to, start, end);
                break;

            case "last-year":
                start.setFullYear(end.getFullYear() - 1);
                this.setDateFields(from, to, start, end);
                break;

                //years only
            case "any-time-years":
                $(from).val(start_date);
                $(to).val(current_year);
                break;

            case "this-year":
                $(from).val(current_year);
                $(to).val(current_year);
                break;

            case "last-year-years":
                $(from).val(current_year - 1);
                $(to).val(current_year - 1);
                break;

            default:
                break;
        }
    },
    setDateFields: function (from, to, start, end) {
        Date.prototype.yyyymmdd = function () {
            var yyyy = this.getFullYear().toString();
            var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
            var dd = this.getDate().toString();
            return yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0]); // padding
        };

        $(from).datepicker("setDate", start);
        $(to).datepicker("setDate", end);
    },
    initDateFields: function (from, to) {
        setDateFields(from, to);
    },
    addDatePickerFromTo: function (from, to, init_time_range, start_date, end_date, hide_inputs) {

        var self = this;

        $(function () {
            $(from).datepicker({
                changeMonth: true,
                changeYear: true,
                numberOfMonths: 1,
                dateFormat: 'yy-mm-dd',
                onChangeMonthYear:function(y, m, i){                                
                    var d = i.selectedDay;
                    $(this).datepicker('setDate', new Date(y, m - 1, d));
                },
                firstDay: 1
            });
            $(to).datepicker({
                changeMonth: true,
                changeYear: true,
                numberOfMonths: 1,
                dateFormat: 'yy-mm-dd',
                onChangeMonthYear:function(y, m, i){                                
                    var d = i.selectedDay;
                    $(this).datepicker('setDate', new Date(y, m - 1, d));
                },
                firstDay: 1
            });

            self.setDateRangeFromPreset("#from", "#to", init_time_range, start_date, end_date, hide_inputs);

        });
    },
    get639_2Frombcp47: function (code) {
        var lang2to3CodeMapping = {
            "aa": "aar",
            "ab": "abk",
            "af": "afr",
            "ak": "aka",
            "sq": "alb",
            "am": "amh",
            "ar": "ara",
            "an": "arg",
            "hy": "arm",
            "as": "asm",
            "av": "ava",
            "ae": "ave",
            "ay": "aym",
            "az": "aze",
            "ba": "bak",
            "bm": "bam",
            "eu": "baq",
            "be": "bel",
            "bn": "ben",
            "bh": "bih",
            "bi": "bis",
            "bo": "tib",
            "bs": "bos",
            "br": "bre",
            "bg": "bul",
            "my": "bur",
            "ca": "cat",
            "cs": "cze",
            "ch": "cha",
            "ce": "che",
            "zh": "chi",
            "cu": "chu",
            "cv": "chv",
            "kw": "cor",
            "co": "cos",
            "cr": "cre",
            "cy": "wel",
            "da": "dan",
            "de": "ger",
            "dv": "div",
            "nl": "dut",
            "dz": "dzo",
            "el": "gre",
            "en": "eng",
            "eo": "epo",
            "et": "est",
            "ee": "ewe",
            "fo": "fao",
            "fa": "per",
            "fj": "fij",
            "fi": "fin",
            "fr": "fre",
            "fy": "fry",
            "ff": "ful",
            "ka": "geo",
            "gd": "gla",
            "ga": "gle",
            "gl": "glg",
            "gv": "glv",
            "gn": "grn",
            "gu": "guj",
            "ht": "hat",
            "ha": "hau",
            "he": "heb",
            "hz": "her",
            "hi": "hin",
            "ho": "hmo",
            "hr": "hrv",
            "hu": "hun",
            "ig": "ibo",
            "is": "ice",
            "io": "ido",
            "ii": "iii",
            "iu": "iku",
            "ie": "ile",
            "ia": "ina",
            "id": "ind",
            "ik": "ipk",
            "it": "ita",
            "jv": "jav",
            "ja": "jpn",
            "kl": "kal",
            "kn": "kan",
            "ks": "kas",
            "kr": "kau",
            "kk": "kaz",
            "km": "khm",
            "ki": "kik",
            "rw": "kin",
            "ky": "kir",
            "kv": "kom",
            "kg": "kon",
            "ko": "kor",
            "kj": "kua",
            "ku": "kur",
            "lo": "lao",
            "la": "lat",
            "lv": "lav",
            "li": "lim",
            "ln": "lin",
            "lt": "lit",
            "lb": "ltz",
            "lu": "lub",
            "lg": "lug",
            "mk": "mac",
            "mh": "mah",
            "ml": "mal",
            "mi": "mao",
            "mr": "mar",
            "ms": "may",
            "mg": "mlg",
            "mt": "mlt",
            "mn": "mon",
            "na": "nau",
            "nv": "nav",
            "nr": "nbl",
            "nd": "nde",
            "ng": "ndo",
            "ne": "nep",
            "nn": "nno",
            "nb": "nob",
            "no": "nor",
            "ny": "nya",
            "oc": "oci",
            "oj": "oji",
            "or": "ori",
            "om": "orm",
            "os": "oss",
            "pa": "pan",
            "pi": "pli",
            "pl": "pol",
            "pt": "por",
            "ps": "pus",
            "qu": "que",
            "rm": "roh",
            "ro": "rum",
            "rn": "run",
            "ru": "rus",
            "sg": "sag",
            "sa": "san",
            "si": "sin",
            "sk": "slo",
            "sl": "slv",
            "se": "sme",
            "sm": "smo",
            "sn": "sna",
            "sd": "snd",
            "so": "som",
            "st": "sot",
            "es": "spa",
            "sc": "srd",
            "sr": "srp",
            "ss": "ssw",
            "su": "sun",
            "sw": "swa",
            "sv": "swe",
            "ty": "tah",
            "ta": "tam",
            "tt": "tat",
            "te": "tel",
            "tg": "tgk",
            "tl": "tgl",
            "th": "tha",
            "ti": "tir",
            "to": "ton",
            "tn": "tsn",
            "ts": "tso",
            "tk": "tuk",
            "tr": "tur",
            "tw": "twi",
            "ug": "uig",
            "uk": "ukr",
            "ur": "urd",
            "uz": "uzb",
            "ve": "ven",
            "vi": "vie",
            "vo": "vol",
            "wa": "wln",
            "wo": "wol",
            "xh": "xho",
            "yi": "yid",
            "yo": "yor",
            "za": "zha",
            "zu": "zul"
          }
        var parts = code.split('-')
        if (typeof parts[0] !== 'string') return null // malformed browser language code
        if ( parts[0].length === 3 ) return parts[0]
        if ( parts[0].length === 2 ) {
            if (lang2to3CodeMapping.hasOwnProperty(parts[0])) {
                return lang2to3CodeMapping[parts[0]]
            } else {
                return null // unknown 2 lang code
            }
        } else {
            return null // unknown lang code
        }

    }
};


