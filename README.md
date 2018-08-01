# chance-path [![Build Status](https://travis-ci.org/manovotny/chance-path.svg?branch=master)](https://travis-ci.org/manovotny/chance-path)

> A [Chance.js mixin](http://chancejs.com/#mixin) to generate paths.

## Install

### NPM

```
$ npm i chance-path
```

### Yarn

```
$ yarn add chance-path
```

## Usage

```js
import Chance from 'chance';
import path from 'chance-path';

const chance = new Chance();

chance.mixin({
    path
});

chance.path();
```

By default, `chance-path` will return a randomly generated path.

Example: `some/random/path/to/something/somewhere/some.file`

### Options

Below is a list of available configuration options that you can pass into `chance-path`.

```js
chance.path({
    // options
});
```

#### depth

Specifies how deep the path is.

For example, `chance.path({depth: 4})` would produce something like `path/depth/of/four/random.random`.

> Defaults to [`chance.d6()`](http://chancejs.com/#dice).

#### ext

Specifies what the file extension is.

For example, `chance.path({ext: '.custom'})` would produce something like `random/random/random.custom`.

> Defaults to [`chance.word()`](http://chancejs.com/#word).

#### name

Specifies what the file name is.

For example, `chance.path({name: 'custom'})` would produce something like `random/random/custom.random`.

> Defaults to [`chance.word()`](http://chancejs.com/#word).

#### root

Specifies if the path should be a root path.

For example, `chance.path({root: true})` would produce something like `/random/random/random.random`.

> Defaults to [`chance.bool()`](http://chancejs.com/#bool).

## License

MIT © [Michael Novotny](https://manovotny.com)
