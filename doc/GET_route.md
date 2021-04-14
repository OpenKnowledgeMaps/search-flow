# GET route & parameters
The GET route enables triggering a search via a parameterized call to the waiting page (vs. triggering the search via the search form and a subsequent POST call). 

## Usage
To use the GET route, parameterize the page that includes `waiting-page-header.php` and `waiting-page.php` (usually called `search.php`). 

#### Mandatory parameters

The call has the following mandatory parameters:

* service\*: (*string*) The service you want to use (e.g. `base`, `pubmed`)

* type\*: (*string*) The HTTP request type, `get` or `post`. Must be `get` for the GET route.
* q*: (*string*) The query, e.g. `digital+education`

##### Examples:

search?service=base&type=get&q=digital+education

search?service=base&type=get&q=%22social+responsibility%22

#### Optional parameters

In addition to the mandatory parameters, optional parameters can be set that are the same as in the search form. If optional parameters are not set, the default values for these parameters as defined in the config will be used. Parameters will vary depending on the integration, but common parameters are:

* from: (*string*) date/year from, e.g. `2000-01-01`
* to: (*string*) date/year to, e.g. `2021-02-25`
* sorting: (*string*) `most-relevant` or `most-recent`
* document_types: (*array*) List of document type IDs, for BASE e.g. `121`, `14` or `15`

##### Examples:

search?service=base&type=get&q=digital+education&to=2010-01-01

service=base&type=get&q=digital+education&sorting=most-recent 

service=base&type=get&q=digital+education&document_types[]=14&document_types[]=15 

#### BASE-specific parameters

For the BASE integration on project-website, two new optional parameters have been implemented that are not available via the search form, only via the GET route:

* repo: (*string*) denotes a single repository that the search will be restricted to, e.g. `ftubbiepub`

* coll: (*string*) denotes a collection of repositories that the search will be restricted to, e.g. `at` or `de`

More information on how these two parameters work and what values are valid can be found in the [BASE Interface Guide](https://www.base-search.net/about/download/base_interface.pdf).

##### Examples: 

search?service=base&type=get&q=open+access&coll=at

search?service=base&type=get&q=open+access&repo=ftubbiepub