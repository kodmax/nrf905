/**
 * @see https://infocenter.nordicsemi.com/pdf/nRF905_PS_v1.5.pdf
 */

export type StatusRegister = {
    /**
     * Address Match
     * bit 7
     */
    AM: boolean

    /**
     * Data Ready
     * bit 5
     */
    DR: boolean
}

export type ConfigurationRegister = {
    /**
     * Sets center frequency together with HFREQ_PLL (default = 001101100b = 108d).
     * fRF = ( 422.4 + CH_NOd /10)*(1+HFREQ_PLLd) MHz
     *
     * bitwidth 9
     */
    CH_NO: number

    /**
     * Retransmit contents in TX register if TRX_CE and TXEN are high (default = 0).
     * '0' – No retransmission
     * '1' – Retransmission of data packet
     */
    AUTO_RETRAN: number

    /**
     * Reduces current in RX mode by 1.6mA. Sensitivity is reduced (default = 0).
     * '0' – Normal operation
     * '1' – Reduced power
     */
    RX_RED_PWR: number

    /**
     * Output power (default = 00).
     * '00' -10dBm
     * '01' -2dBm
     * '10' +6dBm
     * '11' +10dBm
     */
    PA_PWR: number

    /**
     * Sets PLL in 433 or 868/915MHz mode (default = 0).
     * '0' – Chip operating in 433MHz band
     * '1' – Chip operating in 868 or 915 MHz band
     */
    HFREQ_PLL: number

    /**
     * TX-address width (default = 100).
     * '001' – 1 byte TX address field width
     * '100' – 4 byte TX address field width
     */
    TX_AFW: number

    /**
     *  RX-address width (default = 100).
     * '001' – 1 byte RX address field width
     * '100' – 4 byte RX address field width
     */
    RX_AFW: number

    /**
     * RX-payload width (default = 100000).
     * '000001' – 1 byte RX payload field width
     * '000010' – 2 byte RX payload field width
     * ...
     * '100000' – 32 byte RX payload field width
     */
    RX_PW: number

    /**
     * TX-payload width (default = 100000).
     * '000001' – 1 byte TX payload field width
     * '000010' – 2 byte TX payload field width
     * ...
     * '100000' – 32 byte TX payload field width
     */
    TX_PW: number

    /**
     * RX address identity. Used bytes depend on RX_AFW (default = E7E7E7E7h).
     */
    RX_ADDRESS: number

    /**
     * CRC – mode (default = 1).
     * '0' – 8 CRC check bit
     * '1' – 16 CRC check bit
     */
    CRC_MODE: number

    /**
     * CRC – check enable (default = 1).
     * '0' – Disable
     * '1' – Enable
     */
    CRC_EN: number

    /**
     * Crystal oscillator frequency. Must be set according to external
     * crystal resonant frequency (default = 100).
     * '000' – 4MHz
     * '001' – 8MHz
     * '010' – 12MHz
     * '011' – 16MHz
     * '100' – 20MHz
     */
    XOF: number

    /**
     * Output clock enable (default = 1).
     * '0' – No external clock signal available
     * '1' – External clock signal enabled 
     */
    UP_CLK_EN: number

    /**
     * Output clock frequency (default = 11).
     * '00' – 4MHz
     * '01' – 2MHz
     * '10' – 1MHz
     * '11' – 500kHz
     * 
     */
    UP_CLK_FREQ: number
}
