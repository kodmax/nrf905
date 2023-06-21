
import { NRF905 } from '../src/nrf905'

const rf433 = new NRF905('gpiochip0', '/dev/spidev0.0', { 
    deviceId: 100,
    pins: {
        CSN: 22,
        TX_EN: 25, 
        TRX_CE: 24, 
        PWR_UP: 23,
        DR: 27,
        CD: 14,
        AM: 15 
    }
})
