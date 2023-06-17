
import { NRF905 } from '../src/nrf905'

new NRF905('gpiochip0', '/dev/spidev1.0', {
    CSN: 26,
    TX_EN: 12,
    TRX_CE: 27,
    PWR_UP: 13,
    CD: 23,
    AM: 5,
    DR: 6
})
