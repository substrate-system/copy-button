import '@substrate-system/a11y'
import '../src/index.js'
import '../src/style.css'
import './style.css'

const el = document.getElementById('clicker')!

el.addEventListener('click', ev => {
    console.log('got the click', ev)
})
