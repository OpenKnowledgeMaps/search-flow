<div id="search_box_container" class="<?php echo isset($search_box_class) ? $search_box_class : "" ?>"></div>

<!-- Note: when developing, replace "production.min.js" with "development.js". -->
<script src="https://unpkg.com/react@17/umd/react.development.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js" crossorigin></script>

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