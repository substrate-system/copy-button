import { test } from '@substrate-system/tapzero'
import { CopyButton as html } from '../src/html.js'

// Node-only test for string rendering

test('CopyButton html rendering', t => {
    const classes = ['foo', 'bar']
    const result = html(classes)
    t.ok(result.includes('class="foo bar copy-button"'), 'should render correct class')
    t.ok(result.includes('<button'), 'should render a button')
})

test('CopyButton html rendering with no classes', t => {
    const result = html([])
    t.ok(result.includes('class="copy-button"'), 'should render with only default class')
})
