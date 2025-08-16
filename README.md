# copy button
[![tests](https://img.shields.io/github/actions/workflow/status/substrate-system/copy-button/nodejs.yml?style=flat-square)](https://github.com/substrate-system/copy-button/actions/workflows/nodejs.yml)
[![module](https://img.shields.io/badge/module-ESM-blue?style=flat-square)](README.md)
[![types](https://img.shields.io/npm/types/@substrate-system/copy-button?style=flat-square)](./dist/index.d.ts)
[![semantic versioning](https://img.shields.io/badge/semver-2.0.0-blue?logo=semver&style=flat-square)](https://semver.org/)
[![dependencies](https://img.shields.io/badge/dependencies-zero-brightgreen.svg?style=flat-square)](package.json)
[![install size](https://flat.badgen.net/packagephobia/install/@substrate-system/copy-button?cache-control=no-cache)](https://packagephobia.com/result?p=@substrate-system/copy-button)
[![GZip size](https://flat.badgen.net/bundlephobia/minzip/@substrate-system/copy-button)](https://bundlephobia.com/package/@substrate-system/copy-button)
[![license](https://img.shields.io/badge/license-Big_Time-blue?style=flat-square)](LICENSE)


An icon button to copy some text to the system clipboard,
made with webcomponents.

<details><summary><h2>Contents</h2></summary>

<!-- toc -->

- [Install](#install)
- [Demonstration](#demonstration)
- [Globals](#globals)
- [Use](#use)
  * [Example without a build step](#example-without-a-build-step)
  * [With a build step](#with-a-build-step)
  * [`/copy`](#copy)
- [CSS](#css-1)
  * [Attributes](#attributes)
  * [Screenshots](#screenshots)

<!-- tocstop -->

</details>


## Install
```sh
npm i -S @substrate-system/copy-button
```

> [!IMPORTANT]  
> Be sure to import `@substrate-system/a11y` too.

## Demonstration

See [substrate-system.github.io/copy-button](https://substrate-system.github.io/copy-button/) for an example.


## Globals
This depends on `@substrate-system/a11y` for a `.visually-hidden` class. Install
and import that module as well.

CSS variables `--copy-button-success` and `--copy-button` determine the color
of the success checkmark and copy icon.

## Use
Include this package in your javascript, then use the element in HTML.
Be sure to import [`@substrate-system/a11y`](https://github.com/substrate-system/a11y) 
too; we use class names exposed there for accessible icons.

```js
import { CopyButton } from '@substrate-system/copy-button'
import '@substrate-system/a11y'
import '@substrate-system/copy-button/css'
```

```html
<copy-button payload="this text will be copied"></copy-button>
```

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

### `/copy`

Import just the copy function, no UI. This gives you access to the underlying
clipboard functionality without the web component interface.

#### Basic Usage

```js
import { clipboardCopy } from '@substrate-system/copy-button/copy'

clipboardCopy('hello copies')
```

#### Handle Errors

The `clipboardCopy` function is an async function that returns a Promise,
so you can handle success and error cases:

```js
import { clipboardCopy } from '@substrate-system/copy-button/copy'

async function handleCopy() {
    try {
        await clipboardCopy('Text to copy to clipboard')
        console.log('Text copied successfully!')
    } catch (error) {
        console.error('Failed to copy text:', error)
        // Handle the error (e.g., show user feedback)
    }
}
```

#### Copy Multi-line Text

The function preserves formatting including newlines and spaces.

```js
import { clipboardCopy } from '@substrate-system/copy-button/copy'

const multilineText = `Line 1
Line 2
    Indented line 3
Line 4`

clipboardCopy(multilineText)
```

#### Browser Compatibility

The `clipboardCopy` function automatically handles browser compatibility:

- **Modern browsers**: Use the
  [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard),
  `navigator.clipboard.writeText()`, when available
- **Fallback**: Use the legacy `document.execCommand('copy')` method for
  older browsers
- **Security**: Requires a secure context (HTTPS) for the Clipboard API,
  but falls back gracefully


#### Error Handling

The function may throw a `DOMException` with name `'NotAllowedError'`
in the following cases:

- The page is not served over HTTPS (for Clipboard API)
- The user has not interacted with the page recently (security requirement)
- The browser doesn't support either clipboard method
- Permission is denied by the browser

```js
import { clipboardCopy } from '@substrate-system/copy-button/copy'

try {
    await clipboardCopy('secure content')
} catch (error) {
    if (error.name === 'NotAllowedError') {
        console.log('Clipboard access was denied or not available')
        // Perhaps show alternative instructions to the user
    } else {
        console.error('Unexpected error:', error)
    }
}
```

## CSS
Override the variables `--success-color` and `--copy-color` to customize
the color.

```css
.copy-button {
    --success-color: green;
    --copy-color: blue;
}
```

### Attributes
1 required attribute, 1 optional attribute.

#### `payload`
The text you want to copy.

```html
<copy-button payload="example"></copy-button>
```

#### `duration`
Length of time in milliseconds that the success checkmark should show.
Default is `2000` (2 seconds).

```html
<copy-button duration="4000" payload="example"></copy-button>
```


--------------------------------------------------------

### Screenshots

Create a button like this

![screenshot of the button, pre-click](image.png)

-------

![screenshot of the button, post-click](image-1.png)
