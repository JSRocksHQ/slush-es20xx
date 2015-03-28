# ![slush-es20xx logo](logo.png)
[![npm version](http://img.shields.io/npm/v/slush-es20xx.svg)](https://npmjs.org/package/slush-es20xx)
[![Build Status](http://img.shields.io/travis/es6rocks/slush-es20xx.svg)](https://travis-ci.org/es6rocks/slush-es20xx)
[![Dependency Status](http://img.shields.io/david/es6rocks/slush-es20xx.svg)](https://david-dm.org/es6rocks/slush-es20xx)
[![devDependency Status](http://img.shields.io/david/dev/es6rocks/slush-es20xx.svg)](https://david-dm.org/es6rocks/slush-es20xx#info=devDependencies)

Full ECMAScript.next development and deployment workflow.

# What makes slush-es20xx better than other ES.next workflows?

Simply put, an incremental build strategy that *just works*. The internals are actually [pretty complicated](https://github.com/es6rocks/slush-es20xx/issues/5#issue-52701608), but don't worry, we take care of it for you! :smile:

# Install

Install [Slush](https://slushjs.github.io/) and slush-es20xx:

```
npm install -g slush slush-es20xx
```

# How to use

Scaffold a new project:

```
slush es20xx
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

Want to help developing slush-es20xx? Awesome! Here are the basic instructions to get you started:

1. Install [Slush](https://github.com/slushjs/slush) if you haven't yet;
1. Fork this repository and clone it locally;
1. `cd` to your repository root and install the slush-es20xx generator from your local repository by running `npm link`;
1. Edit the source code in your repository and then test the changes by running `slush es20xx` in a test directory. Repeat until you get the desired result;
1. Commit your changes to a new feature/bugfix branch, push them to your fork and open a PR in this repository. See [GitHub Flow](https://guides.github.com/introduction/flow/index.html) if you are not used to it yet. `=]`

# License

[WTHPL v1.0.0](LICENSE)
