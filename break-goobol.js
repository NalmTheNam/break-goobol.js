class BAN {
  constructor(numberOrArray = [0], options = {}) {
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
      return result
    }
    
    newArray.mantissa *= number
    newArray.normalizeMantissa()
    
    return newArray
  }
  
  normalizeMantissa() {
    if (this.mantissa >= 10) {
      const mantissaOom = Math.floor(Math.log10(this.mantissa))
      
      this.numberArray[1] += mantissaOom
      this.mantissa /= 10 ** mantissaOom
    }
  }
  
  static parseNumber(numberString) { 
    if (typeof numberString == "number") return numberString
    
    const parsedNumber = Number(numberString)
    if (parsedNumber !== Number.POSITIVE_INFINITY && !Number.isNaN(parsedNumber)) return parsedNumber
      
    const numberHasENotation = numberString.includes("e")
    if (!numberHasENotation) throw new Error("BAN Error: The parsed number is either infinite or not a number. Parsed number: " + parsedNumber)
    
    let newArray = new BAN(10)
    const [mantissa, magnitude] = numberString.split("e")
    
    const parsedMantissa = Number(mantissa)
    const parsedMagnitude = Number(magnitude)
    
    newArray.mantissa = parsedMantissa
    newArray.numberArray[1] = parsedMagnitude
    
    newArray.normalizeMantissa()
    return newArray
  }
}