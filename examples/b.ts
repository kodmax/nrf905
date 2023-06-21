import { NRF905 } from '../src/nrf905'

// lewy
const rf433 = new NRF905('gpiochip0', '/dev/spidev1.0', {
    deviceId: 200,
    pins: {
        CSN: 26,
        TRX_CE: 13,
        PWR_UP: 6,
        TX_EN: 5,
        CD: 0,
        AM: 1,
        DR: 12
    }
})
