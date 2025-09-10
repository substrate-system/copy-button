import {
    CopyButton as html,
    CopySvg,
    SuccessSvg
} from './html'
import { CopyButtonClient } from './client.js'
import { define as _define } from '@substrate-system/web-component/util'

// for document.querySelector
declare global {
    interface HTMLElementTagNameMap {
        'copy-button':CopyButton
    }
}

export class CopyButton extends CopyButtonClient {
    static TAG = 'copy-button'

    async clickListener () {
        if (!this.payload) throw new Error('No value to copy')
        const dur = this.getAttribute('duration')
        const time:number = dur ? parseInt(dur) : 2000

        // Use the clipboard functionality from parent class
        const clipboardCopy = await import('./clipboard-copy.js').then(m => {
            return m.default
        })
        clipboardCopy(this.payload)

        // Override the client behavior to swap SVG content instead of using
        // CSS classes
        const button = this.querySelector('button')
        if (!button) {
            console.warn('CopyButton: No button element found for state updates')
            return
        }

        // re-render with success check mark
        button.innerHTML = `${SuccessSvg()}`

        await sleep(time)

        // re-render with copy icon
        button.innerHTML = `${CopySvg()}`
    }

    render () {
        const classes = Array.from(this.classList)
        this.innerHTML = html(classes)
    }

    connectedCallback () {
        const payload = this.payload
        if (!payload) throw new Error('Missing copy text')

        // Render if no content is present
        if (!this.innerHTML.trim()) {
            this.render()
        }

        // Add event listener
        // (inherited behavior, but we override the click handler)
        this.addEventListener('click', this.clickListener)
    }
}

export default CopyButton

// Use the define function that checks if already registered
_define('copy-button', CopyButton)

export function define () {
    return _define('copy-button', CopyButton)
}

function sleep (n:number) {
    return new Promise(resolve => setTimeout(resolve, n))
}
