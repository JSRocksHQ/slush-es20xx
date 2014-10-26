# IN DEVELOPMENT - NOT READY FOR USE YET

# [slush](https://github.com/slushjs/slush)-es6
[![NPM version](http://img.shields.io/npm/v/slush-es6.svg)](https://npmjs.org/package/slush-es6)
[![Build Status](http://img.shields.io/travis/es6rocks/slush-es6.svg)](https://travis-ci.org/es6rocks/slush-es6)
[![Dependency Status](http://img.shields.io/david/es6rocks/slush-es6.svg)](https://david-dm.org/es6rocks/slush-es6)
[![devDependency Status](http://img.shields.io/david/dev/es6rocks/slush-es6.svg)](https://david-dm.org/es6rocks/slush-es6#info=devDependencies)

ECMAScript.next projects generator.

# Install

First off, install [Slush](https://github.com/slushjs/slush). Then:

```
npm install -g slush-es6
```

# How to use

Scaffold a new project:

```
slush es6
```

Then `cd` to the project root and run `npm run dev`. You're all set, happy hacking!

# Architecture

## npm scripts

- `npm run dev`: this is an alias for running `grunt`'s default task. The advantage of the `npm run dev` command over `grunt` is that the former does not require a global `grunt-cli` installed.

## Grunt tasks

- `grunt` (default): executes the `build`, `test` and `watch` tasks.
- `grunt build`: this task will build the `dist` directory based on the `src` directory's contents. More specifically, it will transpile all of the `src` directory's `.js` files and copy over all other files to `dist`, keeping the same directory structure.
- `grunt test`: runs JSHint, JSCS and Mocha tests.
- `grunt watch`: watches the `src` directory for changes, incrementally builds `dist` and runs the corresponding tests.
