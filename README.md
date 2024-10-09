# copy button
![tests](https://github.com/substrate-system/copy-button/actions/workflows/nodejs.yml/badge.svg)
[![module](https://img.shields.io/badge/module-ESM-blue?style=flat-square)](README.md)
[![types](https://img.shields.io/npm/types/@substrate-system/copy-button?style=flat-square)](./dist/index.d.ts)
[![semantic versioning](https://img.shields.io/badge/semver-2.0.0-blue?logo=semver&style=flat-square)](https://semver.org/)
[![dependencies](https://img.shields.io/badge/dependencies-zero-brightgreen.svg?style=flat-square)](package.json)
[![license](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE)

A button to copy some text to the system clipboard, made with webcomponents, with no dependencies.

## install
```shell
npm i -S @substrate-system/copy-button
```

## demonstration

See [substrate-system.github.io/copy-button](https://substrate-system.github.io/copy-button/) for an example.

## globals
This depends on `@substrate-system/a11y` for a `.visually-hidden` class. Install and import that module as well.

```sh
npm i -S @substrate-system/a11y
```

This looks at css variables `--success-color` and `--copy-color` which determines the color of the success checkmark and copy icon.


## use
Include this package, then use the tag `<copy-button>` in HTML.

### Example without a build step

#### Copy the files
Copy files so they are accessible by your web server.

##### JS
```sh
cp ./node_modules/@substrate-system/copy-button/dist/index.min.js public/copy-button.js
```

##### CSS
```sh
cp ./node_modules/@substrate-system/copy-button/dist/style.min.css public/copy-button.css
```

#### Use in HTML
```html
<head>
    <!-- style -->
    <link rel="stylesheet" href="./copy-button.css">
</head>

<body>
    <!-- use the tag -->
    <copy-button payload="example text"></copy-button>

    <!-- include the script -->
    <script src="/copy-button.js" type="module"></script>
</body>
```

### With a JS build step
We expose several import options

```js
// default, unminified
import '@substrate-system/copy-button'

// minified
import '@substrate-system/copy-button/min'

// style
import '@substrate-system/copy-button/style.css'

// style, minifed
import '@substrate-system/copy-button/min/style.css'
```

In `vite`, for example, import like this

```js
import '@substrate-system/copy-button'
import '@substrate-system/copy-button/style.css'
// or minified css
import '@substrate-system//copy-button/min/style.css'
```

## CSS
Override the variables `--success-color` and `--copy-color` to customize the color.

```css
.copy-button {
    --success-color: green;
    --copy-color: blue;
}
```

--------------------------------------------------------

Create a button like this

![screenshot of the button, pre-click](image.png)

-------

![screenshot of the button, post-click](image-1.png)
