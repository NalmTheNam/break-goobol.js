import { BANFormat } from "./ban-intl.js"

class BAN {
  static normalizeValue(value) {
    if (typeof value == "number") value = new BAN(value)
    if (typeof value == "string") {
      const digits = value.split(".")
      const fractionalDigits = digits[1]
      
      // if (fractionalDigits && fractionalDigits.length > 15)
        // value = new BAN.PreciseNumber(value)
      
      value = new BAN(value)
    }
    
    value.normalizeArray()
    return value
  }
  
  static PreciseNumber = class {
    digits = []
    
    constructor(value) {
      if (typeof value === "number") value = value.toString()
      if (value.includes("e")) {}
      
      const digits = value.split(".")
      const integerDigits = digits[0].split("").reverse().join("") // Reverse the integer digits so that the largest integer digit can be placed into the digits array first.
      const decimalDigits = digits[1]
      
      const decimalDigitsLength = decimalDigits?.length ?? 0
      
      for (let i = integerDigits.length - 1; i >= -decimalDigitsLength; i--) {
        const stringDigitValue = integerDigits[i] ?? decimalDigits[-i - 1]
        const digitValue = Number(stringDigitValue)
        
        this.digits.push({
          value: digitValue, position: i
        })
      }
    }
    
    add(value) {
      const addend = new BAN.PreciseNumber(value)
      for (const digitToAdd of addend.digits) {
        const addedDigit = this.digits.find(digit => digit.position == digitToAdd.position)
        
        if (!addedDigit) {
          this.digits.push({ value: digitToAdd.value, position: digitToAdd.position })
          continue
        }
        
        addedDigit.value += digitToAdd.value
      }
      
      return this
    }
    
    toString() {
      return this.digits.map(digit => (digit.position === -1 ? "." : "") + digit.value).join("")
    }
  }
  
  // Cloning info. This information is mostly used for debugging purposes!
  _cloned = false
  
  arrayEntries = []
  sign = 1
  
  constructor(value = 0, options) {
    if (value === "clone-mode") return this
    
    if (typeof value == "string")
      this.setupArrayFromString(value)
    else if (typeof value == "number")
      this.base = value
    else if (value instanceof Array)
      this.arrayEntries = value
    else if (value instanceof BAN)
      this.arrayEntries = value.arrayEntries
    
    this.normalizeArray()
    return this
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
    
    clonedArray.sign = this.sign
    return clonedArray
  }
  
  toString(options = {}) {
    const defaultOptions = {
      formatOptions: {
        maximumFractionDigits: this.arrayEntries[0] < 100 ? 2 : 0,
        notation: "compact",
        compactDisplay: "long"
      },
      notation: "mixed-scientific",
    }
    
    const notationOptions = {
      "mixed-scientific": {
        formatOptions: {
          maximumFractionDigits: 2,
          notation: "standard"
        },
      }
    }
    
    for (const [optionName, defaultValue] of Object.entries(defaultOptions)) {
      if (!options[optionName]) options[optionName] = defaultValue
    }
    
    const mantissa = this.getMantissa()
    const magnitude = this.getMagnitude()
    
    const illionPrefixes = {
      "0-to-33-OoM": ["m", "b", "tr", "quadr", "quint", "sext", "sept", "oct", "non", "dec"],
      "prefixes-after-decillion": ["un", "duo", "tre", "quattour", "quin", "sex", "septen", "octo", "novem"]
    }
    
    function convertNumberToIllion() {
      
    }
    
    if (this.arrayEntries.length === 1) {
      return new Intl.NumberFormat('en', notationOptions[options.notation].formatOptions).format(this.toNumber())
    }
    
    if (this.arrayEntries.length === 2) {
      const formattedMagnitude = typeof magnitude == "number" ? new BAN(magnitude).toString(options) : magnitude.toString(options)
      /*
      if (this.notation !== "mixed-scientific" && magnitude < 308) {
        const number = Math.pow(10, magnitude) * mantissa
        return new Intl.NumberFormat('en', options.formatOptions).format(number)
      }*/
      
      return `${mantissa.toFixed(2)}e${formattedMagnitude}`
    }
  }
  
