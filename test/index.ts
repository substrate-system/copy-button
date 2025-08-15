import { test } from '@substrate-system/tapzero'
import { dom } from '@substrate-system/dom'
import { register } from '../src/index.js'

register()

test('create the button', async t => {
    // Create and append the element properly so connectedCallback is called
    const copyButton = document.createElement('copy-button')
    copyButton.className = 'test'
    copyButton.setAttribute('payload', 'example')
    document.body.appendChild(copyButton)

    // Wait for the custom element to render
    await new Promise(resolve => setTimeout(resolve, 100))

    const button = await dom.waitFor('button')
    const test = await dom.waitFor('.test')

    t.ok(button, 'should create a button in the DOM')
    t.ok(test, 'should get element by class')
})

test('click it', async t => {
    // Mock the clipboard API to avoid permission issue
    let copiedText = ''
    navigator.clipboard.writeText = async (text: string) => {
        copiedText = text
        return Promise.resolve()
    }

    const btn = (await dom.waitFor('copy-button'))!

    // Verify button shows copy icon initially
    t.ok(btn.querySelector('.copy-svg'), 'should show copy icon initially')

    dom.click(btn)

    // Wait a bit for the copy operation and UI update
    await new Promise(resolve => setTimeout(resolve, 100))

    // Verify the text was copied to the mock
    t.equal(copiedText, 'example', 'should copy to the clipboard')

    // Verify button shows success icon after clicking
    t.ok(btn.querySelector('.success-svg'),
        'should show success icon after copying')
})
