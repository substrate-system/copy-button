# copy button
![tests](https://github.com/bicycle-codes/copy-button/actions/workflows/nodejs.yml/badge.svg)
[![module](https://img.shields.io/badge/module-ESM-blue?style=flat-square)](README.md)
[![semantic versioning](https://img.shields.io/badge/semver-2.0.0-blue?logo=semver&style=flat-square)](https://semver.org/)
[![dependencies](https://img.shields.io/badge/dependencies-zero-brightgreen.svg?style=flat-square)](package.json)
[![license](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE)

A button to copy some text to the system clipboard, made with webcomponents.

## install
```sh
npm i -S @bicycle-codes/copy-button
```

## demonstration

See [bicycle-codes.github.io/copy-button](https://bicycle-codes.github.io/copy-button/) for an example with the default CSS.

## globals
This looks at a css variable `--success-color`, which determines the color the checkmark that is displayed after you copy something.


## use
Include this package, then use the tag `<copy-button>` in HTML.

### Example without a build step

#### Copy the files

##### JS
```sh
cp ./node_modules/@bicycle-codes/copy-button/dist/bundle.min.js public/copy-button.js
```

##### CSS
```sh
cp ./node_modules/@bicycle-codes/copy-button/dist/style.min.css public/copy-button.css
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
import '@bicycle-codes/copy-button'

// bundled
import '@bicycle-codes/copy-button/bundle'

// bundled + minified
import '@bicycle-codes/copy-button/min'

// style
import '@bicycle-codes/copy-button/style.css'

// style, minifed
import '@bicycle-codes/copy-button/min/style.css'
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
