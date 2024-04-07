# copy button
![tests](https://github.com/bicycle-codes/copy-button/actions/workflows/nodejs.yml/badge.svg)
[![module](https://img.shields.io/badge/module-ESM-blue?style=flat-square)](README.md)
[![semantic versioning](https://img.shields.io/badge/semver-2.0.0-blue?logo=semver&style=flat-square)](https://semver.org/)
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
There are several options.

### Bundler
Import this file. It depends on [tonic](https://github.com/bicycle-codes/tonic) and [clipboard-copy](https://github.com/feross/clipboard-copy), so you will need to provide them somehow, either through a bundler or `importmap`.


#### example
You *must* use an ID attribute, because the `CopyButton` element contains state.

```js
import Tonic from '@bicycle-codes/tonic'
import { CopyButton, SuccessSvg, CopySvg } from '@bicycle-codes/copy-button'
import '@bicycle-codes/copy-button/style.css'

function ButtonExample () {
    // this needs an ID attribute
    return this.html`
        <copy-button class="copy example" id="example"></copy-button>
    `
}

Tonic.add(ButtonExample)
Tonic.add(CopyButton)
Tonic.add(SuccessSvg)
Tonic.add(CopySvg)
```

### pre-bundled
First copy the bundled file to a location that is accessible to your web server:

```sh
cp ./node_modules/@bicycle-codes/copy-button/dist/index.bundle.js ./public/copy-button.js
```

Then link to the bundled file, and you can use as an html element.

```html
<body>
    <copy-button></copy-button>
</div>
<script type="module" src="./copy-button.js"></script>
```

### pre-bundled + minifed
Copy the bundled and minified file to a location that is accessible to your web server:

```sh
cp ./node_modules/@bicycle-codes/copy-button/dist/index.bundle.min.js ./public/copy-button.min.js
```

Link to the minified file in HTML:

```html
<body>
    <copy-button></copy-button>
</div>
<script type="module" src="./copy-button.min.js"></script>
```

## CSS
Override the variable `--success-color` to customize the color.

```css
.copy-button {
    --success-color: green;
}
```

--------------------------------------------------------

Create a button like this

![screenshot of the button, pre-click](image.png)

-------

![screenshot of the button, post-click](image-1.png)
