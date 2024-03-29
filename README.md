# [Sequelize GraphQL Schema Builder](https://github.com/molaux/sequelize-graphql-schema-builder) and [Node exporter](https://github.com/molaux/node-exporter) example

The goal is to convert a [MySQL Workbench](http://www.mysql.com/products/workbench/) Model to a complete GraphQL API for CRUD operations.

This example uses a [slightly modified version of the Skila sample model](tree/master/data/sakila-db/sakila-modified.mwb) from [MySQL](https://dev.mysql.com/doc/sakila/en/sakila-installation.html) : removed unwanted schemas, renamed redundant foreign keys indexes names and modified `lastUpdate` fields default values that sqlite does not implements.

The sample data script has been modified for sqlite.

## What it does ?

The project loads arbitrary sequelize models, sync it to a Sqlite database stored in memory, and convert it to a complete GraphQL API.

Here, the Sequelize models are generated from a sample MySQL Workbench schema but you can use your own schema file or directly paste your models to `src/models` (you have to remove its content before).

## Install

```bash
$ composer install
$ yarn
```

The project is written for node / ECMAScript module and targetted to use at least node 18. If you use [nvm](https://github.com/nvm-sh/nvm), issue :

```bash
$ nvm use
```

## (Re)generate the models (optionnal)

```bash
$ bin/mysql-workbench-schema-export --export=node-Sequelize6 --config=config/mysql-worbench-exporter.json data/sakila-db/sakila-modified.mwb
```

As written above, your models can be generated by other tools like [sequelize-automate](https://www.npmjs.com/package/sequelize-automate), or you can use your own MySQL Workbench schema too (You should then comment the sample data insertion in `server.js`).

## Test

```bash
$ yarn test
```

## Playground

Have a look at configuration files in the root directory and its `config` subdirectory.

```bash
$ yarn start-dev
```

Note that sample data will be injected at startup.

The playground should be available at [http://localhost:3331/api](http://localhost:3331/api).

## API documentation

[Sequelize GraphQL Schema Builder](https://github.com/molaux/sequelize-graphql-schema-builder)

## Branches

To keep the example simple, branches exists to keep somme demonstartions independant. The master branch combine theme all together.