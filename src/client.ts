import clipboardCopy from './clipboard-copy.js'
import { CopySvg, SuccessSvg } from './html.js'
import { define as _define } from '@substrate-system/web-component/util'

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
        if (!this.payload) return  // do nothing if there is no copy value

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
        // re-render with success check mark
        button.innerHTML = `${SuccessSvg()}`

        await sleep(time)

        // Restore original state
        button.classList.remove('copy-success')
        button.setAttribute('data-state', 'default')
        button.innerHTML = `${CopySvg()}`  // re-render with copy icon
    }

    disconnectedCallback () {
        this.removeEventListener('click', this.clickListener)
    }

    connectedCallback () {
        this.render()
        this.addEventListener('click', this.clickListener)
    }

    render ():void {
        // noop b/c it should be server-side rendered already
    }
}

export default CopyButtonClient

export function define () {
    return _define('copy-button', CopyButtonClient)
}

function sleep (n:number) {
    return new Promise(resolve => setTimeout(resolve, n))
}
