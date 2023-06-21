import { NRF905 } from '../src/nrf905'

// lewy
const rf433 = new NRF905('gpiochip0', '/dev/spidev1.0', 0x22222222, 108, 0, {
    CSN: 26,
    TRX_CE: 13,
    PWR_UP: 6,
    TX_EN: 5,
    CD: 0,
    AM: 1,
    DR: 12
})

console.log('frequency', rf433.getFrequency(), 'MHz')
rf433.startReceiver()

setInterval(() => {
    rf433.sendData(0x11111111, Uint8Array.from([1,2,3,4,5]))
}, 1000)
