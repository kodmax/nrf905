export type Pins = {
    /**
     * Power up / down
     * 1 for power up
     * Input
     */
    PWR_UP: number

    /**
     * Eanble Radio
     * Input
     */
    TRX_CE: number

    /**
     * Transmit/Receive
     * 1 for TX and 0 for RX
     * Input
     */
    TX_EN: number

    /**
     * Carrier Detect
     * Output
     */
    CD: number

    /**
     * Address Match
     * Output
     */
    AM: number

    /**
     * Data Ready
     * Output
     */
    DR: number

    /**
     * Chip select, zero to start transfer
     * Input
     */
    CSN: number
}
