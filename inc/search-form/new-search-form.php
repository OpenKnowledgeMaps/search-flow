<div id="search_box_container" class="<?php echo isset($search_box_class) ? $search_box_class : "" ?>"></div>

<!--
    ⚠️ Development Note:
    When working in development mode, replace the following:

    1. "react.production.min.js"     ➜ "react.development.js"
    2. "react-dom.production.min.js" ➜ "react-dom.development.js"
-->
<script src="search-flow/lib/react.production.min.js"></script>
<script src="search-flow/lib/react-dom.production.min.js"></script>

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
