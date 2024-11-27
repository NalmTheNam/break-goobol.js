class BAN {
  constructor(number, options) {
    if (typeof number == "string") {
      
    }
    
    this.mantissa = options?.mantissa ?? 1
    
    if (number instanceof Array) {
      this.numberArray = number
      
      // Rule 2 of BAN: If the last entry is 1, it can be removed
      
      /*
      const entryCount = this.numberArray.length
      
      const lastEntry = this.numberArray[entryCount - 1]
      if (lastEntry === 1) this.numberArray.pop()
      */
      
      return this
    }
    
    this.numberArray = [number]
  }
  
  toString(options = { notation: "mixed-scientific" }) {
    const entryCount = this.numberArray.length
    const illionPrefixes = {
      "0-to-33-OoM": ["m", "b", "tr", "quadr", "quint", "sext", "sept", "oct", "non", "dec"],
      "prefixes-after-decillion": ["un", "duo", "tre", "quattour", "quin", "sex", "septen", "octo", "novem"]
    }
    
    function convertNumberToIllion() {
      
    }
    
    const getFormatNotation = () => {
      if (options?.notation === "plain") return "standard"
      if (options?.notation === "scientific") return "scientific"
      return "compact"
    }
    
    if (entryCount === 1) {
      return new Intl.NumberFormat('en', { 
        maximumFractionDigits: this.numberArray[0] < 100 ? 2 : 0,
        notation: getFormatNotation(),
        compactDisplay: "long"
      }).format(this.numberArray[0])
    }
    
    if (entryCount === 2) {
      if (options?.notation !== "mixed-scientific" && options?.notation !== "scientific") {
        const number = 10 ** this.magnitude * this.mantissa
        return new Intl.NumberFormat('en', { 
          maximumFractionDigits: 0,
          notation: getFormatNotation(),
          compactDisplay: "long"
        }).format(number) 
      }
      
      return `${this.mantissa.toFixed(2)}e${this.magnitude}`
    }
  }
  
  mul(multiplier) {
    const newArray = new BAN([...this.numberArray], {
      mantissa: this.mantissa
    })
    
    if (typeof multiplier == "string")
      multiplier = BAN.parseNumber(multiplier)
    
    if (newArray.numberArray.length === 1 && !(multiplier instanceof BAN)) {
      newArray.numberArray[0] *= multiplier
      newArray.normalizeArray()
      
      return newArray
    }
        
    /*
    if (typeof number == "string") {
      const result = BAN.parseNumber(number)
      return result
    }*/
    
    
    const multOom = Math.floor(Math.log10(multiplier))
    const multSignificand = multiplier / 10 ** multOom
    
    newArray.numberArray[1] += multOom
    newArray.setMantissa(newArray.mantissa * multSignificand)
    
    return newArray
  }
  
  setMantissa(mantissa) {
    this.mantissa = mantissa
    this.normalizeMantissa()
  }
  
  normalizeMantissa() {
    if (this.mantissa >= 10) {
      const mantissaOom = Math.floor(Math.log10(this.mantissa))
      
      this.numberArray[1] += mantissaOom
      this.mantissa /= 10 ** mantissaOom
    }
  }
  
  normalizeArray() {
    if (this.numberArray[0] > 9e15) { 
      const magnitude = Math.floor(Math.log10(this.numberArray[0]))
      const mantissa = this.numberArray[0] / 10 ** magnitude
        
      this.setMantissa(mantissa)
        
      this.numberArray[0] = 10
      this.numberArray[1] = magnitude
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
  
  get magnitude() {
    return this.numberArray[1] ?? Math.floor(Math.log10(this.numberArray[0]))
  }
}