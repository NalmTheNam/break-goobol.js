class BAN {
  debugLogs = []
  id = Math.random()
  
  arrayEntries = []
  mantissa = 1
  sign = 0
  
  constructor(value = 0) {
    if (value === "clone-mode") return this
    
    if (typeof value == "string") {
      this.setupArrayFromString(value)
    } else if (typeof value == "number") {
      this.arrayEntries[0] = value
    } else if (value instanceof Array) {
      this.arrayEntries = value
    }
    
    this.normalizeMantissa()
    this.normalizeArray()
  }
  
  clone() {
    const clonedArray = new BAN("clone-mode")
    
    for (const entry of this.arrayEntries) {
      const isEntryBAN = entry instanceof BAN
      const isEntryArray = entry instanceof Array
      
      let clonedEntry = entry;
      
      if (isEntryBAN) clonedEntry = entry.clone()
      if (isEntryArray) clonedEntry = [...entry]
      
      clonedArray.arrayEntries.push(clonedEntry)
    }
    
    clonedArray.mantissa = this.mantissa
    clonedArray.sign = this.sign
    
    return clonedArray
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
    const newArray = this.clone()
    
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
    const newArray = this.clone()
    
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
    
    if (firstEntry == null) this.arrayEntries[0] = 10
    
    if (entryCount === 1) {
      const isFirstEntryBAN = firstEntry instanceof BAN
      const isFirstEntryArray = firstEntry instanceof Array
           
      if (firstEntry instanceof BAN) {
        this.arrayEntries = firstEntry.arrayEntries
        this.normalizeArray()
      
        return
      }
      
      if (firstEntry instanceof Array) {
        this.arrayEntries = firstEntry
        this.normalizeArray()
      
        return
      }
    }
    
    for (const entryNumber in this.arrayEntries) {
      const entry = this.arrayEntries[entryNumber]
      console.log("ID: " + this.id + " | Entry: " + entry)
      
      if (entry instanceof Array)
        this.arrayEntries[entryNumber] = new BAN(entry)
    }
    
    // Rule 2 of BAN: If the last entry is 1, it can be removed
    
    if (lastEntry === 1 && entryCount > 1) this.arrayEntries.pop()
    console.log(this.arrayEntries)
    
    if (firstEntry > 9e15 && this.arrayEntries.length < 2) { 
      const magnitude = Math.floor(Math.log10(firstEntry))
      const mantissa = firstEntry / Math.pow(10, magnitude)
        
      this.setMantissa(mantissa)
        
      this.arrayEntries[0] = 10
      this.arrayEntries[1] = magnitude
    }
    
    if (this.arrayEntries.length === 2 && this.arrayEntries[1] > 9e15)
      this.arrayEntries[1] = new BAN(this.arrayEntries[1])
    
    if (this.arrayEntries[1] instanceof BAN) return this.arrayEntries[1].normalizeArray()
    
    /*
    for (const entryIdx in this.arrayEntries) {
      const entryNumber = this.arrayEntries[entryIdx]
      
      if (entryNumber > 9e15) {
        const magnitude = Math.floor(Math.log10(entryNumber))
        const mantissa = entryNumber / Math.pow(10, magnitude)
        
        if (entryIdx === this.arrayEntries.length - 1) {
          this.setMantissa(mantissa)
        
          this.arrayEntries[0] = 10
          this.arrayEntries[1] = magnitude
          this.arrayEntries[entryIdx]
          
          continue
        }
      }
    }*/
  }
  
  getNormalizedArray() {
    const normalizedArray = this.clone()
    normalizedArray.normalizeArray()
    
    return normalizedArray
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
  
  get magnitude() {
    return Math.floor(this.arrayEntries[1]) ?? Math.floor(Math.log10(this.rawNumber))
  }
  
  get rawNumber() {
    const entryCount = this.arrayEntries.length
    
    if (entryCount == 1) return this.arrayEntries[0]
    return (10 ** this.arrayEntries[1] * this.mantissa)
  }
}