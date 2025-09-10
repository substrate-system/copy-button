# copy button
[![tests](https://img.shields.io/github/actions/workflow/status/substrate-system/copy-button/nodejs.yml?style=flat-square)](https://github.com/substrate-system/copy-button/actions/workflows/nodejs.yml)
[![module](https://img.shields.io/badge/module-ESM-blue?style=flat-square)](README.md)
[![types](https://img.shields.io/npm/types/@substrate-system/copy-button?style=flat-square)](./dist/index.d.ts)
[![semantic versioning](https://img.shields.io/badge/semver-2.0.0-blue?logo=semver&style=flat-square)](https://semver.org/)
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
  * [`/html`](#html)
  * [`/client`](#client)
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
    }
}
```

### `/html`

Import just the HTML generation functions for server-side rendering.
This gives you access to static HTML generation without the web
component behavior, perfect for SSR frameworks like Next.js, SvelteKit, or
Node.js backends.

#### Basic Usage

```js
import { CopyButton } from '@substrate-system/copy-button/html'

// Generate a simple copy button
const buttonHTML = CopyButton()
console.log(buttonHTML)
// Output: <button aria-label="Copy" class="copy-button">
//           <span class="copy-wrapper">...</span>
//           <span class="visually-hidden">Copy</span>
//         </button>
```

#### With Custom Classes

```js
import { CopyButton } from '@substrate-system/copy-button/html'

// Add custom CSS classes
const buttonHTML = CopyButton(['my-custom-class', 'another-class'])
console.log(buttonHTML)
// Output: <button aria-label="Copy" class="my-custom-class another-class copy-button">
//           ...
//         </button>
```

#### Generate Complete Web Component HTML

Use `CopyButton.outerHTML()` to generate the full web component markup:

```js
import { CopyButton } from '@substrate-system/copy-button/html'

// Basic web component
const componentHTML = CopyButton.outerHTML()
console.log(componentHTML)
// Output: <copy-button>
//           <button aria-label="Copy" class="copy-button">...</button>
//         </copy-button>

// With custom classes and attributes
const customHTML = CopyButton.outerHTML(['custom-class'], { noOutline: true })
console.log(customHTML)
// Output: <copy-button no-outline>
//           <button aria-label="Copy" class="custom-class copy-button">...</button>
//         </copy-button>
```

#### Individual SVG Icons

Access the individual SVG icons for custom implementations:

```js
import { CopySvg, SuccessSvg } from '@substrate-system/copy-button/html'

// Copy icon SVG
const copyIcon = CopySvg()
console.log(copyIcon)
// Output: <span class="copy-wrapper"><svg aria-hidden="true" height="16"...></span>

// Success checkmark SVG  
const successIcon = SuccessSvg()
console.log(successIcon)
// Output: <span class="success-wrapper"><svg aria-hidden="true" height="16"...></span>
```

#### Server-Side Rendering Examples

**Next.js:**
```js
// pages/index.js or app/page.js
import { CopyButton } from '@substrate-system/copy-button/html'

export default function HomePage() {
  const copyButtonHTML = CopyButton.outerHTML(['my-button'])
  
  return (
    <div>
      <h1>My App</h1>
      <div dangerouslySetInnerHTML={{ __html: copyButtonHTML }} />
    </div>
  )
}
```

**SvelteKit:**
```js
// src/routes/+page.server.js
import { CopyButton } from '@substrate-system/copy-button/html'

export function load() {
  return {
    copyButtonHTML: CopyButton.outerHTML()
  }
}
```

```svelte
<!-- src/routes/+page.svelte -->
<script>
  export let data
</script>

<h1>My App</h1>
{@html data.copyButtonHTML}
```

**Express.js:**
```js
// server.js
import express from 'express'
import { CopyButton } from '@substrate-system/copy-button/html'

const app = express()

app.get('/', (req, res) => {
  const copyButtonHTML = CopyButton.outerHTML()
  
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>My App</title>
        <link rel="stylesheet" href="/copy-button.css">
      </head>
      <body>
        <h1>My App</h1>
        ${copyButtonHTML}
        <script type="module">
          import { CopyButton } from '/copy-button.js'
          customElements.define('copy-button', CopyButton)
        </script>
      </body>
    </html>
  `)
})
```

#### Hydration Notes

When using server-side rendering, you'll typically want to hydrate the
static HTML with the interactive web component on the client side:

1. **Include the CSS**: Import or link the copy-button CSS file
2. **Register the component**: Import and register the web component in your
   client-side JavaScript
3. **Set attributes**: The `payload` attribute should be set on the
   `<copy-button>` element, not the inner `<button>`

```html
<!-- Server-rendered HTML -->
<copy-button payload="text to copy">
  <button aria-label="Copy" class="copy-button">
    <!-- SVG icons -->
  </button>
</copy-button>

<!-- Client-side hydration -->
<script type="module">
  import { CopyButton } from '@substrate-system/copy-button'
  // Component automatically registers and becomes interactive
</script>
```

### `/client`

Import a client-side only version to reduce bundle size. This version
doesn't include HTML rendering functionality and expects the HTML
to already be in place (either server-rendered or injected by other means).

#### Bundle Size Comparison

- **Full version** (`@substrate-system/copy-button`): ~6.2kb
- **Client-only version** (`@substrate-system/copy-button/client`): ~4.7kb
- **Savings**: ~1.5kb (24% reduction)

#### Basic Usage

```js
import { CopyButtonClient } from '@substrate-system/copy-button/client'

// Register the client-only component
customElements.define('copy-button', CopyButtonClient)
```

#### Requirements

The client version expects specific HTML structure to be present:

```html
<copy-button payload="text to copy">
  <button aria-label="Copy" class="copy-button">
    <!-- Your copy icon SVG or content -->
    <span class="visually-hidden">Copy</span>
  </button>
</copy-button>
```

#### Visual State Management

Unlike the full version that swaps SVG content, the client version uses CSS classes and data attributes for state management:

```css
/* Style the different states */
copy-button button[data-state="success"] {
  /* Success state styles */
}

copy-button button.copy-success {
  /* Alternative success styling */
}
```

The client version sets these attributes/classes during the copy operation:
- `data-state="success"` and `class="copy-success"` during success
- `data-state="default"` and removes `copy-success` class when returning to default

#### Use Cases

**Optimal for:**
- Server-side rendered applications where HTML is pre-generated
- Applications using static site generators
- Scenarios where bundle size is critical
- When you have custom SVG icons or styling

**Example with SSR + Client hydration:**

```js
// Server-side (using /html import)
import { CopyButton } from '@substrate-system/copy-button/html'
const serverHTML = CopyButton.outerHTML(['my-styles'])

// Client-side (using /client import for smaller bundle)
import { CopyButtonClient } from '@substrate-system/copy-button/client'
customElements.define('copy-button', CopyButtonClient)
```

**Custom icon implementation:**

```html
<copy-button payload="Hello world">
  <button aria-label="Copy" class="copy-button">
    <span class="icon-copy">📋</span>
    <span class="icon-success" style="display: none;">✅</span>
    <span class="visually-hidden">Copy</span>
  </button>
</copy-button>
```

```css
copy-button button[data-state="success"] .icon-copy {
  display: none;
}

copy-button button[data-state="success"] .icon-success {
  display: inline;
}
```

#### Error Handling

The client version includes the same error handling as the full version but with additional warnings for missing HTML structure:

```js
// Will warn in console if no button element is found
// Will throw error if no payload attribute is set
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
