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
    // Test the registered copy-button element with client behavior
    // This tests that CSS classes and data-state are properly managed
    const clientInstance = document.createElement('copy-button') as
        InstanceType<typeof CopyButtonClient>
    clientInstance.setAttribute('payload', 'client-test')

    // Short duration for faster test
    clientInstance.setAttribute('duration', '500')
    document.body.appendChild(clientInstance)

    await new Promise(resolve => setTimeout(resolve, 100))

    const clientBtn = clientInstance.querySelector('button')!
    t.ok(clientBtn, 'client version should work with pre-rendered HTML')

    // Trigger click but don't await (check state during the animation)
    clientInstance.clickListener()
    await new Promise(resolve => setTimeout(resolve, 50))

    t.equal(copiedText, 'client-test',
        'client version should copy to clipboard')
    t.ok(clientBtn.classList.contains('copy-success'),
        'should add success class')
    t.equal(clientBtn.getAttribute('data-state'), 'success',
        'should set success data state')

    // Wait for revert (duration + buffer)
    await new Promise(resolve => setTimeout(resolve, 600))
    t.ok(!clientBtn.classList.contains('copy-success'),
        'should remove success class after timeout')
    t.equal(clientBtn.getAttribute('data-state'), 'default',
        'should revert to default data state')

    // Clean up
    clientInstance.remove()
})

test('verify modular architecture - client render is noop', async t => {
    // The client class has a render method that is a noop (does nothing)
    // This allows SSR where HTML is pre-rendered
    const renderSource = CopyButtonClient.prototype.render.toString()
    t.ok(renderSource.includes('noop') || renderSource.length < 50,
        'CopyButtonClient.render should be a noop or minimal')
})

test('inheritance: complete version extends client version', async t => {
    // Import the complete version
    const { CopyButton: CompleteButton } = await import('../src/index.js')

    // Check inheritance
    const instance = new CompleteButton()
    t.ok(instance instanceof CopyButtonClient,
        'CopyButton should extend CopyButtonClient')
    t.ok(instance instanceof HTMLElement, 'should still be an HTMLElement')

    // Check that it has both rendering and client capabilities
    t.ok(typeof instance.render === 'function',
        'should have render method from complete version')
    t.ok(typeof instance.clickListener === 'function',
        'should have clickListener method')
    t.ok(instance.constructor.name.startsWith('CopyButton'),
        'should be CopyButton class (may have suffix due to bundling)')
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
    t.ok(completeButton.querySelector('.copy-svg'),
        'should render copy SVG from HTML module')
    t.ok(completeButton.querySelector('.visually-hidden'),
        'should render accessibility text')

    // Test that clicking uses SVG swapping behavior (not CSS classes)
    dom.click(completeButton)
    await new Promise(resolve => setTimeout(resolve, 100))

    // Should swap to success SVG
    t.ok(completeButton.querySelector('.success-svg'),
        'should swap to success SVG')
    t.ok(!completeButton.querySelector('.copy-svg'),
        'should remove copy SVG during success state')

    // Complete version ALSO uses CSS classes (from client base class)
    const button = completeButton.querySelector('button')!
    t.ok(button.classList.contains('copy-success'),
        'complete version also uses CSS classes for state')
})

test('verify modular architecture', async t => {
    // Test that we can import each module independently
    const { CopyButton: HtmlCopyButton } = await import('../src/html.js')
    const { CopyButtonClient } = await import('../src/client.js')
    const { CopyButton: CompleteCopyButton } = await import('../src/index.js')

    // HTML module should generate strings
    const htmlString = HtmlCopyButton(['test-class'])
    t.ok(typeof htmlString === 'string', 'HTML module should return string')
    t.ok(htmlString.includes('test-class'),
        'HTML module should include custom classes')

    // Client module should be a web component class
    t.ok(typeof CopyButtonClient === 'function',
        'Client module should export constructor')
    t.ok(CopyButtonClient.prototype instanceof HTMLElement,
        'Client should extend HTMLElement')

    // Complete module should extend client
    t.ok(typeof CompleteCopyButton === 'function',
        'Complete module should export constructor')
    t.ok(CompleteCopyButton.prototype instanceof CopyButtonClient,
        'Complete should extend Client')

    // Complete should have render method - check via prototype
    t.ok(typeof CompleteCopyButton.prototype.render === 'function',
        'Complete version should have render method')

    // Client's render is a noop (defined but empty)
    const clientRender = CopyButtonClient.prototype.render
    t.ok(typeof clientRender === 'function',
        'Client version has render method (noop)')
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
    t.ok(outerHtml.includes('<copy-button'),
        'should generate complete component HTML')
    t.ok(outerHtml.includes('noOutline'),
        'should include attributes (camelCase)')
    t.ok(outerHtml.includes('test-class'), 'should include custom classes')
})

// ============================================
// HINT ATTRIBUTE TESTS
// ============================================

