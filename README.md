# 6to5-node-skeleton
[![Build Status](http://img.shields.io/travis/UltCombo/6to5-node-skeleton.svg)](https://travis-ci.org/UltCombo/6to5-node-skeleton)
[![Dependency Status](http://img.shields.io/david/UltCombo/6to5-node-skeleton.svg)](https://david-dm.org/UltCombo/6to5-node-skeleton)
[![devDependency Status](http://img.shields.io/david/dev/UltCombo/6to5-node-skeleton.svg)](https://david-dm.org/UltCombo/6to5-node-skeleton#info=devDependencies)

ECMAScript.next Node.js package skeleton using the 6to5 transpiler.

# How to use

- Clone or [download](https://github.com/UltCombo/6to5-node-skeleton/archive/master.zip) this repository.
- Edit the `package.json` to your liking (`TODO` make a slush generator?)
- `npm i`
- `npm run dev`
- Hack away!

# Architecture

## `npm run dev`

The `npm run dev` command is an alias for running `grunt`'s default task. The advantage of the `npm run dev` command over `grunt` is that it does not require a global `grunt-cli` installed.

## Grunt tasks

- `grunt` (default): executes `build`, `test` and `watch` tasks.
- `grunt build`: this task will build the `dist` directory based on the `src` directory's contents. More specifically, it will make a new build by transpiling all of the `src` directory's `.js` files and copying all non-JS files to `dist`, keeping the same directory structure.
- `grunt test`: runs JSHint, JSCS and Mocha tests.
- `grunt watch`: watches the `src` directory for changes, incrementally builds `dist` and runs the corresponding tests.
