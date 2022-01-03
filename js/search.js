// Everything related to the request to the server
var error_texts = search_flow_config.error_texts;

function getPostData(post_data, field, type) {
  if (!(field in post_data) || post_data[field] === "undefined") {
    switch (type) {
      case "string":
        return "";

      case "array":
        return [];

      case "int":
        return -1;

      default:
        return "";
    }
  }

  return post_data[field];
}

function fallbackCheck(service_url, unique_id, vis_page, service, post_data) {
  // Do not start fallback check if an error occurred
  if (error_occurred) {
    return;
  }

  $.getJSON(service_url + unique_id, function (output) {
    if (output.status === "success") {
      search_aborted = true;
      redirectToMap(vis_page, unique_id, service, post_data);
    }
  });
}

function clearFallbackInterval() {
  if (
    typeof check_fallback_interval !== "undefined" &&
    check_fallback_interval !== null
  ) {
    window.clearInterval(check_fallback_interval);
  } else {
    console.log("Fallback interval not defined");
  }
}

function stopAndResetProgressbar() {
  if (
    typeof progessbar_timeout !== "undefined" &&
    progessbar_timeout !== null
  ) {
    window.clearTimeout(progessbar_timeout);
    $("#progressbar").progressbar("option", "value", 0);
  } else {
    console.log("Progressbar timeout not defined");
  }
}

// An error occurred
function errorOccurred() {
  error_occurred = true;
  console.log("An error occurred while creating the map");
  stopAndResetProgressbar();
  clearFallbackInterval();
  $("#active_state").addClass("nodisplay");
  $("#error_state").removeClass("nodisplay");
  $("#divhow").addClass("nodisplay");
}

function redirectToMap(vis_page, id, service, post_data) {
  $("#progressbar").progressbar("option", "value", 100);
  window.clearTimeout(progessbar_timeout);
  let redirect_url = vis_page;
  let has_previous_params = false;
  if (search_flow_config.waiting_page_options.vis_page_cool_uri) {
    search_flow_config.waiting_page_options.vis_page_params.forEach(function (
      param
    ) {
      redirect_url += "/" + createParamValue(param, post_data);
    });
  } else {
    search_flow_config.waiting_page_options.vis_page_params.forEach(function (
      param,
      i
    ) {
      redirect_url +=
        createParamName(param, i, has_previous_params) +
        createParamValue(param, post_data);
      has_previous_params = true;
    });
  }

  search_flow_config.waiting_page_options.vis_page_additional_params.forEach(
    function (param, i) {
      redirect_url +=
        createParamName(param, i, has_previous_params) +
        createParamValue(param, post_data);
      has_previous_params = true;
    }
  );

  if (post_data.embed) {
    redirect_url += (has_previous_params ? "&" : "?") + "embed=true";
  }

  window.location.replace(redirect_url);
}

function createParamName(param, i, has_previous_params) {
  return (i === 0 && !has_previous_params ? "?" : "&") + param.name + "=";
}

function createParamValue(param, post_data) {
  let ret_value = "";
  if (param.hasOwnProperty("value")) {
    if (typeof param.value === "string") {
      ret_value = param.value;
    } else {
      ret_value = param.value[post_data[param.id]];
    }
  } else {
    ret_value = post_data[param.id];
  }
  return ret_value;
}

var getSearchTermShort = function (search_term) {
  return search_term.length > max_length_search_term_short
    ? search_term.substr(0, max_length_search_term_short) + "..."
    : search_term;
};

function writeSearchTerm(id, search_term_short, search_term) {
  $("#" + id).text(search_term_short);
  $("#" + id).attr("title", search_term);
}

