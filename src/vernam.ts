function rollDice() {
  return Math.floor(Math.random() * Math.floor(6))
}

function isOdd(n: number) {
  return n % 2
}

export function countDigit(m: number): number {
  return m.toString(2).length
}

export function createPrivateKey(d: number): number {
  let r = 0
  for (let i = 0; i < d; i++) {
    if (isOdd(rollDice())) {
      r += Math.pow(2, i)
    }
  }
  return r
}

export function Enc(m: number, r: number): number {
  return m ^ r
}

export function Dec(l: number, r: number): number {
  return l ^ r
}

function main(m: number) {
  // Encryption & Decryption
  const d = countDigit(m)
  console.log('d (digit):', d)
  const r = createPrivateKey(d)

  console.log('m (plain text):', m, m.toString(2))
  console.log('r (private key):', r, r.toString(2).padStart(4, '0'))
  console.log('Enc(m) (ciphertext):', Enc(m, r), Enc(m, r).toString(2))
  console.log(
    'Dec(m) (plain text):',
    Dec(Enc(m, r), r),
    Dec(Enc(m, r), r).toString(2)
  )

  return
}

const m: number = 11 // 1011
// main(m)
