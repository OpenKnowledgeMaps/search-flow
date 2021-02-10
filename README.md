# search-flow
This package provides a modular, customizeable workflow for creating knowledge maps with Head Start. It is written in PHP and JavaScript and intended for use in PHP-based websites

## Usage
Drop the package into your example or add it as a submodule. In a next step, copy and rename config.ini to config_local.ini and set the paths to Head Start and the search-flow module on your webserver.

Now you can add the components from the `inc` directory to your example. A typical Headstart example consists of the following elements:

* Search form: `search-form.php`
* Waiting page: `waiting-page.php`
* Visualization: `visualization-header.php` & `visualization.php`

In addition, banners for use on all pages and components providing additional context to a knowledge map are provided.

All components can be configured by creating a local config file, which should be based on `conf/config.php`. Every parameter can be overridden by setting the same parameter in a `$search_flow_config_local` array (for PHP-based settings) or a `search_flow_config_local` object (for JavaScript-based settings).

For an example to build on top of, refer to the [triple example](https://github.com/OpenKnowledgeMaps/Headstart/tree/master/examples/triple) in Head Start.

## Notes

The current implementation is extracted from https://github.com/OpenKnowledgeMaps/project-website and turned into a reusable package. As such, there is of course room for improvement; but the package should nevertheless alleviate the process of rewriting the search-flow for every Head Start integration.

## License
MIT