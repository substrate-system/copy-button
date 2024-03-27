import { test } from '@bicycle-codes/tapzero'
import Tonic from '@nichoth/tonic'
import { CopyButton } from '../src/index.js'

test('create the button', t => {
    const tag = Tonic.getTagName(CopyButton.name)
    document.body.innerHTML = `<${tag} class="another-test"></${tag}>`
    const btn = document.querySelector('button')
    t.ok(btn, 'should create a button in the DOM')
    t.ok(document.querySelector('.another-test'), 'should get element by class')
})
