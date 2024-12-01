import { sleep } from '@substrate-system/util'
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

        clipboardCopy(this.payload)
        // re-render with success check mark
        this.querySelector('button')!.innerHTML = `${SuccessSvg()}`

        await sleep(2000)

        // re-render with icon
        this.querySelector('button')!.innerHTML = `${CopySvg()}`
    }

    disconnectedCallback () {
        this.removeEventListener('click', this.clickListener)
    }

    connectedCallback () {
        const payload = this.payload
        if (!payload) throw new Error('Missing copy text')

        this.addEventListener('click', this.clickListener)

        const classes = ([
            'copy-button',
            this.getAttribute('no-outline') ? 'no-outline' : '',
        ])
            .filter(Boolean)
            .join(' ')

        this.innerHTML = `<button aria-label="Copy" class="${classes}">
            ${CopySvg()}
            <span class="visually-hidden">Copy</span>
        </button>`
    }
}

customElements.define('copy-button', CopyButton)

function CopySvg () {
    return `<span class="copy-wrapper">
        <svg
            aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1"
            focusable="false"
            width="16" class="copy-svg"
        >
            <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
        </svg>
    </span>`
}

function SuccessSvg () {
    return `<span class="success-wraper">
        <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1"
            width="16"
            class="success-svg"
            focusable="false"
        >
            <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
        </svg>
    </span>`
}