function executeSearchRequest(
  service_url,
  post_data,
  service,
  search_term_short,
  search_term,
  timeout,
  vis_page
) {
  $.ajax({
    url: service_url,
    type: "POST",
    data: post_data,
    dataType: "json",
    timeout: timeout,
  })

    .done(function (output) {
      if (output.status == "success") {
        redirectToMap(vis_page, output.id, service, post_data);
      } else {
        errorOccurred();

        let list_array = [];

        if (output.hasOwnProperty("reason") && output.reason.length > 0) {
          list_array = Array.isArray(output.reason)
            ? output.reason
            : [output.reason];
        }

        let additional_api_errors =
          search_flow_config.waiting_page_options.additional_api_errors;
        if (list_array.length > 0) {
          if (Object.keys(additional_api_errors).includes(list_array[0])) {
            setErrorTexts(error_texts[additional_api_errors[list_array[0]]]);
            return;
          } else {
            console.log(
              "Unhandled additional API error code: " + list_array[0]
            );
          }
        }

        let current_error_texts =
          error_texts[
            search_flow_config.waiting_page_options.default_api_error
          ];

        setErrorTitle(current_error_texts.title);
        setErrorReason(current_error_texts.reason);
        if (list_array.length > 0) {
          let list_array_translated = [];
          for (let item of list_array) {
            if (
              search_flow_config.error_reason_translation.hasOwnProperty(item)
            ) {
              list_array_translated.push(
                search_flow_config.error_reason_translation[item]
              );
            } else {
              console.log("Unrecognized error code: " + item);
            }
          }
          setErrorRemedy(current_error_texts.remedy, list_array_translated);
        }

        if (not_enough_results_links) {
          let search_string = "";

          try {
            search_string = unboxPostData(post_data, service);
          } catch (e) {
            console.log("An error ocurred when creating the search string");
          }

          if (search_string !== "") {
            setErrorMoreInfo(current_error_texts.more_info);
            $("#more-info-link_na").attr("href", search_string);
            $("#more-info-link_service").text(
              service === "base" ? "BASE" : "PubMed"
            );
          }
        }
        setErrorContact(current_error_texts.contact);
        writeSearchTerm("search_term_fail", search_term_short, search_term);
        setErrorResolution(
          current_error_texts.resolution,
          current_error_texts.resolution_link,
          true
        );

        if (service.endsWith("sg")) {
          $(".vis_type_name").text("streamgraph");
        }
      }
    })

    .fail(function (xhr, status, error) {
      //do not carry out if request is aborted
      if (search_aborted) return;

      errorOccurred();

      if (status === "timeout") {
        setErrorTexts(error_texts.timeout);
      } else if (xhr.status === 0) {
        setErrorTexts(error_texts.connection_error);
      } else {
        setErrorTexts(error_texts.server_error);
      }
    });
}

function redirectToIndex(search_form_page) {
  setErrorTexts(error_texts.no_post_data);
  window.setTimeout(function () {
    window.location = search_form_page;
  }, 10000);
}

// Everything related to error messaging apart from translating
// error descriptions/possible reasons

function setErrorTexts(text_object, search_term_short, search_term) {
  if (text_object.hasOwnProperty("title")) {
    setErrorTitle(text_object.title);
  }
  if (text_object.hasOwnProperty("reason")) {
    setErrorReason(text_object.reason);
  }
  if (text_object.hasOwnProperty("remedy")) {
    setErrorMoreInfo(text_object.remedy);
  }
  if (text_object.hasOwnProperty("more_info")) {
    setErrorMoreInfo(text_object.more_info);
  }
  if (text_object.hasOwnProperty("title")) {
    setErrorContact(text_object.contact);
  }
  if (
    typeof search_term_short !== "undefined" &&
    search_term_short !== null &&
    typeof search_term !== "undefined" &&
    search_term !== null
  ) {
    writeSearchTerm("search_term_fail", search_term_short, search_term);
  }

  if (
    text_object.hasOwnProperty("resolution") &&
    text_object.hasOwnProperty("resolution_link")
  ) {
    setErrorResolution(text_object.resolution, text_object.resolution_link);
  }
}

function setErrorTitle(html_string) {
  writeErrorFieldHTML("error-title", html_string);
}

function setErrorReason(html_string) {
  writeErrorFieldHTML("error-reason", html_string);
}

function setErrorRemedy(html_string, list_array) {
  writeErrorFieldList("error-remedy", list_array, html_string);
}

function setErrorMoreInfo(html_string) {
  writeErrorFieldHTML("error-more-info", html_string);
}

