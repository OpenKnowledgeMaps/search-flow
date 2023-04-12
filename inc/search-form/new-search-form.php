<div id="search_box_container" class="<?php echo isset($search_box_class) ? $search_box_class : "" ?>"></div>

<!-- Note: when developing, replace "production.min.js" with "development.js". -->
<script src="search-flow/lib/react.development.js"></script>
<script src="search-flow/lib/react-dom.development.js"></script>

<script>
    var searchboxSettings = {
        query: "<?php echo isset($search_query) ? $search_query : "" ?>",
        showOptions: <?php echo isset($open_options) && $open_options ? "true" : "false" ?>,
    };
    if (typeof post_data === "object") {
        searchboxSettings = {
            ...post_data,
            ...searchboxSettings
        };
    }
</script>

<script type="module" src="search-flow/js/searchbox/runner.js"></script>
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"/>
<meta name="referrer" content="origin-when-cross-origin"/>
