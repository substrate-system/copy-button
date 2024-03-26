import { test } from '@bicycle-codes/tapzero'
import Tonic from '@nichoth/tonic'
import { CopyButton } from '../src/index.js'

test('create the button', async t => {
    const tag = Tonic.getTagName(CopyButton.name)
    document.body.innerHTML = `<${tag}></${tag}>`
    const btn = document.querySelector('button')
    t.ok(btn, 'should create a button in the DOM')
})
