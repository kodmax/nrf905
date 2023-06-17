import { GPIOOutputLine } from 'gpiod-client'
import { SPIDev } from 'spi-dev'

export class NRF905Configuration {
    public constructor(private readonly spidev: SPIDev, private readonly CSN: GPIOOutputLine) {
        this.CSN.setValue(0)
        const config = this.spidev.transfer(11, Uint8Array.from([0x10]))
        console.log('nRF905 configuration read: ', config)
        this.CSN.setValue(1)
    }
}
