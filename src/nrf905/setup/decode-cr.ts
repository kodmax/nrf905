import { ConfigurationRegister } from './registers'

export const decodeCR = (data: Uint8Array): ConfigurationRegister => {
    return {
        CH_NO: data[1] + ((data[2] & 0x1) << 8),
        AUTO_RETRAN: (data[2] & 0x20) >> 5,
        RX_RED_PWR: (data[2] & 0x10) >> 4,
        PA_PWR: (data[2] & 0x0c) >> 2,
        HFREQ_PLL: (data[2] & 0x02) >> 1,
        TX_AFW: (data[3] & 0x70) >> 4,
        RX_AFW: (data[3] & 0x07),
        RX_PW: (data[4] & 0x3f),
        TX_PW: (data[5] & 0x3f),
        RX_ADDRESS: new Uint32Array(data.buffer.slice(6, 10))[0],
        CRC_MODE: (data[10] & 0x80) >> 7,
        CRC_EN: (data[10] & 0x40) >> 6,
        XOF: (data[10] & 0x38) >> 3,
        UP_CLK_EN: (data[10] & 0x04) >> 2,
        UP_CLK_FREQ: (data[10] & 0x03)
    }
}
