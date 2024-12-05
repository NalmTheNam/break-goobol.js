class BAN {
  arrayEntries = []
  
  constructor(value = 0) {
    if (typeof value == "string") {
      this.setupArrayFromString(value)
    } else if (typeof value == "number") {
      this.arrayEntries[0] = value
    } else if (value instanceof Array) {
      this.arrayEntries = value
    } else if (value instanceof BAN) {
      this.arrayEntries = value.arrayEntries
      this.mantissa = value.mantissa
    }
    
    this.mantissa = this.mantissa ?? 1
    this.normalizeMantissa()
    this.normalizeArray()
  }
  
  toString(options = {}) {
    const notation = options?.notation ?? "mixed-scientific"
    
    const entryCount = this.arrayEntries.length
    const illionPrefixes = {
      "0-to-33-OoM": ["m", "b", "tr", "quadr", "quint", "sext", "sept", "oct", "non", "dec"],
      "prefixes-after-decillion": ["un", "duo", "tre", "quattour", "quin", "sex", "septen", "octo", "novem"]
    }
    
    function convertNumberToIllion() {
      
    }
    
    const getFormatNotation = () => {
      if (notation === "plain") return "standard"
      if (notation === "scientific") return "scientific"
      return "compact"
    }
    
    if (this.arrayEntries.length === 1) {
      return new Intl.NumberFormat('en', { 
        maximumFractionDigits: this.arrayEntries[0] < 100 ? 2 : 0,
        notation: getFormatNotation(),
        compactDisplay: "long"
      }).format(this.arrayEntries[0])
    }
    
    if (this.arrayEntries.length === 2) {
      if (notation !== "mixed-scientific" && this.magnitude < 308) {
        const number = Math.pow(10, this.magnitude) * this.mantissa
        
        return new Intl.NumberFormat('en', { 
          maximumFractionDigits: 0,
          notation: getFormatNotation(),
          compactDisplay: "long"
        }).format(number) 
      }
      
      return `${this.mantissa.toFixed(2)}e${this.magnitude}`
    }
  }
  
  add(number) {
    const newArray = new BAN(this)
    
    if (newArray.arrayEntries.length === 1) {
      newArray.arrayEntries[0] += number
      newArray.normalizeArray()
    } else if (newArray.arrayEntries.length === 2) {
      const addedMantissa = number / Math.pow(10, newArray.magnitude)
      newArray.setMantissa(newArray.mantissa + addedMantissa)
    }
    
    return newArray
  }
  
  mul(multiplier) {
    const newArray = new BAN([...this.arrayEntries], {
      mantissa: this.mantissa
    })
    
    if (typeof multiplier == "string")
      multiplier = BAN.parseNumber(multiplier)
    
    if (newArray.arrayEntries.length === 1 && !(multiplier instanceof BAN)) {
      newArray.arrayEntries[0] *= multiplier
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
    
    newArray.arrayEntries[1] += multOom
    newArray.setMantissa(newArray.mantissa * multSignificand)
    
    return newArray
  }
  
  setMantissa(mantissa) {
    this.mantissa = mantissa
    this.normalizeMantissa()
  }
  
  normalizeMantissa() {
    if (this.mantissa < 1 || this.mantissa >= 10) {
      const mantissaOom = Math.floor(Math.log10(this.mantissa))
      
      this.arrayEntries[1] += mantissaOom
      this.mantissa /= 10 ** mantissaOom
    }
  }
  
  normalizeArray() {
    const entryCount = this.arrayEntries.length
    
    const firstEntry = this.arrayEntries[0]
    const lastEntry = this.arrayEntries[entryCount - 1]
    
    // If the first entry is an instance of BAN or an Array and the number of entries is 1, 
    // then we set this array's arrayEntries to the array's first entry
    
    const isFirstEntryBAN = firstEntry instanceof BA
    if (firstEntry instanceof BAN && entryCount === 1) {
      this.arrayEntries = firstEntry.arrayEntries
      this.normalizeArray()
      
      return
    }
    
    // Rule 2 of BAN: If the last entry is 1, it can be removed
    if (lastEntry === 1 && entryCount > 1) this.arrayEntries.pop()
    
    if (firstEntry == null) this.arrayEntries[0] = 10
    
    if (firstEntry > 9e15 && this.arrayEntries.length < 2) { 
      const magnitude = Math.floor(Math.log10(firstEntry))
      const mantissa = firstEntry / Math.pow(10, magnitude)
        
      this.setMantissa(mantissa)
        
      this.arrayEntries[0] = 10
      this.arrayEntries[1] = magnitude
    }
  }
  
  getNormalizedArray() {
    
  }
  
  setupArrayFromString(string) {
    const parsedNumber = Number(string)
    if (parsedNumber !== Number.POSITIVE_INFINITY && !Number.isNaN(parsedNumber)) {
      this.arrayEntries = [parsedNumber]
      return
    }
      
    const numberHasENotation = string.includes("e")
    if (!numberHasENotation) throw new Error("BAN Error: The parsed number is either infinite or not a number. Parsed number: " + parsedNumber)
    
    const [mantissa, magnitude] = string.split("e")
    
    const parsedMantissa = Number(mantissa)
    const parsedMagnitude = Number(magnitude)
    
    this.mantissa = parsedMantissa
    
    this.arrayEntries[0] = 10
    this.arrayEntries[1] = parsedMagnitude
    
    this.normalizeMantissa()
  }
  
  static parseNumberFromString(numberString) { 
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
    newArray.arrayEntries[1] = parsedMagnitude
    
    newArray.normalizeMantissa()
    return newArray
  }
  
  /*
  getMantissa() {
    if (this.arrayEntries.length == 1) {
      const magnitude = Math.floor(Math.log10(this.rawNumber))
      const mantissa = this.rawNumber / Math.pow(10, magnitude)
      
      return mantissa
    }
    
    if (this.arrayEntries.length == 2) {
      const mantissa = Math.pow(10, this.arrayEntries[1] - this.magnitude)
      return mantissa
    }
  }
  
  setMantissav2(mantissa) {
    
  }*/
  
  get magnitude() {
    return Math.floor(this.arrayEntries[1]) ?? Math.floor(Math.log10(this.rawNumber))
  }
  
  get rawNumber() {
    const entryCount = this.arrayEntries.length
    
    if (entryCount == 1) return this.arrayEntries[0]
    return (10 ** this.arrayEntries[1] * this.mantissa)
  }
}