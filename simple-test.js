console.log('TAP version 13')
console.log('1..1')

// This should take 3 seconds but tapout should wait the full 6 seconds
setTimeout(() => {
    console.log('ok 1 - delayed test completed')
}, 3000)
