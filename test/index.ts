import { test } from '@substrate-system/tapzero'
import { dom } from '@substrate-system/dom'
import { CopyButton } from '../src/html.js'
import { clipboardCopy } from '../src/clipboard-copy.js'
import { CopyButtonClient } from '../src/client.js'
import '../src/index.js'

// Mock the clipboard API to avoid permission issue
let copiedText = ''
navigator.clipboard.writeText = async (text: string) => {
    copiedText = text
    return Promise.resolve()
}

test('create the complete button (index.ts)', async t => {
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

test('complete button click behavior (SVG swapping)', async t => {
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

    // Wait for it to revert back
    await new Promise(resolve => setTimeout(resolve, 2100))

    // Should show copy icon again
    t.ok(btn.querySelector('.copy-svg'), 'should revert to copy icon after timeout')
})

test('client-only version with pre-rendered HTML', async t => {
    // Test the client class directly without registering it as a custom element
    // Create HTML structure manually (simulating SSR)
    const clientElement = document.createElement('div')
    clientElement.innerHTML = `
        <button aria-label="Copy" class="copy-button">
            <span class="copy-wrapper">
                <svg class="copy-svg" width="16" height="16">
                    <path d="test-copy-icon"/>
                </svg>
            </span>
            <span class="visually-hidden">Copy</span>
        </button>
    `

    // Create client instance manually and test its methods
    const clientInstance = new CopyButtonClient()
    clientInstance.setAttribute('payload', 'client-test')
    clientInstance.innerHTML = clientElement.innerHTML

    // Manually call connectedCallback to simulate DOM attachment
    document.body.appendChild(clientInstance)

    await new Promise(resolve => setTimeout(resolve, 100))

    const clientBtn = clientInstance.querySelector('button')!
    t.ok(clientBtn, 'client version should work with pre-rendered HTML')

    // Test client behavior (CSS classes instead of SVG swapping)
    await clientInstance.clickListener()

    t.equal(copiedText, 'client-test', 'client version should copy to clipboard')
    t.ok(clientBtn.classList.contains('copy-success'), 'should add success class')
    t.equal(clientBtn.getAttribute('data-state'), 'success', 'should set success data state')

    // Wait for revert
    await new Promise(resolve => setTimeout(resolve, 2100))
    t.ok(!clientBtn.classList.contains('copy-success'), 'should remove success class after timeout')
    t.equal(clientBtn.getAttribute('data-state'), 'default', 'should revert to default data state')

    // Clean up
    clientInstance.remove()
})

test('client-only version error handling', async t => {
    // Test what happens when HTML structure is missing
    const emptyClientInstance = new CopyButtonClient()
    emptyClientInstance.setAttribute('payload', 'test')

    try {
        document.body.appendChild(emptyClientInstance)
        await new Promise(resolve => setTimeout(resolve, 100))
        t.fail('should throw error when no button element is present')
    } catch (error) {
        const err = error as Error
        t.ok(err.message.includes('expects a button element'),
            'should throw descriptive error for missing button')
    }

    // Clean up
    emptyClientInstance.remove()
})

test('inheritance: complete version extends client version', async t => {
    // Import the complete version
    const { CopyButton: CompleteButton } = await import('../src/index.js')

    // Check inheritance
    const instance = new CompleteButton()
    t.ok(instance instanceof CopyButtonClient, 'CopyButton should extend CopyButtonClient')
    t.ok(instance instanceof HTMLElement, 'should still be an HTMLElement')

    // Check that it has both rendering and client capabilities
    t.ok(typeof instance.render === 'function', 'should have render method from complete version')
    t.ok(typeof instance.clickListener === 'function', 'should have clickListener method')
    t.equal(instance.constructor.name, 'CopyButton', 'should be CopyButton class')
})

test('composition: complete version uses HTML module', async t => {
    // Test that the complete version properly renders using HTML module
    const completeButton = document.createElement('copy-button')
    completeButton.className = 'composition-test'
    completeButton.setAttribute('payload', 'composition-test')

    // Remove any existing elements to start fresh
    const existing = document.querySelector('.composition-test')
    if (existing) existing.remove()

    document.body.appendChild(completeButton)
    await new Promise(resolve => setTimeout(resolve, 100))

    // Check that it rendered the HTML structure
    const renderedButton = completeButton.querySelector('button')
    t.ok(renderedButton, 'should render button element')
    t.ok(completeButton.querySelector('.copy-svg'), 'should render copy SVG from HTML module')
    t.ok(completeButton.querySelector('.visually-hidden'), 'should render accessibility text')

    // Test that clicking uses SVG swapping behavior (not CSS classes)
    dom.click(completeButton)
    await new Promise(resolve => setTimeout(resolve, 100))

    // Should swap to success SVG
    t.ok(completeButton.querySelector('.success-svg'), 'should swap to success SVG')
    t.ok(!completeButton.querySelector('.copy-svg'), 'should remove copy SVG during success state')

    // Should NOT use CSS classes like client version
    const button = completeButton.querySelector('button')!
    t.ok(!button.classList.contains('copy-success'), 'should NOT use CSS classes for state management')
})

test('verify modular architecture', async t => {
    // Test that we can import each module independently
    const { CopyButton: HtmlCopyButton } = await import('../src/html.js')
    const { CopyButtonClient } = await import('../src/client.js')
    const { CopyButton: CompleteCopyButton } = await import('../src/index.js')

    // HTML module should generate strings
    const htmlString = HtmlCopyButton(['test-class'])
    t.ok(typeof htmlString === 'string', 'HTML module should return string')
    t.ok(htmlString.includes('test-class'), 'HTML module should include custom classes')

    // Client module should be a web component class
    t.ok(typeof CopyButtonClient === 'function', 'Client module should export constructor')
    t.ok(CopyButtonClient.prototype instanceof HTMLElement, 'Client should extend HTMLElement')

    // Complete module should extend client
    t.ok(typeof CompleteCopyButton === 'function', 'Complete module should export constructor')
    t.ok(CompleteCopyButton.prototype instanceof CopyButtonClient, 'Complete should extend Client')

    // Complete should have render method that client doesn't
    const clientInstance = new CopyButtonClient()
    const completeInstance = new CompleteCopyButton()

    t.ok(typeof completeInstance.render === 'function', 'Complete version should have render method')
    t.ok(!('render' in clientInstance), 'Client version should NOT have render method')
})

test('clipboard API', async t => {
    await clipboardCopy('abc')
    t.equal(copiedText, 'abc', 'should copy via API call')
})

test('html only module', async t => {
    const html = CopyButton(['hello'])

    t.ok(html.includes('class="hello copy-button"'),
        'should create a string with the given class name')

    // Test outerHTML method
    const outerHtml = CopyButton.outerHTML(['test-class'], { noOutline: true })
    t.ok(outerHtml.includes('<copy-button'), 'should generate complete component HTML')
    t.ok(outerHtml.includes('no-outline'), 'should include attributes')
    t.ok(outerHtml.includes('test-class'), 'should include custom classes')
})