  gt(comparedValue) {
    if (comparedValue === Number.POSITIVE_INFINITY) return false
    if (comparedValue === Number.NEGATIVE_INFINITY) return true
    
    if (comparedValue instanceof BAN && Number.isFinite(comparedValue.toNumber())) comparedValue = comparedValue.toNumber()
    comparedValue = BAN.normalizeValue(comparedValue)
    
    if (typeof comparedValue == "number") 
      return this.toNumber() > comparedValue
    else if (comparedValue instanceof BAN) {
      const arrayLength = this.arrayEntries.length
      const comparedArrayLength = comparedValue.arrayEntries.length
      
      const arrayLengthDifference = arrayLength - comparedArrayLength
      
      if (arrayLength < 2 && comparedArrayLength >= 2) return false
      
      if (arrayLengthDifference <= -2) return false
      if (arrayLengthDifference >= 2) return true
      
      if (comparedArrayLength === arrayLength) {
        if (arrayLength === 2) {
          const exponent = this.prime
          const comparedExponent = comparedValue.prime
          
          return exponent > comparedExponent
        }
      }
    }
    
    throw new Error("You definitely did not handle some rare exceptional case didn't you?")
  }
  
  addBy(value) {
    if (value === Number.POSITIVE_INFINITY || value === Number.NEGATIVE_INFINITY) {
      this.arrayEntries = [value]
      return this
    }
    
    value = BAN.normalizeValue(value)
    if (value.sign < 0) value.mutables.negate()
    
    if (this.arrayEntries.length == 2) {
      const addedMantissa = value.getMantissa() / Math.pow(this.base, this.getMagnitude() - value.getMagnitude())
      this.setMantissa(this.getMantissa() + addedMantissa)
    }
    
    this.normalizeArray()
    return this
  }
  
  add(value) {
    const clonedArray = this.clone()
    clonedArray.addBy(value)
    
    return clonedArray
  }
  
  subBy(value) {
    value = BAN.normalizeValue(value)
    
    
  }
  
  mulBy(value) {
    value = BAN.normalizeValue(value)
    
    if (this.arrayEntries.length === 1) {
      let changedNumber = this.base
      changedNumber *= value.toNumber()
      
      if (changedNumber === Number.POSITIVE_INFINITY) {
        this.arrayEntries[1] = Math.log10(this.base)
        this.base = 10
        
        return this.mulBy(value)
      }
      
      this.base = changedNumber
    } else if (this.arrayEntries.length === 2) {
      if (typeof this.arrayEntries[1] == "number") this.arrayEntries[1] += value.getMagnitude()
      else if (this.arrayEntries[1] instanceof BAN) this.arrayEntries[1].add(value.getMagnitude())
      
      this.setMantissa(this.getMantissa() * value.getMantissa())
    }
    
    this.normalizeArray()
    return this
  }
  
  mul(value) {
    const clonedArray = this.clone()
    clonedArray.mulBy(value)
    
    return clonedArray
  }
  
  /*
  divideBy(value) {
    if (value === 0) { 
      this.arrayEntries = [Infinity]; 
      return this 
    }
    
    if (value === Number.POSITIVE_INFINITY || value === Number.NEGATIVE_INFINITY) {
      this.arrayEntries = [0]
      return this
    }
    
    if (value instanceof BAN && Number.isFinite(value.toNumber())) value = value.toNumber()
    value = BAN.normalizeValue(value)
    
    this.mul()
    
    this.normalizeArray()
    return this
  }*/
  
  powBy(value) {
    value = BAN.normalizeValue(value)
    
    if (this.arrayEntries.length === 1) {
      let changedNumber = this.base
      changedNumber **= value.toNumber()
      
      if (changedNumber === Number.POSITIVE_INFINITY) {
        this.arrayEntries[1] = Math.log10(this.base)
        this.base = 10
        
        return this.powBy(value)
      }
      
      this.base = changedNumber
    } else if (this.arrayEntries.length === 2) {
      if (typeof this.arrayEntries[1] == "number") this.arrayEntries[1] *= value.toNumber()
      else if (this.arrayEntries[1] instanceof BAN) this.arrayEntries[1].mulBy(value.toNumber())
    }
    
    this.normalizeArray()
    return this
  }
  
  pow(value) {
    const clonedArray = this.clone()
    clonedArray.powBy(value)
    
    return clonedArray
  }
  
  mutables = {
    negate: () => {
      this.sign = -this.sign
      return this
    }
  }
  
  negate() {
    return this.clone().mutables.negate()
  }
  
  setMantissa(value) {
    if (this.arrayEntries.length === 2) {
      const setMagnitude = Math.log10(value)
      if (typeof this.arrayEntries[1] == "number") this.arrayEntries[1] = this.getMagnitude() + setMagnitude
    }
    
    this.normalizeArray()
    return this
  }
  
  getMantissa() {
    let mantissa = 0
    
    if (this.arrayEntries.length === 2) {
      const magnitude = this.getMagnitude()
      
      if (typeof magnitude == "number") mantissa = Math.pow(10, this.arrayEntries[1] - magnitude)
      if (magnitude instanceof BAN) mantissa = 1
    }
    
    return mantissa
  }
  
