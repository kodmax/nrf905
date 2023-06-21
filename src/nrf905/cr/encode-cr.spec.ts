import { W_CONFIG } from '../consts'
import { encodeCR } from './encode-cr'

describe('encode configuration register', () => {
    it('default settings', () => {
        const cr = encodeCR({
            CH_NO: 108,
            AUTO_RETRAN: 0,
            RX_RED_PWR: 0,
            PA_PWR: 0,
            HFREQ_PLL: 0,
            TX_AFW: 4,
            RX_AFW: 4,
            RX_PW: 32,
            TX_PW: 32,
            RX_ADDRESS: 0xe7e7e7e7,
            CRC_MODE: 1,
            CRC_EN: 1,
            XOF: 4,
            UP_CLK_EN: 1,
            UP_CLK_FREQ: 3
        })

        expect(Array.from(cr)).toEqual([
            W_CONFIG, 108, 0, 68, 32, 32, 231, 231, 231, 231, 231
        ])
    })
})
