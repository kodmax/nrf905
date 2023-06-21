import { ConfigurationRegister, StatusRegister } from './registers'
import { GPIOOutputLine } from 'gpiod-client'
import { SPIDev } from 'spi-dev'
import { decodeCR } from './decode-cr'
import { NRF905Options } from '../options'
import { CHANNEL_CONFIG, R_CONFIG, W_CONFIG, W_TX_ADDRESS } from './consts'
import { encodeCR } from './encode-cr'

export class NRF905Setup {
    private configuration: ConfigurationRegister

    public constructor(deviceId: number, private readonly spidev: SPIDev, private readonly CSN: GPIOOutputLine) {
        this.writeCR({
            CH_NO: 108,
            AUTO_RETRAN: 0,
            RX_RED_PWR: 0,
            PA_PWR: 0,
            HFREQ_PLL: 0,
            TX_AFW: 4,
            RX_AFW: 4,
            RX_PW: 32,
            TX_PW: 32,
            RX_ADDRESS: deviceId,
            CRC_MODE: 1,
            CRC_EN: 1,
            XOF: 4,
            UP_CLK_EN: 1,
            UP_CLK_FREQ: 3
        })

        this.configuration = this.readCR()
    }

    public writeCR(config: ConfigurationRegister): void {
        this.CSN.setValue(0)
        this.spidev.transfer(11, encodeCR(config))
        this.CSN.setValue(1)
    }

    public readCR(): ConfigurationRegister {
        this.CSN.setValue(0)
        const cr = decodeCR(this.spidev.transfer(11, Uint8Array.from([R_CONFIG])))
        this.CSN.setValue(1)
        return cr
    }
    
    public setChannel(ch: number, band: number, txPower: number): void {
        const cmd = CHANNEL_CONFIG
            + ((txPower & 0x03) << 10)
            + ((band & 0x01) << 8)
            + (ch & 0x1ff)

        this.CSN.setValue(0)
        this.spidev.transfer(2, Uint8Array.from([(cmd & 0xff00) >> 8, cmd & 0xff]))
        this.CSN.setValue(1)
    }

    public setTxAddress(addr: number): void {
        this.CSN.setValue(0)

        switch (this.configuration.RX_AFW) {
            case 4:
                this.spidev.transfer(5, Uint8Array.from([W_TX_ADDRESS, (addr >> 0) & 0xff, (addr >> 8) & 0xff, (addr >> 16) & 0xff, (addr >> 24) & 0xff]))
                break

            case 2:
                this.spidev.transfer(3, Uint8Array.from([W_TX_ADDRESS, (addr >> 0) & 0xff, (addr >> 8) & 0xff]))
                break

            case 1:
                this.spidev.transfer(2, Uint8Array.from([W_TX_ADDRESS, (addr >> 0) & 0xff]))
                break

            default:
                throw new Error('Invalid TX address length')
        }

        this.CSN.setValue(1)
    }

    private decodeStatusRegister(data: Uint8Array): StatusRegister {
        return {
            AM: Boolean(data[0] & 0x80),
            DR: Boolean(data[0] & 0x20)
        }
    }

}
