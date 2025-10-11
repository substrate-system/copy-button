import { CopyButton as html } from './html'
import { CopyButtonClient } from './client.js'
import { define as _define } from '@substrate-system/web-component/util'

// for document.querySelector
declare global {
    interface HTMLElementTagNameMap {
        'copy-button':CopyButton
    }
}

/**
 * This is the full version -- DOM + rendering logic.
 */

export class CopyButton extends CopyButtonClient {
    static TAG = 'copy-button'

    render () {
        const classes = Array.from(this.classList)
        this.innerHTML = html(classes)
    }
}

export default CopyButton

// Use the define function; checks if already registered
_define('copy-button', CopyButton)

export function define () {
    return _define('copy-button', CopyButton)
}
