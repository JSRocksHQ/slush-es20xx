# ![slush-es20xx logo](logo.png)
[![npm version](http://img.shields.io/npm/v/slush-es20xx.svg)](https://npmjs.org/package/slush-es20xx)
[![Build Status](http://img.shields.io/travis/JSRocksHQ/slush-es20xx.svg)](https://travis-ci.org/JSRocksHQ/slush-es20xx)
[![Dependency Status](http://img.shields.io/david/JSRocksHQ/slush-es20xx.svg)](https://david-dm.org/JSRocksHQ/slush-es20xx)
[![devDependency Status](http://img.shields.io/david/dev/JSRocksHQ/slush-es20xx.svg)](https://david-dm.org/JSRocksHQ/slush-es20xx#info=devDependencies)

Full ECMAScript.next development and deployment workflow.

# Install

es20xx requires npm >= 2.11. Update npm, install [Slush](https://slushjs.github.io/) and slush-es20xx:

```
npm install -g npm slush slush-es20xx
```

# How to use

Scaffold a new project:

```
slush es20xx
```

Then `cd` to the project root and run `npm run dev`. You're all set, happy hacking!

# Architecture

## npm scripts

- `npm test`: do a complete build. This script builds the `dist` directory based on the `src` directory's contents. This includes linting `.js` files (ESLint), transpiling them, copying over non-js files and running Mocha unit tests.

- `npm run dev`: do a complete build and watch files to generate incremental builds.

- `npm run update-babel`: update the Babel dependencies. This script updates the Babel compiler and runtime, and fails with an error and non-zero exit status if their versions mismatch.

**Note:** There may be other, non-documented scripts in the `package.json`, but those are for internal use only and may be changed or removed any time. Only use the scripts which you see documented here.

## build configs

Build paths and plugin settings can be customized by editing the `build.js` file.

The build configs are kept in a separate file so you can more easily update the `gulpfile.js` by simply overwriting the old one when a new es20xx release is available.

## Deploying

Run [`npm version`](https://docs.npmjs.com/cli/version) to increment your package version. This will automatically update the Babel dependencies, make a new build and run tests. If everything succeeds, it will push your version commit and tag to the remote Git repository and publish the package on npm.

You may tweak the `prepublish` and `postpublish` scripts to your needs, just edit them in the `package.json`.

# Contribute

Want to help developing slush-es20xx? Awesome! Here are the basic instructions to get you started:

1. Install [Slush](https://github.com/slushjs/slush) if you haven't yet;
1. Fork this repository and clone it locally;
1. `cd` to your repository root and install the slush-es20xx generator from your local repository by running `npm link`;
1. Edit the source code in your repository and then test the changes by running `slush es20xx` in a test directory. Repeat until you get the desired result;
1. Commit your changes to a new feature/bugfix branch, push them to your fork and open a PR in this repository. See [GitHub Flow](https://guides.github.com/introduction/flow/index.html) if you are not used to it yet. `=]`

# License

[WTHPL v1.0.0](LICENSE)
