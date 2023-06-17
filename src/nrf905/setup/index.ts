import { ConfigurationRegister, StatusRegister } from './registers'
import { GPIOOutputLine } from 'gpiod-client'
import { SPIDev } from 'spi-dev'
import { decodeCR } from './decode-cr'

export class NRF905Setup {
    private configuration: ConfigurationRegister

    public constructor(private readonly spidev: SPIDev, private readonly CSN: GPIOOutputLine) {
        this.CSN.setValue(0)
        this.configuration = decodeCR(this.spidev.transfer(11, Uint8Array.from([0x10])))
        console.log('nRF905 configuration read: ', this.configuration)
        this.CSN.setValue(1)
    }

    public setChannel(ch: number, band: number, txPower: number): void {
        const cmd = 0x8000
            + ((txPower & 0x03) << 10)
            + ((band & 0x01) << 8)
            + (ch & 0x1ff)

        this.CSN.setValue(0)
        this.spidev.transfer(2, Uint8Array.from([(cmd & 0xff00) >> 8, cmd & 0xff]))
        this.CSN.setValue(1)
    }

    private decodeStatusRegister(data: Uint8Array): StatusRegister {
        return {
            AM: Boolean(data[0] & 0x80),
            DR: Boolean(data[0] & 0x20)
        }
    }

}