function setErrorContact(html_string) {
  writeErrorFieldHTML("error-contact", html_string);
}
function setErrorResolution(resolution, resolution_link, show_form) {
  if (typeof show_form !== "undefined" && show_form === true) {
    $("#new_search_form").removeClass("nodisplay");
    $("#filters").removeClass("frontend-hidden");
    if (search_options_object.user_defined_date) {
      $("#input-container").css("display", "block");
    }
    if (search_flow_config.search_options.search_term_focus) {
      document.getElementById("searchterm").focus({ preventScroll: true });
    }
  } else {
    $("#error-resolution").removeClass("nodisplay");
    $("#error-resolution").text(resolution);
    $("#error-resolution").attr("href", resolution_link);
  }
}

function writeErrorFieldHTML(field, html_string) {
  $("#" + field).html(html_string);
}

function writeErrorFieldText(field, text_string) {
  $("#" + field).text(text_string);
}

function writeErrorFieldList(field, list_array, text) {
  if (typeof text !== "undefined" && text !== null) {
    $("#" + field).append($("<p>", { html: text }));
  }

  if (typeof list_array !== "undefined" && list_array !== null) {
    let list_id = field + "_list";
    $("#" + field).append($("<ul>", { id: list_id }));
    for (let item of list_array) {
      $("#" + list_id).append($("<li>", { text: item }));
    }
  }
}

function unboxPostData(post_data, service) {
  if (service === "base") {
    var base_search_string =
      "https://base-search.net/Search/Results?" +
      (getPostData(post_data, "sorting", "string") === "most-recent"
        ? "sort=dcyear_sort+desc&"
        : "") +
      "refid=okmaps&type0[]=all&lookfor0[]=" +
      getPostData(post_data, "q", "string") +
      "&type0[]=tit&lookfor0[]=&type0[]=aut&lookfor0[]=&type0[]=subj&lookfor0[]=&type0[]=url&lookfor0[]=&offset=10&ling=0&type0[]=country" +
      "&lookfor0[]=&daterange=year&yearfrom=" +
      getPostData(post_data, "from", "string").substr(0, 4) +
      "&yearto=" +
      getPostData(post_data, "to", "string").substr(0, 4) +
      "&type1[]=doctype" +
      createDoctypeString(
        getPostData(post_data, "document_types", "array"),
        service
      ) +
      "&allrights=all&type2[]=rights&lookfor2[]=CC-*&lookfor2[]=CC-BY&lookfor2[]=CC-BY-SA&lookfor2[]=CC-BY-ND&lookfor2[]=CC-BY-NC&lookfor2[]=CC-BY-NC-SA&lookfor2[]=CC-BY-NC-ND&lookfor2[]=PD&lookfor2[]=CC0&lookfor2[]=PDM&type3[]=access&lookfor3[]=1&lookfor3[]=0&lookfor3[]=2&name=&join=AND&bool0[]=AND&bool1[]=OR&bool2[]=OR&bool3[]=OR&newsearch=1";

    return base_search_string;
  } else if (service === "pubmed") {
    var pubmed_string =
      "https://www.ncbi.nlm.nih.gov/pubmed?" +
      "term=((" +
      getPostData(post_data, "q", "string") +
      "%20AND%20(%22" +
      getPostData(post_data, "from", "string") +
      "%22%5BDate%20-%20Publication%5D%20%3A%20%22" +
      getPostData(post_data, "to", "string") +
      "%22%5BDate%20-%20Publication%5D))" +
      "%20AND%20((" +
      createDoctypeString(
        getPostData(post_data, "article_types", "array"),
        service
      ) +
      "))";

    return pubmed_string;
  }
}

function createDoctypeString(doctypes, service) {
  var doctypes_string = "";
  doctypes.forEach(function (doctype) {
    if (service === "base") doctypes_string += "&lookfor1[]=" + doctype;
    else if (service === "pubmed")
      doctypes_string += "%22" + doctype + "%22%5BPublication%20Type%5D%20OR";
  });
  return doctypes_string;
}

// Everything related to the progress bar apart from global settings

function tick_function() {
  var value = $("#progressbar").progressbar("option", "value");
  value += tick_increment;
  $("#progressbar").progressbar("option", "value", value);
  progessbar_timeout = window.setTimeout(
    tick_function,
    tick_interval * milliseconds_progressbar
  );

  if (value >= 100) {
    $("#status").html(
      "<span style='color:red'>" +
        search_flow_config.waiting_page_texts["longer_than_expected_text"] +
        "</span>"
    );
    $("#progressbar").progressbar("value", 5);
  }
}
