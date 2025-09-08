import {
    CopyButton as html,
    CopySvg,
    SuccessSvg
} from './html'
import clipboardCopy from './clipboard-copy.js'
import { define as _define } from '@substrate-system/web-component/util'

// for docuement.querySelector
declare global {
    interface HTMLElementTagNameMap {
        'copy-button':CopyButton
    }
}

export class CopyButton extends HTMLElement {
    static TAG = 'copy-button'
    static observedAttributes:string[] = ['payload']
    payload:string|null

    constructor () {
        super()
        const payload = this.getAttribute('payload')
        this.payload = payload
    }

    /**
     * We are only observing 1 attribute, so `name` will always be 'payload'.
     */
    attributeChangedCallback (_name, _oldValue, newValue) {
        this.payload = newValue
    }

    async clickListener () {
        if (!this.payload) throw new Error('No value to copy')
        const dur = this.getAttribute('duration')
        const time:number = dur ? parseInt(dur) : 2000

        const button = this.querySelector('button')!
        const statusEl = this.querySelector('.copy-status')!

        try {
            await clipboardCopy(this.payload)
            // re-render with success check mark
            button.innerHTML = `${SuccessSvg()}<span class="visually-hidden">Copied successfully</span>`
            button.setAttribute('aria-label', 'Copied successfully')
            statusEl.textContent = 'Text copied to clipboard'

            await sleep(time)

            // re-render with icon
            button.innerHTML = `${CopySvg()}<span class="visually-hidden">Copy</span>`
            button.setAttribute('aria-label', 'Copy')
            statusEl.textContent = ''
        } catch (error) {
            // Handle copy failure
            statusEl.textContent = 'Failed to copy text to clipboard'
            console.error('Copy failed:', error)

            // Brief error indication
            const originalLabel = button.getAttribute('aria-label')
            button.setAttribute('aria-label', 'Copy failed, try again')

            await sleep(2000)
            button.setAttribute('aria-label', originalLabel || 'Copy')
            statusEl.textContent = ''
        }
    }

    disconnectedCallback () {
        this.removeEventListener('click', this.clickListener)
    }

    render () {
        const classes = Array.from(this.classList)

        this.innerHTML = html(classes)
    }

    connectedCallback () {
        const payload = this.payload
        if (!payload) throw new Error('Missing copy text')

        if (!this.innerHTML.trim()) {
            this.render()
        }
        this.addEventListener('click', this.clickListener)
    }
}

export default CopyButton

_define('copy-button', CopyButton)

export function define () {
    return _define('copy-button', CopyButton)
}

function sleep (n:number) {
    return new Promise(resolve => setTimeout(resolve, n))
}
