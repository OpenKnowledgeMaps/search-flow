# About this folder

This folder contains tests and their configurations for PHP scripts in the `/php` folder.

It contains three main folders:

1. functions - this is the folder with the tests themselves;
2. docker is the folder with the dockerfile;
3. configuration - a folder for storing test configurations.

Tests implemented using `PHPUnit`. All tests are run in the docker container.

## How to run tests

To run the tests, you need to follow the two steps below:

1. Build docker container:

   ```
   docker build -t php-test php/tests/docker
   ```

2. Run container with tests:

   ```
   docker run --rm -v $(pwd)/php:/app php-test phpunit --configuration tests/configuration/phpunit.xml
   ```
