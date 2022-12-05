# search-flow
This package provides a modular, customizable workflow for creating knowledge maps with Head Start. It is written in PHP and JavaScript and intended for use in PHP-based websites

## Usage
Drop the package into your example or add it as a submodule. In a next step, copy and rename config.ini to config_local.ini and set the paths to Head Start and the search-flow module on your webserver. You can also enable the debug mode and [GET requests](doc/GET_route.md) for the search page.

Now you can add the components from the `inc` directory to your example. A typical Head Start example consists of the following elements:

* Search form: `head-search-form.php` & `search-form.php`
* Waiting page: `head-search-form.php`,  `waiting-page-header.php` &`waiting-page.php`
* Visualization: `head-min.php`,  `visualization-header.php` & `visualization.php`

In addition, banners for use on all pages and components providing additional context to a visualization are provided.

All components can be configured by creating a local config file, which should be based on `conf/config.php` and located in the parent directory of `search-flow`. Every parameter can be overridden by setting the same parameter in a `$search_flow_config_local` array (for PHP-based settings) or a `search_flow_config_local` object (for JavaScript-based settings).

Your own CSS file should be located in the overall project folder (e.g. examples/triple). To override the **CSS**, include your own CSS file below the last included component. The CSS file has to be included in following files (warning: file names might differ in your project): index.php, search.php, headstart.php.

For an example to build on top of, refer to the [TRIPLE example](https://github.com/OpenKnowledgeMaps/Headstart/tree/master/examples/triple) in Head Start.

For more information on GET requests, please refer to the [GET route & parameters](doc/GET_route.md) document.

## Local development with minimal search box example

A containerized environment for the new search box  has been set up with a minimal example (no backend integration).

To work with this environment, docker and docker-compose are needed.

* Run the example:

`docker-compose up`

* Navigate to `http://localhost:8085/entrypoint.php`

The new search box should be visible, and changes in the code will show after a page reload.

## Notes

The current implementation is extracted from https://github.com/OpenKnowledgeMaps/project-website and turned into a reusable package. As such, there is of course room for improvement; but the package should nevertheless alleviate the process of rewriting the search-flow for every Head Start integration.

## License
MIT
