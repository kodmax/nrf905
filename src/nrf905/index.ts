import { GPIOController, GPIOOutputLine, GPIOLineEvents } from 'gpiod-client'
import { SPIDev } from 'spi-dev'
import { Pins } from './pins'
import { ConfigurationRegister, StatusRegister } from './registers'
import { encodeCR } from './cr/encode-cr'
import { decodeCR } from './cr/decode-cr'
import { R_CONFIG, R_RX_PAYLOAD, R_TX_ADDRESS, R_TX_PAYLOAD, W_TX_ADDRESS, W_TX_PAYLOAD } from './consts'

export class NRF905 {
    private readonly gpio: GPIOController
    private readonly spidev: SPIDev

    private readonly PWR_UP: GPIOOutputLine
    private readonly TRX_CE: GPIOOutputLine
    private readonly TX_EN: GPIOOutputLine
    private readonly CSN: GPIOOutputLine

    private readonly CD: GPIOLineEvents
    private readonly AM: GPIOLineEvents
    private readonly DR: GPIOLineEvents

    private configuration: ConfigurationRegister

    private isReceiving = false

    public constructor(chipname: string, path: string, deviceId: number, channel: number, band: number, pins: Pins) {
        this.gpio = new GPIOController(chipname, 'nRF905')

        this.PWR_UP = this.gpio.requestLineAsOutput(pins.PWR_UP, 0)
        this.TRX_CE = this.gpio.requestLineAsOutput(pins.TRX_CE, 0)
        this.TX_EN = this.gpio.requestLineAsOutput(pins.TX_EN, 0)
        this.CSN = this.gpio.requestLineAsOutput(pins.CSN, 1)

        this.CD = this.gpio.requestLineEvents(pins.CD, 'rising', 10)
        this.CD.addListener('edge', () => {
            console.log('Carrier Detected')
        })

        this.AM = this.gpio.requestLineEvents(pins.AM, 'rising', 10)
        this.AM.addListener('edge', () => {
            console.log('Address Match')
        })

        this.DR = this.gpio.requestLineEvents(pins.DR, 'rising', 10)
        this.DR.addListener('edge', () => {
            console.log('Data Ready')
        })

        this.spidev = new SPIDev(path, {
            MAX_SPEED_HZ: 10_000_000,
            SPI_LSB_FIRST: false,
            BITS_PER_WORD: 8,
            SPI_NO_CS: true,
            SPI_MODE: 0
        })

        this.writeCR({
            CH_NO: channel,
            AUTO_RETRAN: 0,
            RX_RED_PWR: 0,
            PA_PWR: 3,
            HFREQ_PLL: band,
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

    private setTxAddress(addr: number): void {
        this.CSN.setValue(0)

        switch (this.configuration.TX_AFW) {
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

    private setTxPayload(data: Uint8Array): void {
        const payload = new Uint8Array(1 + this.configuration.TX_PW)
        payload[0] = W_TX_PAYLOAD
        payload.set(data, 1)

        this.CSN.setValue(0)
        this.spidev.transfer(33, payload)
        this.CSN.setValue(1)
    }

    public sendData(targetId: number, data: Uint8Array): void {
        if (!this.isReceiving) {
            this.PWR_UP.setValue(1, 1000)  
            this.TX_EN.setValue(1)

        } else {
            this.TRX_CE.setValue(0)
            this.TX_EN.setValue(1)            
        }
        
        this.setTxAddress(targetId)
        this.setTxPayload(data)

        this.TRX_CE.trigger(1, 1000)
        const isDataReady = this.DR.wait(10_000_000)
        this.TX_EN.setValue(0)

        if (this.isReceiving) {
            this.TRX_CE.setValue(1)    

        } else {
            this.PWR_UP.setValue(0)
        }

        if (!isDataReady) {
            throw new Error('Sending data failed')
        }
    }

    public startReceiver() {
        this.isReceiving = true

        this.PWR_UP.setValue(1, 1000)
        this.TRX_CE.setValue(1)
        this.TX_EN.setValue(0)
    }

    public stopReceiver(): void {
        this.isReceiving = false

        this.TRX_CE.setValue(0)
        this.PWR_UP.setValue(0)
    }

    public readData(): Uint8Array {
        this.TRX_CE.setValue(0)
        
        this.CSN.setValue(0)
        const data = this.spidev.transfer(1 + this.configuration.RX_PW, Uint8Array.from([R_RX_PAYLOAD]))
        this.CSN.setValue(1)

        if (this.isReceiving) {
            this.TRX_CE.setValue(1)
        }
        return data.slice(1)
    }

    private writeCR(config: ConfigurationRegister): void {
        this.CSN.setValue(0)
        this.spidev.transfer(11, encodeCR(config))
        this.CSN.setValue(1)
    }

    private readCR(): ConfigurationRegister {
        this.CSN.setValue(0)
        const cr = decodeCR(this.spidev.transfer(11, Uint8Array.from([R_CONFIG])))
        this.CSN.setValue(1)
        return cr
    }

    private decodeStatusRegister(data: Uint8Array): StatusRegister {
        return {
            AM: Boolean(data[0] & 0x80),
            DR: Boolean(data[0] & 0x20)
        }
    }

    public getFrequency(): number {
        return 422.4 + (this.configuration.CH_NO / 10) * (1 + this.configuration.HFREQ_PLL)
    }

    public release(): void {
        this.spidev.close()
        this.gpio.close()
    }
}
