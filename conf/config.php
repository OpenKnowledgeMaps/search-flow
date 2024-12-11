<?php
$search_flow_config = array(
    //Path to the search form page
    "search_form_page" => "index.php"
    //Path to the waiting page
    , "waiting_page" => "search.php"
    //Path to the visualization page
    , "vis_page" => "headstart.php"
    //Params that will be used to create the vis ID
    , "params_arrays" => array(
        "integration1" => array("from", "to", "article_types")
    )
    //Optional parameters that can be specified in a GET request
    , "optional_get_params" => [
        "integration1" => []
    ]
    //Load the visualization context on the knowledge map page
    , "vis_load_context" => true
    //Default values and whether to enable them for the knowledge map page
    , "enable_default_id" => false
    , "default_id" => ""
    , "enable_default_query" => false
    , "default_query" => ""
    , "enable_default_service" => false
    , "default_service" => ""
    //Enable/disable user-set custom titles
    , "enable_custom_title" => false
    //Whether to display an alternate warning for desktops in the mobile warning component
    , "banner_alternate_desktop_warning" => false
    // force the Headstart embed mode
    , "force_embed" => false
    //Filter options for search form and for general use in the package
    , "filter_options" => [
        "options_integration1" =>
            [
            'start_date' => '1809-01-01',
            'dropdowns' => [
                [
                    'id' => 'time_range',
                    'multiple' => false,
                    'name' => 'Time Range',
                    'type' => 'dropdown',
                    'fields' => [
                        [
                            'id' => 'any-time',
                            'text' => 'Any time'
                        ],
                        [
                            'id' => 'last-month',
                            'text' => 'Last month'
                        ],
                        [
                            'id' => 'last-year',
                            'text' => 'Last year'
                        ],
                        [
                            'id' => 'user-defined',
                            'text' => 'Custom range',
                            'class' => 'user-defined',
                            'inputs' => [
                                [
                                    'id' => 'from',
                                    'label' => 'From: ',
                                    'class' => 'time_input'
                                ],
                                [
                                    'id' => 'to',
                                    'label' => 'To: ',
                                    'class' => 'time_input'
                                ]
                            ]
                        ]
                    ]
                ],
                [
                    'id' => 'sorting',
                    'multiple' => false,
                    'name' => 'Sorting',
                    'type' => 'dropdown',
                    'fields' => [
                        [
                            'id' => 'most-relevant',
                            'text' => 'Most relevant'
                        ],
                        [
                            'id' => 'most-recent',
                            'text' => 'Most recent'
                        ]
                    ]
                ],
                [
                    'id' => 'article_types',
                    'multiple' => true,
                    'width' => '140px',
                    'name' => 'Article types',
                    'type' => 'dropdown',
                    'fields' => [
                        [
                            'id' => 'adaptive clinical trial',
                            'text' => 'Adaptive Clinical Trial',
                            'selected' => true
                        ],
                        [
                            'id' => 'address',
                            'text' => 'Address',
                            'selected' => true
                        ],
                        [
                            'id' => 'autobiography',
                            'text' => 'Autobiography',
                            'selected' => true
                        ]
                    ]
                ]
            ]
        ]
   ]
);

if(isset($search_flow_config_local)) {
    foreach ($search_flow_config as $key => $value) {
        if(isset($search_flow_config_local[$key])) {
            $search_flow_config[$key] = $search_flow_config_local[$key];
        }
    }
}
?>

