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
    //Enable/disable GET requests
    , "enable_get_requests" => false
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
            , default_api_error: "not_enough_results"
            //Additional API errors and their related texts
            , additional_api_errors: {
                "API error: timeout": "timeout"
                , "API error: requested metadata size": "pubmed_502_error"
                , "API error: PubMed not reachable": "pubmed_500_error"
                , "unexpected PubMed API error": "pubmed_unexpected_error"
                , "unexpected data processing error": "server_error"
            }
            //Reason to always add to the list of error reasons
            , error_reason_always_add: [
                'typo'
            ]
        }
        //Texts for the waiting page
        , waiting_page_texts: {
            longer_than_expected_text: 'Creating your visualization takes longer than expected. Please stay tuned!'
            , waiting_title: 'Your <span id="vis_type_name"></span> on <strong id="search_term"></strong> is being created!'
            , status_waiting: 'Please be patient, this takes around 20 seconds.<br>While you are waiting, find out how the knowledge map is being created below.'
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
                title: "Sorry! We could not create a knowledge map."
                , reason: 'Most likely there were not enough results for <strong id="search_term_fail"></strong> with the selected search options.'
                , remedy: "<strong>Here are some tips to improve your query:</strong>"
                , more_info: 'Alternatively you can <a class="underline" id="more-info-link_na" target="_blank">check out results for your search query on <span id="more-info-link_service"></span></a>. For more information about our service please <a class="underline" href="https://openknowledgemaps.org/faq">see our FAQs</a>.'
                , contact: 'If you think that there is something wrong with our service, please let us know at <a class="underline" href="mailto:info@openknowledgemaps.org">info@openknowledgemaps.org</a>. Please include the search query in your message.'
                , "resolution": "Try again"
                , "resolution_link": "index"
            },
            connection_error: {
                title: "Connection lost"
                , reason: "It seems that your Internet is unavailable or the connection was reset."
                , remedy: 'Please check your Internet settings and try again by <a class="underline" style="cursor:pointer" onClick="window.location.reload();">refreshing this page</a>.'
                , "resolution": "Refresh this page"
                , "resolution_link": "javascript:location.reload()"

            },
            server_error: {
                title: "Sorry! An unexpected error occurred."
                , reason: 'Unfortunately we don’t know what went wrong. We apologize for the inconvenience. Please <a class="underline" href="index.php">try again</a> in a few minutes.'
                , remedy: 'If the error persists, please let us know at <a class="underline" href="mailto:info@openknowledgemaps.org">info@openknowledgemaps.org</a>. We will investigate the issue further.'
                , "resolution": "Try again"
                , "resolution_link": "index"

            },
            no_post_data: {
                title: "Ooops! You should not be here..."
                , reason: 'We apologize for this slight detour. You will be redirected to <a class="underline" href="index">our search page</a> in 10 seconds.'
                , contact: 'For more information about our service please <a class="underline" href="https://openknowledgemaps.org/faq">see our FAQs</a>. If you think that there is something wrong with our service, please let us know at <a class="underline" href="mailto:info@openknowledgemaps.org">info@openknowledgemaps.org</a>'
                , "resolution": "Go to search page"
                , "resolution_link": "index"

            },
            timeout: {
                title: "We didn't anticipate this taking so long - unfortunately your request timed out."
                , reason: "It might be that too many people are currently creating knowledge maps. You may also have lost your Internet connection."
                , remedy: 'In any case, we recommend to check your Internet settings and try again by <a class="underline" style="cursor:pointer" onClick="window.location.reload();">refreshing this page</a>.'
                , contact: 'For more information about our service please <a class="underline" href="https://openknowledgemaps.org/faq">see our FAQs</a>. If you think that there is something wrong with our service, please let us know at <a class="underline" href="mailto:info@openknowledgemaps.org">info@openknowledgemaps.org</a>'
                , "resolution": "Refresh this page"
                , "resolution_link": "javascript:location.reload()"

            },
            pubmed_unexpected_error: {
                title: "An unexpected error occurred while retrieving data from PubMed."
                , reason: "The PubMed API is currently experiencing problems. We have logged the error and will investigate the issue."
                , remedy: 'Please <a class="underline" style="cursor:pointer" onClick="window.location.reload();">try again</a> in a few minutes or <a class="underline" style="cursor:pointer" href="index">use the BASE integration</a>, which also covers the articles indexed in PubMed.'
                , contact: 'For more information about our service please <a class="underline" href="https://openknowledgemaps.org/faq">see our FAQs</a>. If you think that there is something wrong with our service, please let us know at <a class="underline" href="mailto:info@openknowledgemaps.org">info@openknowledgemaps.org</a>'
                , "resolution": "Try again"
                , "resolution_link": "index"

            },
            pubmed_500_error: {
                title: "The PubMed API is currently experiencing down time."
                , reason: "Unfortunately this means, at the moment we cannot provide knowledge maps for PubMed."
                , remedy: 'Please <a class="underline" style="cursor:pointer" onClick="window.location.reload();">try again</a> in a few minutes or <a class="underline" style="cursor:pointer" href="index">use the BASE integration</a>, which also covers the articles indexed in PubMed.'
                , contact: 'For more information about our service please <a class="underline" href="https://openknowledgemaps.org/faq">see our FAQs</a>. If you think that there is something wrong with our service, please let us know at <a class="underline" href="mailto:info@openknowledgemaps.org">info@openknowledgemaps.org</a>'
                , "resolution": "Try again"
                , "resolution_link": "index"

            },
            pubmed_502_error: {
                title: "An error occurred while retrieving data from PubMed."
                , reason: "Unfortunately this means we cannot create a knowledge map for this search."
                , remedy: 'Please <a class="underline" style="cursor:pointer" onClick="window.location.reload();">try again</a> with a different search term or <a class="underline" style="cursor:pointer" href="index">use the BASE integration</a>, which also covers the articles indexed in PubMed.'
                , contact: 'For more information about our service please <a class="underline" href="https://openknowledgemaps.org/faq">see our FAQs</a>. If you think that there is something wrong with our service, please let us know at <a class="underline" href="mailto:info@openknowledgemaps.org">info@openknowledgemaps.org</a>'
                , "resolution": "Try again"
                , "resolution_link": "index"


            },
        }
        , vis_page_options: {
            //Fit visualization div to page
            fit_to_page: false
        }
        //Banner texts
        , banner_texts: {
            browser_unsupported_warning: 'You are using <strong>an unsupported browser</strong>. This website was successfully tested with the latest versions of <strong>Firefox, Chrome, Safari, Opera, and Edge</strong>. We strongly suggest <strong>to switch to one of the supported browsers.</strong>' 
            , mobile_warning: 'Note: the map isn\'t optimized for mobile yet, you may encounter some rough edges.'
            , alternate_desktop_warning: 'This is a prototype - you may encounter some rough edges'
        }
        //Knowledge map context texts
        , context_texts: {
            citation_intro: 'Please cite this map as follows:'
        }
    }
    
    if(typeof search_flow_config_local !== "undefined") {
        for(const [key, value] of Object.entries(search_flow_config)) {
            let config_option = key;
            if(search_flow_config_local.hasOwnProperty(config_option)) {
                Object.assign(search_flow_config[config_option]
                                , search_flow_config_local[config_option])
            }
        }
    }
    
    <?php foreach($search_flow_config["filter_options"] as $name => $options): ?>
        search_flow_config.search_options.filter_options.<?= $name; ?> = <?= json_encode($options) ?>;
    <?php endforeach; ?>
</script>
