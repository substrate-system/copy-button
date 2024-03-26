# template ts browser
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

### index.js
Import this file. It depends on [tonic](https://github.com/nichoth/tonic), so you will need to provide `Tonic` somehow, either through a bundler or `importmap`.

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

```js
import { CopyButton } from '@nichoth/copy-button'

document.body.innerHTML = `<${copy-button}></${copy-button}>`
```

Create a button like this

![screenshot of the button, pre-click](image.png)

-------

![screenshot of the button, post-click](image-1.png)