<script>
    var search_flow_config = {
        search_options: {
            //Text to display when a service is unavailable
            disabled_message: "Undergoing downtime - please try again later!"
            //Enable/disable auto focus on search input field
            , search_term_focus: true
            //Enable/disable auto showing of search filters
            , show_filters: false
            //Text to show on filters link/button
            , filters_text: "Refine your search"
            //Options for each integration to search in
            , options: [
                {id: "integration1", name: "Integration 1", disabled: false, default: false
                    , text: "Integration 1", description: "(all disciplines)", vis_type_name: "knowledge map"
                    , script: "searchPubmed.php", milliseconds_progressbar: 800
                    , max_length_search_term_short: 115, timeout: 120000

                }
            ] 
            //Example links for each integration
            , examples: {
                examples_integration1: {
                    example_text: "Try out:",
                    examples: [
                        {text: "covid-19", link: "url"}
                    ]
                }
            }
            //empty shell for filter options - do not fill in here, fill in in PHP part above
            , filter_options: {}
        }
        , waiting_page_options: {
            //Enable/disable adding of a link to the original search engine when not enough results can be retrieved
            //Currently only functional for BASE and PubMed
            add_not_enough_results_links: false
            //Whether the vis_page is a cool URI (e.g. "map/21043904") or uses standard parameter form (e.g. "vis?id=21043904")
            , vis_page_cool_uri: false
            // Parameters for the vis page
            // id: id in post_params array
            // name: name of the param passed to vis page
            // (optional) value: a specific value for this parameter
            //      example: { id: 'embed', name: 'embed', value: 'true' } sets parameter 'embed' to true
            //      you can also transform parameter values here with key value pairs
            //      , e.g. value: {'triple_km': 'overview', 'triple_sg': 'timeline'} 
            , vis_page_params: [
                { id: 'unique_id', name: 'id' }
                , {id: "optradio", "name": "vis_type", value: {'triple_km': 'overview', 'triple_sg': 'timeline'}}
                , { id: 'embed', name: 'embed', value: "true" }
            ]
            // For cool URIs the ability to add "classic" parameters with "&param=value"
            // For classic URIs, it will simply append the parameters in here
            , vis_page_additional_params: [
            ]
            //Default API error reason
            , default_api_error: "timeout"
            //Additional API errors and their related texts
            , additional_api_errors: {
                "API error: timeout": "timeout"
                , "API error: requested metadata size": "pubmed_502_error"
                , "API error: PubMed not reachable": "pubmed_500_error"
                , "unexpected PubMed API error": "pubmed_unexpected_error"
                , "unexpected data processing error": "server_error"
                , "database connection error": "database_connection_error"
                , "dataprocessing rate limit": "rate_limit"
                , "API error: BASE not reachable": "base_xml_error"
                , "BASE error: timeout": "base_timeout_error"
                , "API error: q_advanced": "q_advanced_error"
                , "project id or funder id wrong": "project_id_error"
                , "not enough results for project": "project_no_results_error"
            }
            //Reason to always add to the list of error reasons
            , error_reason_always_add: [
                'typo'
            ]
        }
        //Texts for the waiting page
        , waiting_page_texts: {
            longer_than_expected_text: 'We are currently experiencing high demand for our services. Therefore creating your visualisation takes longer than expected. Please stay tuned!'
            , waiting_title: 'Your <span class="vis_type_name">knowledge map</span> on <strong id="search_term"></strong> is being created!'
            , status_waiting: 'Please be patient, this takes around 20 seconds.<br>While you are waiting, find out how the <span class="vis_type_name">knowledge map</span> is being created below.'
            , try_again_title: 'Have another try!'
        }
        //Translations for potential error reasons when not enough results are returned
        , error_reason_translation: {
            'timeframe too short': 'Increase the custom time range'
            , 'query length': 'Try a shorter query'
            , 'too specific': 'Try keywords instead of long phrases'
            , 'typo': 'Check if you have a typo in your query'
        }
        //Error texts
        , error_texts: {
            not_enough_results: {
                title: 'Sorry! We could not create a <span class="vis_type_name">knowledge map</span>.'
                , reason: 'Most likely there were not enough results for <strong id="search_term_fail"></strong> with the selected search options.'
                , remedy: "<strong>Here are some tips to improve your query:</strong>"
                , more_info: '<span id="more-info-service-desc">Alternatively you can <a class="underline" id="more-info-link_na" target="_blank">check out results for your search query on <span id="more-info-link_service"></span></a>. </span>For more information about our service please <a class="underline" href="https://openknowledgemaps.org/faq" target="_blank">see our FAQs</a>.'
                , contact: 'If you think that there is something wrong with our service, please let us know at <a class="underline" href="mailto:info@openknowledgemaps.org">info@openknowledgemaps.org</a>. Please include the search query in your message.'
                , resolution_type: "link"
                , resolution_label: "Try again"
                , resolution_link: "index"
            },
            connection_error: {
                title: "Connection lost"
                , reason: "It seems that your Internet is unavailable or the connection was reset."
                , remedy: 'Please check your Internet settings and try again by <a class="underline" style="cursor:pointer" onClick="window.location.reload();">refreshing this page</a>.'
                , resolution_type: "link"
                , resolution_label: "Refresh this page"
                , resolution_link: "javascript:location.reload()"

            },
            server_error: {
                title: "Sorry! An unexpected error occurred."
                , reason: 'Unfortunately we don’t know what went wrong. We apologize for the inconvenience. Please <a id="fail-index" class="underline" href="index.php">try again</a> in a few minutes.'
                , remedy: 'If the error persists, please let us know at <a class="underline" href="mailto:info@openknowledgemaps.org">info@openknowledgemaps.org</a>. We will investigate the issue further.'
                , resolution_type: "link"
                , resolution_label: "Try again"
                , resolution_link: "index"

            },
            database_connection_error: {
                title: "Database connection lost"
                , reason: 'At the moment we are unable to establish a connection to our database. This can have a number of reasons, most likely our server is down. As a result we can’t create a visualisation for your query. Please <a href="index.php">try again</a> in a few minutes.'
                , remedy: 'If the error persists, please let us know at <a class="underline" href="mailto:info@openknowledgemaps.org">info@openknowledgemaps.org</a>. We will investigate the issue further.'
                , resolution_type: "link"
                , resolution_label: "Try again"
                , resolution_link: "index"

            },
            no_post_data: {
                title: "Ooops! You should not be here..."
                , reason: 'We apologize for this slight detour. You will be redirected to <a id="fail-index" class="underline" href="index">our search page</a> in 10 seconds.'
                , contact: 'For more information about our service please <a class="underline" href="https://openknowledgemaps.org/faq" target="_blank">see our FAQs</a>. If you think that there is something wrong with our service, please let us know at <a class="underline" href="mailto:info@openknowledgemaps.org">info@openknowledgemaps.org</a>'
                , resolution_type: "link"
                , resolution_label: "Go to search page"
                , resolution_link: "index"

            },
            timeout: {
                title: "We didn't anticipate this taking so long - unfortunately your request timed out."
                , reason: "It might be that too many people are currently creating <span class=\"vis_type_name\">knowledge map</span>s. You may also have lost your Internet connection."
                , remedy: 'In any case, we recommend to check your Internet settings and try again by <a class="underline" style="cursor:pointer" onClick="window.location.reload();">refreshing this page</a>.'
                , contact: 'For more information about our service please <a class="underline" href="https://openknowledgemaps.org/faq" target="_blank">see our FAQs</a>. If you think that there is something wrong with our service, please let us know at <a class="underline" href="mailto:info@openknowledgemaps.org">info@openknowledgemaps.org</a>'
                , resolution_type: "link"
                , resolution_label: "Try again"
                , resolution_link: "javascript:location.reload()"

            },
            rate_limit: {
                title: "Sorry! We are experiencing too many requests."
                , reason: "Unfortunately this means, we cannot create your <span class=\"vis_type_name\">knowledge map</span> at the moment. Your request will be added to the queue. This page will be automatically updated in 20 seconds. Thank you for your patience."
                , contact: 'If the error persists, please let us know at <a class="underline" href="mailto:info@openknowledgemaps.org">info@openknowledgemaps.org</a>. We will investigate the issue further.'
                , resolution_type: "countdown"
                , resolution_label: "The page will be updated in"
                , resolution_countdown: 20

            },
            pubmed_unexpected_error: {
                title: "An unexpected error occurred while retrieving data from PubMed."
                , reason: "The PubMed API is currently experiencing problems. We have logged the error and will investigate the issue."
                , remedy: 'Please <a class="underline" style="cursor:pointer" onClick="window.location.reload();">try again</a> in a few minutes or <a class="underline" style="cursor:pointer" href="index">use the BASE integration</a>, which also covers the articles indexed in PubMed.'
                , contact: 'For more information about our service please <a class="underline" href="https://openknowledgemaps.org/faq" target="_blank">see our FAQs</a>. If you think that there is something wrong with our service, please let us know at <a class="underline" href="mailto:info@openknowledgemaps.org">info@openknowledgemaps.org</a>'
                , resolution_type: "link"
                , resolution_label: "Try again"
                , resolution_link: "index"

            },
            pubmed_500_error: {
                title: "The PubMed API is currently experiencing down time."
                , reason: "Unfortunately this means, at the moment we cannot provide <span class=\"vis_type_name\">knowledge map</span>s for PubMed."
                , remedy: 'Please <a class="underline" style="cursor:pointer" onClick="window.location.reload();">try again</a> in a few minutes or <a class="underline" style="cursor:pointer" href="index">use the BASE integration</a>, which also covers the articles indexed in PubMed.'
                , contact: 'For more information about our service please <a class="underline" href="https://openknowledgemaps.org/faq" target="_blank">see our FAQs</a>. If you think that there is something wrong with our service, please let us know at <a class="underline" href="mailto:info@openknowledgemaps.org">info@openknowledgemaps.org</a>'
                , resolution_type: "link"
                , resolution_label: "Try again"
                , resolution_link: "index"

            },
            pubmed_502_error: {
                title: "An error occurred while retrieving data from PubMed."
                , reason: "Unfortunately this means we cannot create a <span class=\"vis_type_name\">knowledge map</span> for this search."
                , remedy: 'Please <a class="underline" style="cursor:pointer" onClick="window.location.reload();">try again</a> with a different search term or <a class="underline" style="cursor:pointer" href="index">use the BASE integration</a>, which also covers the articles indexed in PubMed.'
                , contact: 'For more information about our service please <a class="underline" href="https://openknowledgemaps.org/faq" target="_blank">see our FAQs</a>. If you think that there is something wrong with our service, please let us know at <a class="underline" href="mailto:info@openknowledgemaps.org">info@openknowledgemaps.org</a>'
                , resolution_type: "link"
                , resolution_label: "Try again"
                , resolution_link: "index"

            },
            base_xml_error: {
                title: "The API of our data source provider BASE is currently experiencing down time."
                , reason: "Unfortunately this means, at the moment we cannot create <span class=\"vis_type_name\">knowledge map</span>s for this data source."
                , remedy: 'Please <a class="underline" style="cursor:pointer" onClick="window.location.reload();">try again</a> in a few minutes.'
                , contact: 'For more information about our service please <a class="underline" href="https://openknowledgemaps.org/faq" target="_blank">see our FAQs</a>. If you think that there is something wrong with our service, please let us know at <a class="underline" href="mailto:info@openknowledgemaps.org">info@openknowledgemaps.org</a>'
                , resolution_type: "link"
                , resolution_label: "Try again"
                , resolution_link: "index"

            },
            base_timeout_error: {
                title: "An unexpected error occurred while retrieving data from BASE."
                , reason: "The BASE API is currently experiencing problems. We have logged the error and will investigate the issue."
                , remedy: 'Please <a class="underline" style="cursor:pointer" onClick="window.location.reload();">try again</a> in around 10 seconds.'
                , contact: 'For more information about our service please <a class="underline" href="https://openknowledgemaps.org/faq" target="_blank">see our FAQs</a>. If you think that there is something wrong with our service, please let us know at <a class="underline" href="mailto:info@openknowledgemaps.org">info@openknowledgemaps.org</a>'
                , resolution_type: "link"
                , resolution_label: "Refresh this page"
                , resolution_link: "javascript:location.reload()"

            },
            q_advanced_error: {
                title: "Sorry! We could not create a knowledge map."
                , reason: "Most likely there were not enough results for your search query."
                , remedy: 'We recommend adjusting the query and trying again (e.g. use keywords instead of long phrases, use only one of the q fields).'
                , contact: 'For more information about our service please <a class="underline" href="https://openknowledgemaps.org/faq" target="_blank">see our FAQs</a>. If you think that there is something wrong with our service, please let us know at <a class="underline" href="mailto:info@openknowledgemaps.org">info@openknowledgemaps.org</a>'
                , resolution_type: "link"
                , resolution_label: "Refresh this page"
                , resolution_link: "javascript:location.reload()"

            },
            project_id_error: {
                title: "Sorry! We could not create a knowledge map."
                , reason: 'You may have entered a wrong project ID and/or funder.'
                , remedy:  'Please adjust the project ID and/or funder and try again.'
                , contact: 'For more information about our service please <a class="underline" href="https://openknowledgemaps.org/faq" target="_blank">see our FAQs</a>. If you think that there is something wrong with our service, please send a message summarising the issue to <a class="underline" href="mailto:info@openknowledgemaps.org">info@openknowledgemaps.org</a>'
                , resolution_type: "link"
                , resolution_label: "Refresh this page"
                , resolution_link: "javascript:location.reload()"

            },
            project_no_results_error: {
                title: "Sorry! We could not create a knowledge map."
                , reason: 'There are no results for the given project.'
                , remedy: 'Please try again with another project ID.'
                , contact: 'For more information about our service please <a class="underline" href="https://openknowledgemaps.org/faq" target="_blank">see our FAQs</a>. If you think that there is something wrong with our service, please let us know at <a class="underline" href="mailto:info@openknowledgemaps.org">info@openknowledgemaps.org</a>'
                , resolution_type: "link"
                , resolution_label: "Refresh this page"
                , resolution_link: "javascript:location.reload()"

            },
        }
        , vis_page_options: {
            //Fit visualization div to page
            fit_to_page: false
        }
        //Banner texts
        , banner_texts: {
            browser_unsupported_warning: 'You are using <strong>an unsupported browser</strong>. This website was successfully tested with the latest versions of <strong>Firefox, Chrome, Safari, Opera, and Edge</strong>. We strongly suggest <strong>to switch to one of the supported browsers.</strong>' 
            , mobile_warning: 'Note: the visualization isn\'t optimized for mobile yet, you may encounter some rough edges.'
            , alternate_desktop_warning: 'This is a prototype - you may encounter some rough edges'
        }
    }
    
    if(typeof search_flow_config_local !== "undefined") {
        Object.keys(search_flow_config).forEach(function (key) {
            if(search_flow_config_local.hasOwnProperty(key)) {
                Object.assign(search_flow_config[key], search_flow_config_local[key]);
            }
        });
    }
    
    <?php foreach($search_flow_config["filter_options"] as $name => $options): ?>
        search_flow_config.search_options.filter_options.<?= $name; ?> = <?= json_encode($options) ?>;
    <?php endforeach; ?>
</script>
