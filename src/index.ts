import {
    CopyButton as html,
    CopySvg,
    SuccessSvg
} from './html'
import clipboardCopy from './clipboard-copy.js'

export class CopyButton extends HTMLElement {
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
        // re-render with success check mark
        this.querySelector('button')!.innerHTML = `${SuccessSvg()}`

        await sleep(time)

        // re-render with icon
        this.querySelector('button')!.innerHTML = `${CopySvg()}`
    }

    disconnectedCallback () {
        this.removeEventListener('click', this.clickListener)
    }

    render () {
        const classes = [
            this.getAttribute('no-outline') ? 'no-outline' : '',
        ]

        if (!this.innerHTML) {
            this.innerHTML = html(classes)
        }
    }

    connectedCallback () {
        const payload = this.payload
        if (!payload) throw new Error('Missing copy text')

        this.render()
        this.addEventListener('click', this.clickListener)
    }
}

export function register () {
    if (isRegistered('copy-button')) return
    return customElements.define('copy-button', CopyButton)
}

export function isRegistered (elName:string):boolean {
    return document.createElement(elName).constructor !== window.HTMLElement
}

export default CopyButton

export function sleep (n:number) {
    return new Promise(resolve => setTimeout(resolve, n))
}
