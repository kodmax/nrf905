import { GPIOController, GPIOOutputLine, GPIOLineEvents } from 'gpiod-client'
import { SPIDev } from 'spi-dev'
import { Pins } from './pins'
import { NRF905Setup } from './setup'

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

    public readonly setup: NRF905Setup

    public constructor(chipname: string, private readonly path: string, freq: number, pins: Pins) {
        this.gpio = new GPIOController(chipname, 'nRF905')

        this.PWR_UP = this.gpio.requestLineAsOutput(pins.PWR_UP, 1)
        this.TRX_CE = this.gpio.requestLineAsOutput(pins.TRX_CE, 1)
        this.TX_EN = this.gpio.requestLineAsOutput(pins.TX_EN, 0)
        this.CSN = this.gpio.requestLineAsOutput(pins.CSN, 1)

        this.CD = this.gpio.requestLineEvents(pins.CD, 'rising', 10)
        this.AM = this.gpio.requestLineEvents(pins.AM, 'rising', 10)
        this.DR = this.gpio.requestLineEvents(pins.DR, 'rising', 10)

        this.spidev = new SPIDev(path, {
            MAX_SPEED_HZ: 10_000_000,
            SPI_LSB_FIRST: false,
            BITS_PER_WORD: 8,
            SPI_NO_CS: true,
            SPI_MODE: 0
        })

        this.setup = new NRF905Setup(this.spidev, this.CSN)
        this.setup.setChannel(115, 0, 2)
        
        this.CD.addListener('edge', () => {
            console.log('Carrier Detected')
        })

        this.AM.addListener('edge', () => {
            console.log('Address Match')
        })

        this.DR.addListener('edge', () => {
            console.log('Data Ready')
        })
    }

    public release(): void {
        this.spidev.close()
        this.gpio.close()
    }
}
