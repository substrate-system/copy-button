import clipboardCopy from './clipboard-copy.js'
import { define as _define } from '@substrate-system/web-component/util'

// Note: This extends the existing global interface
// The main index.ts file defines 'copy-button' as CopyButton
// This client version uses the same tag name but different implementation

export class CopyButtonClient extends HTMLElement {
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

        clipboardCopy(this.payload)

        const button = this.querySelector('button')
        if (!button) {
            console.warn('CopyButtonClient: No button element found for' +
                ' state updates')
            return
        }

        // Show success state - expects success SVG to be available via
        // CSS or data attributes
        button.classList.add('copy-success')
        button.setAttribute('data-state', 'success')

        await sleep(time)

        // Restore original state
        button.classList.remove('copy-success')
        button.setAttribute('data-state', 'default')
    }

    disconnectedCallback () {
        this.removeEventListener('click', this.clickListener)
    }

    connectedCallback () {
        const payload = this.payload
        if (!payload) throw new Error('Missing copy text')

        // Expect HTML to already be present - no rendering
        const button = this.querySelector('button')
        if (!button) {
            throw new Error('CopyButtonClient expects a button element to ' +
                'be present in the DOM')
        }

        this.addEventListener('click', this.clickListener)
    }
}

export default CopyButtonClient

// Note: Client version does not auto-register to avoid conflicts
// Use the define() function or register manually when needed

export function define () {
    return _define('copy-button', CopyButtonClient)
}

function sleep (n:number) {
    return new Promise(resolve => setTimeout(resolve, n))
}
