import { test } from '@bicycle-codes/tapzero'
import { dom } from '@bicycle-codes/dom'
import '../src/index.js'

test('create the button', async t => {
    document.body.innerHTML += `<copy-button class="test" payload="example">
        </copy-button>`
    t.ok(document.querySelector('button'), 'should create a button in the DOM')
    t.ok(document.querySelector('.html-test'), 'should get element by class')
})
