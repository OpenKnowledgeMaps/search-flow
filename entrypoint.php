<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8" />
    <title>Open Knowledge Maps Search Box</title>

    <link rel="stylesheet" href="lib/bootstrap.min.css">
    <link rel="stylesheet" href="lib/bootstrap-multiselect.css">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" integrity="sha512-1ycn6IcaQQ40/MKBW2W4Rhis/DbILU74C1vSrLJxCq57o941Ym01SwNsOMqvEBFlcgUa6xLiPY/NS5R+E6ztJQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="stylesheet" href="css/search_box.css">

    <script type="module" src="js/searchbox/runner.js"></script>
</head>

<body class="iframed">
    <?php
    $search_box_class = "iframed";
    include 'inc/search-form/new-search-form.php';

    //inlined from project-website/config.example.php
    //clean this up later
    $SITE_URL = "//";
    $HEADSTART_URL = $SITE_URL . "headstart/";
    $COMPONENTS_PATH = "components/";
    $LIB_PATH = "lib/";
    $SEARCH_FLOW_PATH = "./";
    $SNAPSHOT_PATH = $HEADSTART_URL . "server/storage/";

    $PIWIK_ENABLED = false;
    $PIWIK_PATH = "piwik/";
    $PIWIK_SITE_ID = "1";
    # set it to true to force embed mode in Matomo (no cookies)
    $PIWIK_FORCE_EMBED = false;
    $GA_ENABLED = false;
    $GA_CODE = "XX-00000000-0";

    $BASE_DOWN = false;
    $PUBMED_DOWN =  false;
    $COOKIE_DOMAIN = "";
    $GA_ENABLED = false;
    $PIWIK_FORCE_EMBED = true;
    //clean this up later

    //curl
    //pdo_sqlite
    //mbstring
    //fileinfo
    //xml
    ?>



</body>

</html>