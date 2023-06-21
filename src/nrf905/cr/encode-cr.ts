import { W_CONFIG } from '../consts'
import { ConfigurationRegister } from '../registers'

export const encodeCR = (config: ConfigurationRegister): Uint8Array => {
    const cr = new Uint8Array(11)
    cr[0] = W_CONFIG

    cr[1] = config.CH_NO & 0xff
    cr[2] |= config.AUTO_RETRAN << 5
    cr[2] |= config.RX_RED_PWR << 4
    cr[2] |= config.PA_PWR >> 2
    cr[2] |= config.HFREQ_PLL << 1
    cr[2] |= (config.CH_NO >> 8) & 0x1
    cr[3] |= config.TX_AFW << 4
    cr[3] |= config.RX_AFW
    cr[4] |= config.RX_PW
    cr[5] |= config.TX_PW
    cr[6] |= (config.RX_ADDRESS >> 0) & 0xff
    cr[7] |= (config.RX_ADDRESS >> 8) & 0xff
    cr[8] |= (config.RX_ADDRESS >> 16) & 0xff
    cr[9] |= (config.RX_ADDRESS >> 24) & 0xff
    cr[10] |= config.CRC_MODE << 7
    cr[10] |= config.CRC_EN << 6
    cr[10] |= config.XOF << 3
    cr[10] |= config.UP_CLK_EN << 2
    cr[10] |= config.UP_CLK_FREQ

    return cr
}
