module.exports = {
    //the first key in the array is the public key the second key is the private key and the third is the modules

    generateKeys: function (){
        let primes = generatePrimes(193n, 255n);
        let prime1 = primes[Math.floor(Math.random() * primes.length)]
        let prime2 = primes[Math.floor(Math.random() * primes.length)]
        while(prime1 === prime2){
            prime2 = primes[Math.floor(Math.random() * primes.length)]
        }
        let n = prime1 * prime2
        let upper = ((prime1 - 1n) * (prime2 - 1n)) / (greatestCommonDivisor(prime1 - 1n, prime2 - 1n))
        let e = 17n;
        while (greatestCommonDivisor(e, upper) !== 1n) {
            prime1 = primes[Math.floor(Math.random() * primes.length)]
            prime2 = primes[Math.floor(Math.random() * primes.length)]
            n = prime1 * prime2
            upper = ((prime1 - 1n) * (prime2 - 1n)) / (greatestCommonDivisor(prime1 - 1n, prime2 - 1n))
        }
        let d = modInverse(e, upper)
        return [e, d, n]
    },

    encrypt: function (message, key){
        let newMessage = "";
        for(let i = 0; i < message.length; i++) {
            newMessage += (BigInt(message.charCodeAt(i)) ** key[0] % key[1]).toString(16).padStart(4,"0")
        }
        return newMessage
    },

    decrypt: function (encrypted, key) {
        let message = "";
        for(let i = 0; i < encrypted.length; i += 4){
            let enc_string = encrypted.substring(i, i+4)
            let enc = parseInt(enc_string, 16)
            let dec = BigInt(enc) ** key[0] % key[1]
            if(dec >= 0 && dec < 256){
                message += String.fromCharCode(Number(dec))
            }
        }
        return message;
    }
}
const generatePrimes = (l, h) =>{
    let primes = []
    for(let i = l; i < h+1n; i++) {
        let prime = true;
        for(let j = 2n; j < i; j++) {
            if(i % j === 0n) {
                prime = false;
                break;
            }
        }
        if(prime) {
            primes.push(i)
        }
    }
    return primes
}
const greatestCommonDivisor = (x,y) =>{
    let GCD = 1n
    if(x > y) {
        for(let i = 1n; i < y+1n; i++) {
            if (x % i === 0n && y % i === 0n) {
                GCD = i
            }
        }
    }
    else {
        for(let i = 1n; i < x+1n; i++) {
            if (x % i === 0n && y % i === 0n) {
                GCD = i
            }
        }
    }
    return GCD
}

const generateEValue = (p,q, upper) =>{
    for(let i = upper-1n; i >= 2n; i--){
        if(greatestCommonDivisor(i,upper) === 1n){
            return i;
        }
    }
    return false;
}

const modInverse = (A, M) =>
{
    for (let X = 1n; X < M; X++)
        if (((A % M) * (X % M)) % M === 1n)
            return X;
}
