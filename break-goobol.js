class BAN {
  constructor(numberOrArray, options = {}) {
    this.mantissa = options?.mantissa ?? 1
    
    if (numberOrArray instanceof Array) {
      this.numberArray = numberOrArray
      
      // Rule 2 of BAN: If the last entry is 1, it can be removed
      
      /*
      const entryCount = this.numberArray.length
      
      const lastEntry = this.numberArray[entryCount - 1]
      if (lastEntry === 1) this.numberArray.pop()
      */
      
      return this
    }
    
    const number = numberOrArray
    this.numberArray = [number]
  }
  
  toString() {
    const entryCount = this.numberArray.length
    
    if (entryCount === 1) return this.numberArray[0].toString()
    
    if (entryCount === 2) {
      return (this.numberArray[0] ** this.numberArray[1]).toString()
    }
  }
  
  mul(number) {
    const newArray = new BAN(this.numberArray, {
      mantissa: this.mantissa
    })
        
    if (typeof number == "string") {
      const result = BAN.parseNumber(number)
    }
    
    newArray.mantissa *= number
    
    if (newArray.mantissa > 10) {
      const mantissaOom = Math.floor(Math.log10(newArray.mantissa))
      
      newArray.numberArray[1] += mantissaOom
      newArray.mantissa /= 10 ** mantissaOom
    }
    
    return newArray
  }
  
  static parseNumber(number) {
    const parsedNumber = Number(number)
    
    if (parsedNumber !== Number.POSITIVE_INFINITY || !Number.isNaN(parsedNumber)) return parsedNumber
    f
      
    const [mantissa, magnitude] = number.split("e")
  }
}