  getMagnitude() {
    if (this.base === 0) return 0
    const magnitude = this.arrayEntries[1]
    
    if (magnitude instanceof BAN) return magnitude
    return Math.floor(magnitude)
  }
  
  normalizeArray() {
    if (this.arrayEntries.length === 1) {
      this.sign = Math.sign(this.base)
      
      this.arrayEntries[1] = Math.log10(this.base)
      this.base = 10
    }
    
    for (let i = 0; i < this.arrayEntries.length; i++) {
      const entry = this.arrayEntries[i]
      const isFirstEntry = i === 0
      
      if (entry == null) {
        if (isFirstEntry) this.arrayEntries[i] = 0
        else this.arrayEntries[i] = 1
        
        continue
      }
      
      if (entry > Number.MAX_SAFE_INTEGER) {
        this.arrayEntries[i] = new BAN(entry)
      }
      
      if (typeof entry === "string" || entry instanceof Array) {
        this.addDebugLog(`Entry #${i + 1} is an array or a string, converting entry into BAN array...`)
        this.arrayEntries[i] = new BAN(entry)
        
        continue
      }
      
      if (entry instanceof BAN)
        entry.normalizeArray()
    }
  }
  
  getNormalizedArray() {
    const normalizedArray = this.clone()
    normalizedArray.normalizeArray()
    
    return normalizedArray
  }
  
  optimizeArray() {
    const replicator = this.arrayEntries[1]
    
    // BAN Rule 3: If the second entry is 1, the value is just the first entry: (taken from https://googology.fandom.com/wiki/Bird%27s_array_notation)
    if (replicator === 1) this.arrayEntries = [this.arrayEntries[0]]
    
    if (this.arrayEntries.length === 3) {
      if (replicator < 5) {
        
      }
    }
  }
  
  setupArrayFromString(string) {
    if (typeof string !== "string") return
    
    const parsedNumber = Number(string)
    if (parsedNumber !== Number.POSITIVE_INFINITY && !Number.isNaN(parsedNumber)) {
      this.arrayEntries = [parsedNumber]
      return
    }
      
    const numberHasENotation = string.includes("e")
    if (!numberHasENotation) throw new Error("BAN Error: The parsed number is either infinite or not a number. Parsed number: " + parsedNumber)
    
    const mantissa = string.split("e")[0]
    const magnitudeTowers = string.split("e").slice(1).map(value => value == "" ? "1" : value)
    
    const magnitude = magnitudeTowers.join("e")
    
    const parsedMantissa = Number(mantissa)
    let parsedMagnitude = Number(magnitude)
    
    if (parsedMagnitude === Number.POSITIVE_INFINITY || Number.isNaN(parsedMagnitude))
      parsedMagnitude = new BAN(magnitude)
    
    this.arrayEntries[0] = 10
    this.arrayEntries[1] = parsedMagnitude
    
    this.setMantissa(parsedMantissa)
  }
  
  getNestingDepth() {
    const lastEntryNumber = this.arrayEntries.length - 1
    
    let nestingDepth = 0
    let arrayToNest = this
    
    while (arrayToNest.arrayEntries[lastEntryNumber] instanceof BAN) {
      nestingDepth += 1
      arrayToNest = arrayToNest.arrayEntries[lastEntryNumber]
    }
    
    return nestingDepth
  }
  
  toNumber() {
    if (this.arrayEntries.length === 2) {
      let exponent = this.arrayEntries[1]
      
      if (exponent instanceof BAN) 
        exponent = exponent.toNumber()
      
      return this.sign > 0 ? Math.pow(this.base, exponent) : -Math.pow(this.base, exponent)
    }
  }
  
  set base(value) {
    this.arrayEntries[0] = value
  }
  
  get base() {
    return this.arrayEntries[0]
  }
  
  get prime() {
    return this.arrayEntries[1]
  }
  
  getPilot() {
    const entriesAfterPrime = this.arrayEntries.slice(2)
    return entriesAfterPrime.filter(value => value !== 1)[0]
  }
  
  findPilotIndex() {
    const entriesAfterPrime = this.arrayEntries.slice(2)
    return entriesAfterPrime.findIndex(entry => entry === this.getPilot()) + 2
  }
  
  getCopilot() {
    const pilotIndex = this.findPilotIndex()
    return this.arrayEntries[pilotIndex - 1]
  }
  
  valueOf() {
    return this.toNumber()
  }
}

export default BAN
window.BANFormat = BANFormat