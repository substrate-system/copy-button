# copy button
![tests](https://github.com/nichoth/copy-button/actions/workflows/nodejs.yml/badge.svg)
[![types](https://img.shields.io/npm/types/@nichoth/copy-button?style=flat-square)](README.md)
[![module](https://img.shields.io/badge/module-ESM-blue?style=flat-square)](README.md)
[![semantic versioning](https://img.shields.io/badge/semver-2.0.0-blue?logo=semver&style=flat-square)](https://semver.org/)
[![license](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE)

A button to copy some text to the system clipboard, made with webcomponents.

## install
```sh
npm i -S @nichoth/copy-button
```

## use

## globals
This looks at a css variable `--success-color`, which is used to color the checkmark that is displayed after you copy something.

### index.js
Import this file. It depends on [tonic](https://github.com/nichoth/tonic) and [clipboard-copy](https://github.com/feross/clipboard-copy), so you will need to provide them somehow, either through a bundler or `importmap`.

```js
import { CopyButton } from '@nichoth/copy-button'
```

### index.bundle.js
Import this file, including all its dependencies.

```js
import { CopyButton } from '@nichoth/copy-button/bundle'
```

### index.min.js
Use a minified version of this file. It includes all dependencies.

```js
import { CopyButton } from '@nichoth/copy-button/min'
```

## example
Include the CSS.

```js
import { CopyButton } from '@nichoth/copy-button'
import '@nichoth/copy-button/style.css'

document.body.innerHTML = `
  <${copy-button} payload="example text">
  </${copy-button}>
`
```

Create a button like this

![screenshot of the button, pre-click](image.png)

-------

![screenshot of the button, post-click](image-1.png)
