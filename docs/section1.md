[クラウドを支えるこれからの暗号技術](https://www.amazon.co.jp/dp/479804413X/ref=cm_sw_em_r_mt_dp_U_UKQ3DbE2S7SKF)を読み進めているので、自分なりに簡単にまとめようと思います。

最終的に「完全準同型暗号を実装して加乗の演算を行う」ことが目標です。

## まえおき

とりあえず 1 章のまとめとなりますが、本書を読み進めていく上でキーワードとなりそうなものを列挙しておきます。

- 情報理論的安全性
- 計算量的安全性
- 秘密鍵
- 乱択アルゴリズム

1 章の例としてあげられている**vernam 暗号**などを実装しながらポイントをまとめます。

また、これ以降、平文や暗号文は、基本的にビット列（01011100 など）として扱います。

## 共通鍵暗号

共通鍵暗号とは、暗号化するときと複合化するときに**共通の鍵**を使う暗号方式です。ここで言う鍵とは、英単語や数字、バイナリなど任意の情報を指しています。暗号を共有したい対象とこの鍵を共有するため、**共通鍵暗号**と呼ばれています。またこの鍵を秘密鍵と呼ぶこともあり、**秘密鍵暗号**と呼ばれることもあります。

以下で扱う vernam 暗号も共通鍵暗号の一種です。

## 情報理論的安全性

暗号理論には「情報理論的安全」と言う言葉があります。

平文を[tex: \displaystyle m]、暗号文を[tex: \displaystyle Enc(m)]とするとき、[tex: \displaystyle m]と[tex: \displaystyle Enc(m)]が[tex: \displaystyle n]通り存在し、いずれのパターンにもなる確率が同様に確からしいとき、この暗号は**情報理論的安全**であると言います。

よりカンタンに書くと、

暗号文を知らない人が当てずっぽうで平文を当てる確率と、暗号文[tex: \displaystyle Enc(m)]から何らかの方法（秘密鍵を総当たりで調べるなど）で推測した時に平文を当てる確率が同じ時に、この暗号文[tex: \displaystyle Enc(m)]は**情報理論的安全**であると言います。

適当に当てるのと同確率でしか解読ができないため、情報理論的安全が保たれていれば、平文から生成できる暗号の中でもっとも安全な暗号であると言えます。

そんな情報理論的安全性をもつ暗号として、 **Vernam 暗号** が有名です。

前節でも触れましたが、Vernam 暗号は共通鍵暗号の一種です。

##### **定義**

サイズが[tex: \displaystyle n]ビットの平文[tex: \displaystyle m]に対して、[tex: \displaystyle n]ビットの乱数[tex: \displaystyle r]を秘密鍵とした時、

<div style="text-align: center;">
[tex:
\displaystyle
Enc(m) := m \oplus r
]
</div>

で定められる[tex: \displaystyle Enc(m)]を Vernam 暗号と呼ぶ。

複合化は、[tex: \displaystyle Enc(m) \oplus r = m \oplus r \oplus r]のように暗号文に対してもう一度秘密鍵で排他的論理和をとれば行えます。

Vernam 暗号が情報理論的安全であるのは秘密鍵[tex: \displaystyle r]が乱数で生成される部分に大きく起因しています。

実際の例を用いて、vernam 暗号が情報理論的安全であること、また情報理論的安全性とはどうゆうことなのかをより具体的に確認してみましょう。

## Vernam 暗号

平文[tex: \displaystyle m]が 4 ビットの **1010** だったと仮定します。

次に平文と同サイズである 4 ビットの[tex: \displaystyle r]を乱数で生成します。
例えばサイコロを振って奇数なら 0、偶数なら 1 とするなどです。

この試行を行ったとして、**1100**となる秘密鍵[tex: \displaystyle r]が生成できたとします。

これらの[tex: \displaystyle m]と[tex: \displaystyle r]の排他的論理和をとると **0110** となりこれが Vernam 暗号で生成された暗号文となります。

さて、この暗号に対して攻撃を行ってみましょう。

秘密鍵がわかれば、平文を複合できるので秘密鍵を当ててみます。

平文が 4 ビットなので秘密鍵は[tex: \displaystyle 2\^4]通り存在します。またこれら全てのパターンはサイコロの目による乱数で生成されているため同様に確からしいです。

よって、正解の秘密鍵を引き当てて攻撃に成功する確率は[tex: \displaystyle 1/2\^4 = 1/16] です。

これに対し、なにも考えずとにかく適当に攻撃してみましょう。

例えば、Vernam 暗号のことを何も知らない通行人に、「この金庫に 100 万円入ってて、0 と 1 だけで構成された 4 桁の数字で解錠できるんすよ。開けたら中身あげますね。」って言ったら、とりあえず全[tex: \displaystyle 2\^4]通りしらみつぶしに試行しますよね、きっと。

上記の試行の結果、この金庫が解錠する可能性は当然 [tex: \displaystyle 1/2\^4 =1/16] であり、この確率は「この暗号が Vernam 暗号だと知っていて、かつ秘密鍵を使って攻撃を行っていた人が、攻撃に成功する確率と等しい」です。

このように、暗号方式を知っていて複合化の方法も分かっている状態でも、適当に当てずっぽうで平文を解読する確率と何ら変わらないことを情報理論的安全と言っているようです。

それに対し、仮に秘密鍵のパターンが**0000**、**1111**の 2 種類しかなかったとします。この場合は、秘密鍵を用いて攻撃を行えば [tex: \displaystyle 1/2]の確率で平文を解読することが可能であり、圧倒的に当てずっぽうより確率が高いです。

このような暗号は情報理論的安全とは言えません。

### vernam 暗号の問題点と計算量的安全性

じゃあ、情報理論的安全な vernam 暗号をみんな使えばいいじゃん。となりそうなところですが大きく２つの問題点があります。

1. 生成した秘密鍵[tex: \displaystyle r]をどうやって共有するのか
2. 平文と秘密鍵の情報量が変わっておらず扱いずらい

**1.** に関しては、結局「秘密鍵[tex: \displaystyle r]の共有するために秘密鍵を暗号化して送る必要あるんじゃない？」と言う無限ループに陥ってしまう問題ですね。つまり問題が[tex: \displaystyle m]から[tex: \displaystyle r]へとただ単純にすり替わっただけと捉えられます。

**2.** は実用的な観点です。先ほどはカンタンのために 4 ビットと言う小さなサイズで例としましたが実際に扱われる暗号ではもっと大きな情報量を扱います。この際、計算量などの観点からはより小さなサイズの方が実用的であり、平文と同等のサイズでしか秘密鍵を生成できないのは問題です。

ここで妥協点となるのが **計算量的安全性** です。

カンタンに言うと、「平文 2048 ビットに対して秘密鍵は 64 ビットになっちゃうけど、[tex: \displaystyle 2\^32]通り全て網羅するのに、500 兆年かかるからまぁ安全だよね」みたいな状態です。

厳密な定義はよく分かっていませんが、攻撃に必要な計算量を見積もり、それらが現実的に解けないと判断された暗号は計算量的安全であるといえるそうです。

### vernam 暗号の実装

アルゴリズムの理解を深めるためにサクッと実装したので vernam 暗号の実装とその結果を貼り付けておきます。

今仕事で TypeScript をメインで用いているので TS で書いていますが、ビット演算が扱いにくかったので今後の実装は Go か C++で書くと思います。

結果を貼っておきますが、特にこれは面白くないので見なくていいです w

<div>
<div id="div_1">
<p><input type="button" value="コードを表示する" style="WIDTH:150px"
   onClick="document.getElementById('div_2').style.display='block';
            document.getElementById('div_1').style.display='none'"></p>
</div>
<div id="div_2" style="display:none">
<p><input type="button" value="コードを隠す" style="WIDTH:150px"
   onClick="document.getElementById('div_2').style.display='none';
            document.getElementById('div_1').style.display='block'"></p>
<p>
```typescript
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
main(m)

```

実行結果

```

d (digit): 4
m (plain text): 11 1011
r (private key): 11 1011
Enc(m) (ciphertext): 0 0
Dec(m) (plain text): 11 1011

````

</p>
<p><input type="button" value="コードを隠す" style="WIDTH:150px"
   onClick="document.getElementById('div_2').style.display='none';
            document.getElementById('div_1').style.display='block';
            document.location='#div_1'"></p>
</div>
</div>

## 決定的アルゴリズムと乱択アルゴリズム

ここからは暗号方式に求められるアルゴリズムについてです。

まず用語の定義を整理します。

ある入力に対する出力が常に同じとなるアルゴリズムのことを決定的アルゴリズムと言います。

それに対して、ある入力に対して出力が確率的に変化するアルゴリズムのことを乱択アルゴリズム、または確率的アルゴリズムと言います。

暗号化アルゴリズムは確率的アルゴリズムであることが求められます。

平文と秘密鍵が同じならば、かならず同じ暗号文になる場合、暗号さえ盗聴できていれば平文を推測することが可能となる場合があります。


決定的アルゴリズムではない暗号方式としてCBCモードが上げられます。

CBCモードは秘密鍵と平文に加えて、IV（Initialization Vector）と言うもう１つの要素を加えて暗号化することで、同じ秘密鍵と平文を用いて暗号文を生成してもIVによって変化するというアルゴリズムです。

### CBCモードの実装

CBCモードは平文をブロックに分割してそれらを逐次的に暗号化していく手法です。アルゴリズム自体は本を参照するかググってください。

以下TSによる実装と結果です。実装は特段見る必要ないのですが、同じ平文と秘密鍵でも異なる暗号文が生成できている部分に注目してください。

<div>
<div id="div_1">
<p><input type="button" value="コードを表示する" style="WIDTH:150px"
   onClick="document.getElementById('div_2').style.display='block';
            document.getElementById('div_1').style.display='none'"></p>
</div>
<div id="div_2" style="display:none">
<p><input type="button" value="コードを隠す" style="WIDTH:150px"
   onClick="document.getElementById('div_2').style.display='none';
            document.getElementById('div_1').style.display='block'"></p>
<p>
```typescript
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

````

</p>
<p><input type="button" value="コードを隠す" style="WIDTH:150px"
   onClick="document.getElementById('div_2').style.display='none';
            document.getElementById('div_1').style.display='block';
            document.location='#div_1'"></p>
</div>
</div>

実行結果

1 回目

```
IV: 8 1000
m (plain text): 3498 110110101010
r (private key): 5 0101
cbc(m) (cipher): 240 000011110000
Dec(m) (plain text): 3498 110110101010
```

2 回目

```
IV: 10 1010
m (plain text): 3498 110110101010
r (private key): 5 0101
cbc(m) (cipher): 722 001011010010
Dec(m) (plain text): 3498 110110101010
```

このように、平文と秘密鍵が同じでも IV のおかげで異なる暗号文を生成できていることがわかります。

### まとめ

- 共通鍵暗号についてまとめました
- 情報理論的安全性と計算量的安全性についてまとめました
- Vernam 暗号と CBC モードを解説/実装しました
