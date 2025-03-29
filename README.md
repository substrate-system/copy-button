# copy button
![tests](https://github.com/substrate-system/copy-button/actions/workflows/nodejs.yml/badge.svg)
[![module](https://img.shields.io/badge/module-ESM-blue?style=flat-square)](README.md)
[![types](https://img.shields.io/npm/types/@substrate-system/copy-button?style=flat-square)](./dist/index.d.ts)
[![semantic versioning](https://img.shields.io/badge/semver-2.0.0-blue?logo=semver&style=flat-square)](https://semver.org/)
[![install size](https://flat.badgen.net/packagephobia/install/@substrate-system/copy-button?cache-control=no-cache)](https://packagephobia.com/result?p=@substrate-system/copy-button)
[![license](https://img.shields.io/badge/license-Polyform_Non_Commercial-26bc71?style=flat-square)](LICENSE)


A button to copy some text to the system clipboard, made with webcomponents.

<details><summary><h2>Contents</h2></summary>

<!-- toc -->

- [install](#install)
- [demonstration](#demonstration)
- [globals](#globals)
- [use](#use)
  * [Example without a build step](#example-without-a-build-step)
  * [With a build step](#with-a-build-step)
- [CSS](#css-1)

<!-- tocstop -->

</details>


## install
```sh
npm i -S @substrate-system/copy-button
```

> [!IMPORTANT]  
> Be sure to import `@substrate-system/a11y` too.

## demonstration

See [substrate-system.github.io/copy-button](https://substrate-system.github.io/copy-button/) for an example.


## globals
This depends on `@substrate-system/a11y` for a `.visually-hidden` class. Install
and import that module as well.

CSS variables `--success-color` and `--copy-color` determine the color of the
success checkmark and copy icon.

## use
Include this package, then call `customElements.define` with your preferred tag
name. Be sure to import [`@substrate-system/a11y`](https://github.com/substrate-system/a11y) 
too; we use class names exposed there for accessibility.

```js
import '@substrate-system/a11y'
import { CopyButton } from '@substrate-system/copy-button'

customElements.define('copy-button', CopyButton)
```

Or call the exported function `register` to use the default tag name, `copy-button`.

```js
import { register } from '@substrate-system/copy-button'

register()

// the web component can be used now
```

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
    <script type="module">
        import { CopyButton } from '/copy-button.js'
        customElements.define('copy-button', CopyButton)
    </script>
</body>
```

### With a build step
We expose several import options

```js
// default, unminified
import '@substrate-system/copy-button'

// minified
import '@substrate-system/copy-button/min'

// style
import '@substrate-system/copy-button/css'

// style, minifed
import '@substrate-system/copy-button/css/min'
```

In `vite`, for example, import like this

```js
import '@substrate-system/copy-button'
import '@substrate-system/copy-button/css'
// or minified css
import '@substrate-system//copy-button/css/min'
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