test('hint attribute renders popover element', async t => {
    const el = document.createElement('copy-button')
    el.setAttribute('payload', 'hint-test-1')
    el.setAttribute('hint', 'true')
    document.body.appendChild(el)
    await new Promise(r => setTimeout(r, 100))

    const popover = el.querySelector('[popover]')
    t.ok(popover, 'should render a popover element')
    t.equal(popover?.textContent?.trim(), 'Copied',
        'default hint text should be "Copied"')

    el.remove()
})

test('custom hint text is rendered', async t => {
    const el = document.createElement('copy-button')
    el.setAttribute('payload', 'hint-test-2')
    el.setAttribute('hint', 'Link copied!')
    document.body.appendChild(el)
    await new Promise(r => setTimeout(r, 100))

    const popover = el.querySelector('[popover]')
    t.equal(popover?.textContent?.trim(), 'Link copied!',
        'should use custom hint text')

    el.remove()
})

test('popover shows after copy action', async t => {
    const el = document.createElement('copy-button')
    el.setAttribute('payload', 'hint-test-3')
    el.setAttribute('hint', 'true')
    el.setAttribute('duration', '500')
    document.body.appendChild(el)
    await new Promise(r => setTimeout(r, 100))

    const btn = el.querySelector('button')
    btn?.click()
    await new Promise(r => setTimeout(r, 50))

    const popover = el.querySelector('.copy-hint') as HTMLElement
    const isVisible = popover?.classList.contains('copy-hint--visible') ||
                      popover?.classList.contains('copy-hint--visible')
    t.ok(isVisible, 'popover should be visible after copy')

    el.remove()
})

test('popover hides after duration', async t => {
    const el = document.createElement('copy-button')
    el.setAttribute('payload', 'hint-test-4')
    el.setAttribute('hint', 'true')
    el.setAttribute('duration', '200')
    document.body.appendChild(el)
    await new Promise(r => setTimeout(r, 100))

    const btn = el.querySelector('button')
    btn?.click()
    await new Promise(r => setTimeout(r, 350))

    const popover = el.querySelector('.copy-hint') as HTMLElement
    const isVisible = popover?.classList.contains('copy-hint--visible') ||
                      popover?.classList.contains('copy-hint--visible')
    t.ok(!isVisible, 'popover should be hidden after duration')

    el.remove()
})

test('no popover element without hint attribute', async t => {
    const el = document.createElement('copy-button')
    el.setAttribute('payload', 'hint-test-5')
    document.body.appendChild(el)
    await new Promise(r => setTimeout(r, 100))

    const popover = el.querySelector('[popover]')
    t.ok(!popover, 'should not render popover without hint attribute')

    el.remove()
})

test('hint="" uses default "Copied" text', async t => {
    const el = document.createElement('copy-button')
    el.setAttribute('payload', 'hint-test-6')
    el.setAttribute('hint', '')
    document.body.appendChild(el)
    await new Promise(r => setTimeout(r, 100))

    const popover = el.querySelector('[popover]')
    t.equal(popover?.textContent?.trim(), 'Copied',
        'empty hint should use default text')

    el.remove()
})

test('rapid clicks reset hint timer', async t => {
    const el = document.createElement('copy-button')
    el.setAttribute('payload', 'hint-test-7')
    el.setAttribute('hint', 'true')
    el.setAttribute('duration', '300')
    document.body.appendChild(el)
    await new Promise(r => setTimeout(r, 100))

    const btn = el.querySelector('button')
    btn?.click()
    await new Promise(r => setTimeout(r, 150))
    btn?.click()  // second click resets timer
    await new Promise(r => setTimeout(r, 200))

    // Should still be visible (300ms from second click not elapsed)
    const popover = el.querySelector('.copy-hint') as HTMLElement
    const isVisible = popover?.classList.contains('copy-hint--visible') ||
                      popover?.classList.contains('copy-hint--visible')
    t.ok(isVisible, 'popover should still be visible after timer reset')

    el.remove()
})

test('popover has correct ARIA attributes', async t => {
    const el = document.createElement('copy-button')
    el.setAttribute('payload', 'hint-test-8')
    el.setAttribute('hint', 'true')
    document.body.appendChild(el)
    await new Promise(r => setTimeout(r, 100))

    const popover = el.querySelector('[popover]')
    t.equal(popover?.getAttribute('role'), 'status',
        'should have role="status"')
    t.equal(popover?.getAttribute('aria-live'), 'polite',
        'should have aria-live="polite"')

    el.remove()
})

test('dispatches copy event with copied text on success', async t => {
    const el = document.createElement('copy-button')
    el.setAttribute('payload', 'event-test-text')
    el.setAttribute('duration', '200')
    document.body.appendChild(el)
    await new Promise(r => setTimeout(r, 100))

    let receivedEvent:CustomEvent|null = null
    el.addEventListener('copy', (e) => {
        receivedEvent = e as CustomEvent
    })

    el.clickListener()
    await new Promise(r => setTimeout(r, 50))

    t.ok(receivedEvent, 'should dispatch a copy event')
    t.equal(
        (receivedEvent as unknown as CustomEvent<{ text:string }>).detail.text,
        'event-test-text',
        'event detail.text should equal the copied payload'
    )

    el.remove()
})

test('all done', () => {
    // @ts-expect-error tests
    window.testsFinished = true
})
