import { createPrivateKey, Enc } from './vernam'

const MAX_DIGIT = 12
const BLOCK_DIGIT = 4

function toBinaryStringFromNumber(n: number, d: number): string {
  return n.toString(2).padStart(d, '0')
}

function toNumberFromBinaryString(bs: string): number {
  return parseInt(bs, 2)
}

function toBinaryFromNumberArray(na: number[]): number {
  let bs = ''
  for (let n of na) {
    bs += toBinaryStringFromNumber(n, BLOCK_DIGIT)
  }
  return toNumberFromBinaryString(bs)
}

function getBlocks(m: number): number[] {
  const bs = toBinaryStringFromNumber(m, MAX_DIGIT)
  let blocks: number[] = []
  for (let i = 0; i < MAX_DIGIT / BLOCK_DIGIT; i++) {
    blocks = [
      ...blocks,
      toNumberFromBinaryString(
        bs.slice(0 + i * BLOCK_DIGIT, 4 + i * BLOCK_DIGIT)
      )
    ]
  }
  return blocks
}

function cipherBlockChaining(
  blocks: number[],
  iv: number,
  r: number
): [number[], number] {
  let c_1 = iv // C_n-1
  let C: number[] = []
  for (const b of blocks) {
    let c = Enc(b ^ c_1, r)
    C = [...C, c]
    c_1 = c
  }

  return [C, toBinaryFromNumberArray(C)]
}

function deCipherBlockChaining(C: number[], iv: number, r: number): number {
  let c_1 = iv // C_n-1
  let M: number[] = []
  for (const c of C) {
    let m = Enc(c, r) ^ c_1
    M = [...M, m]
    c_1 = c
  }
  return toBinaryFromNumberArray(M)
}

function main(m: number, iv: number) {
  const r = createPrivateKey(BLOCK_DIGIT)
  const [C, cn] = cipherBlockChaining(getBlocks(m), iv, r)
  const M = deCipherBlockChaining(C, iv, r)

  console.log('IV:', iv, toBinaryStringFromNumber(iv, BLOCK_DIGIT))
  console.log('m (plain text):', m, toBinaryStringFromNumber(m, BLOCK_DIGIT))
  console.log('r (private key):', r, toBinaryStringFromNumber(r, BLOCK_DIGIT))
  console.log('cbc(m) (cipher):', cn, toBinaryStringFromNumber(cn, MAX_DIGIT))
  console.log('Dec(m) (plain text):', M, toBinaryStringFromNumber(M, MAX_DIGIT))
}

const m: number = 3498 // 0b 1101 1010 1010
const iv: number = 8 // 0b 1000

main(m, iv)
