
import { NRF905 } from '../src/nrf905'

const rf433 = new NRF905('gpiochip0', '/dev/spidev0.0', 0x11111111, 108, 0, {
    CSN: 22,
    TX_EN: 25,
    TRX_CE: 24,
    PWR_UP: 23,
    DR: 27,
    CD: 14,
    AM: 15
})

console.log('frequency', rf433.getFrequency(), 'MHz')
rf433.startReceiver()

setInterval(() => {
    rf433.sendData(0x22222222, Uint8Array.from([1,2,3,4,5]))
}, 1000)
