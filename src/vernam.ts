function rollDice() {
  return Math.floor(Math.random() * Math.floor(6))
}

function isOdd(n: number) {
  return n % 2
}

function createPrivateKey(plainText: number): number {
  let r = 0
  const n = plainText.toString().length
  for (let i = 0; i < n; i++) {
    if (isOdd(rollDice())) {
      r += Math.pow(2, i)
    }
  }
  return r
}

function Enc(m: number, r: number): number {
  return m ^ r
}

function Dec(l: number, r: number): number {
  return l ^ r
}

function main(m: number) {
  // Encryption & Decryption

  const r = createPrivateKey(m)

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
main(m)
