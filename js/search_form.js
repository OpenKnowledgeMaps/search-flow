var SearchOptions = {
    user_defined_date: false,
    init: function (tag_options, data_options) {

        var self = this;
        self.drawOptions(tag_options, data_options);

    },
    
    drawOptions: function(tag, data) {
        data.options.forEach(function(option) {
            let label = d3.select(tag).append("label")
                    .attr("class", "radio-inline")
            
            let radio_button = label.append("input")
                    .attr("type", "radio")
                    .attr("name", "optradio")
                    .attr("value", option.id)
            
            if(option.default && !option.disabled) {
                radio_button.attr("checked", true)
            }
            
            label.append("span")
                    .attr("class", "bold")
                    .text(" " + option.text)
            
            label.append("span")
                    .attr("class", function () {
                        if(option.disabled) {
                            return "greyed_out"
                        }
                    })
                    .text(" " + option.description)
            
            if(option.disabled) {
                radio_button.attr("disabled", true)
                label.append("span")
                        .attr("class", "error-message")
                        .text(" " + data.disabled_message)
            }
        })            
    },
    
    drawExamples: function(tag, data) {
        d3.select(tag).text(data.example_text);
        let examples = d3.select(tag).append("span")
                                .attr("class", "map-examples")
        
        data.examples.forEach(function (example) { 
            examples.append("a")
                    .attr("class", "underline")
                    .attr("target", "_blank")
                    .attr("href", example.link)
                    .text(example.text);
        })
    },
    
    drawFilters: function (tag, data) {
        var self = this;

        var div = d3.select(tag).append('div')
                .attr("id", "filter-btn")
                .attr("class", "divity")

        div.append('a')
                .attr("class", "pointer refine-search underline")
                .text(search_flow_config.search_options.filters_text + " ")
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
                
                if(entry.hasOwnProperty("hidden") && entry.hidden) {
                    new_select.attr("class", "hidden");
                }

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
                        if(dropdown_class === ".dropdown_multi_time_range" 
                                || dropdown_class === ".dropdown_multi_year_range") {
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

var disableItem = function(id) {
    search_flow_config.search_options.options.find(function(item) {
        if (item.id === id) {
            item.disabled = true;
        }
    })
}

var makeDefault = function(id) {
    search_flow_config.search_options.options.find(function(item) {
        if (item.id === id) {
            item.default = true;
        }
    })
}

var removeDefault = function(id) {
    search_flow_config.search_options.options.find(function(item) {
        if (item.id === id) {
            item.default = false;
        }
    })
}


