SASS CSS pre-processor for NativeScript projects
=======================================
(Based on [nativescript-dev-less plugin](https://github.com/NativeScript/nativescript-dev-less))

[![npm version](https://badge.fury.io/js/nativescript-dev-sass.svg)](https://badge.fury.io/js/nativescript-dev-sass)

----------
This plugin uses the [node-sass compiler](https://www.npmjs.com/package/node-sass) to transpile SCSS files to CSS files in [NativeScript](https://www.nativescript.org/) projects. 


How to use
----------
```
$ tns install sass
```

The above command installs this module and installs the necessary NativeScript hooks. SASS CSS pre-processing of all `.scss` files inside `app` folder happens when the project is prepared for build (including LiveSync, Emulate and Watch commands).

**NOTE: SASS @import syntax**
In some cases, the current version of node-sass requires `@import` statements to explicitly include the filename extension (like `.scss`). This occurs if files with the same name exist in the same path.

Example:
`variables.scss`
`variables.css`
`_variables.scss`

Node-sass will throw an error if the `@import variables;` syntax is used. As a workaround, use an explicit filename, like: `@import variables.scss;`

This will be fixed in node-sass 3.5. [See this issue for more detail](https://github.com/sass/node-sass/issues/1222).

