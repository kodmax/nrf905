
import { NRF905 } from '../src/nrf905'

const rf433 = new NRF905('gpiochip0', '/dev/spidev1.0', 433.92, {
    CSN: 26,

    TRX_CE: 13, // orange
    PWR_UP: 6, // red
    TX_EN: 5, // brown
    CD: 0, // black
    AM: 1, // white
    DR: 12 // gray
})
