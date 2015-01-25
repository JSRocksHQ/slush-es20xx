# [slush](https://github.com/slushjs/slush)-es6
[![npm version](http://img.shields.io/npm/v/slush-es6.svg)](https://npmjs.org/package/slush-es6)
[![Build Status](http://img.shields.io/travis/es6rocks/slush-es6.svg)](https://travis-ci.org/es6rocks/slush-es6)
[![Dependency Status](http://img.shields.io/david/es6rocks/slush-es6.svg)](https://david-dm.org/es6rocks/slush-es6)
[![devDependency Status](http://img.shields.io/david/dev/es6rocks/slush-es6.svg)](https://david-dm.org/es6rocks/slush-es6#info=devDependencies)

ECMAScript.next projects generator.

# Install

First off, install [Slush](https://github.com/slushjs/slush). Then:

```
npm install -g slush-es6@alpha
```

# How to use

Scaffold a new project:

```
slush es6
```

Then `cd` to the project root and run `npm run dev`. You're all set, happy hacking!

# Architecture

## npm scripts

- `npm run dev`: an alias for gulp's default task which does not require `gulp` globally installed.

## gulp tasks

- `gulp` (default): executes the `build` task, if successful then enters watch mode to generate incremental builds.
- `gulp build`: this task will build the `dist` directory based on the `src` directory's contents. This includes linting `.js` files (JSHint, JSCS), transpiling them, copying over non-js files and running Mocha unit tests.

## build configs

Build paths and plugin settings can be customized by editing the chosen environment template's `build.js` file.

# Developing

Want to help developing slush-es6? Awesome! Here are the basic instructions to get you started:

1. Install [Slush](https://github.com/slushjs/slush) if you haven't yet;
1. Fork this repository and clone it locally;
1. `cd` to your repository root and install the slush-es6 generator from your local repository by running `npm link`;
1. Edit the source code in your repository and then test the changes by running `slush es6` in a test directory. Repeat until you get the desired result;
1. Commit your changes to a new feature/bugfix branch, push them to your fork and open a PR in this repository. See [GitHub Flow](https://guides.github.com/introduction/flow/index.html) if you are not used to it yet. `=]`
