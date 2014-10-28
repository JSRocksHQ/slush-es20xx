# IN DEVELOPMENT - NOT READY FOR USE YET

# [slush](https://github.com/slushjs/slush)-es6
[![npm version](http://img.shields.io/npm/v/slush-es6.svg)](https://npmjs.org/package/slush-es6)
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

# Developing

Want to help developing slush-es6? Awesome! Here are the basic instructions to get you started:

1. Fork this repository and clone it locally;
- `cd` to your repository root and install the slush-es6 generator from your local repository by running `npm link`;
- Create a test directory somewhere else, `cd` to it and run `slush es6` to execute this generator;
- Edit the source code in your repository and then test the changes by running `slush es6` in a test directory. Repeat until you get the desired result;
- Commit your changes to a new feature/bugfix branch, push them to your fork and open a PR in this repository. See [GitHub Flow](https://guides.github.com/introduction/flow/index.html) if you are not used to it yet. `=]`
