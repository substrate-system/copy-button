import Tonic from '@bicycle-codes/tonic'
import { CopyButton, CopySvg, SuccessSvg } from '../src/index.js'
import '../src/style.css'

function CopyExample (this:Tonic) {
    return this.html`
        <copy-button class="scroll example" id="example"></copy-button>
    `
}

Tonic.add(CopyButton)
Tonic.add(CopySvg)
Tonic.add(SuccessSvg)
