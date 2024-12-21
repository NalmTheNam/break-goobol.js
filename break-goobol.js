class BAN {
  static debugMode = false
  static getDebugHandler() {
    return {
      get(array, propName) {
        const property = Reflect.get(...arguments)
        
        if (typeof property === "function" && propName !== "addDebugLog") {
          return new Proxy(property, {
            apply(func, thisArg, args) {
              array.addDebugLog(`function ${func.name}() called with arguments "${args}"`) 
              return Reflect.apply(...arguments)
            },
          })
        }
        
        return property
      }
    }
  }
  
  static PreciseNumber = class {
    digits = []
    
    constructor(value) {
      if (typeof value === "number") value = value.toString()
      
      const digits = value.split(".")
      const integerDigits = digits[0].split("").reverse().join("") // Reverse the integer digits so that the largest integer digit can be placed into the digits array first.
      const decimalDigits = digits[1]
      
      const decimalDigitsLength = decimalDigits?.length ?? 0
      
      for (let i = integerDigits.length - 1; i >= decimalDigitsLength; i--) {
        const stringDigit = integerDigits[i] ?? decimalDigits[-i - 1]
        const digit = Number(stringDigit)
        
        this.digits.push([digit, i])
      }
    }
    
    add(value) {
      const preciseNumber = new 
      if (typeof value === "number") value = value.toString()
      
      const digits = value.split(".")
      const integerDigits = digits[0].split("").reverse().join("")
      const decimalDigits = digits[1]
      
      const decimalDigitsLength = decimalDigits?.length ?? 0
            
      for (let i = integerDigits.length - 1; i >= decimalDigitsLength; i--) {
        const stringDigit = integerDigits[i] ?? decimalDigits[-i - 1]
        const digit = Number(stringDigit)
        
        const editedDigit = this.digits.find(([_digit, idx]) => idx === i)
        editedDigit[0] += digit
      }
    }
  }
  
  // Cloning info. This information is mostly used for debugging purposes!
  _cloned = false
  _clonedFrom = undefined
  
  debugLogs = []
  debugName = undefined
  id = Math.random()
  
  arrayEntries = []
  mantissa = 1
  sign = 0
  
  constructor(value = 0, options) {
    this.debugName = options?.debugName
    
    this._cloned = options?.cloned ?? false
    this._clonedFrom = options?.clonedFrom
    
    if (this._cloned) {
      this.addDebugLog(`Note: This array is a clone from another array with ID ${this._clonedFrom}.`, { type: "info" })
    } else {
      if (typeof value == "string") {
        this.setupArrayFromString(value)
      } else if (typeof value == "number") {
        this.arrayEntries[0] = value
      } else if (value instanceof Array) {
        this.arrayEntries = value
      }  else if (value instanceof BAN) {
        this.arrayEntries = value.arrayEntries
        this.mantissa = value.mantissa
      }
    
      this.normalizeMantissa()
      this.normalizeArray()
    }
    
    if (BAN.debugMode) {
      const verboseArray = new Proxy(this, BAN.getDebugHandler())
      return verboseArray
    }
    
    return this
  }
  
  addDebugLog(message, options) {
    const log = {
      type: options?.type ?? "debug", 
      message, 
      date: new Date()
    }
    
    this.debugLogs.push(log)
  }
  
  printDebugLogs() {
    console.groupCollapsed(`BAN array debug logs | ID: "${this.debugName ?? this.id}"${this._cloned ? " (Cloned)" : ""}`)
    
    for (const log of this.debugLogs) {
      console[log.type](`[${log.date}] ${log.message}`)
    }
    
    console.groupEnd()
  }
  
  clone() {
    const clonedArray = new BAN("clone-mode", {
      debugName: this.debugName,
      cloned: true,
      clonedFrom: this.debugName ?? this.id
    })
    
    this.addDebugLog("Cloning this array's contents to array ID #" + clonedArray.id, { type: "info" })
    
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
  
  add(value) {
    if (value instanceof BAN) {
      const number = value.toNumber()
      if (number !== Number.POSITIVE_INFINITY && !Number.isNaN(number))
        value = number
    }
      
    if (typeof value == "string") {
      const parsedNumber = Number(value)
      
      if (parsedNumber === Number.POSITIVE_INFINITY || Number.isNaN(parsedNumber))
        value = new BAN(value) 
      else 
        value = parsedNumber
    }
    
    if (this.arrayEntries.length === 1) {
      if (typeof value === "number") this.arrayEntries[0] += value
      else if (value instanceof BAN) {
        this.arrayEntries[0] = 10
        this.arrayEntries[1] = value.arrayEntries[1]
        
        this.setMantissa(value.mantissa)
      }
    } else if (this.arrayEntries.length === 2) {
      if (typeof value == "number") {
        const addedMantissa = value / Math.pow(10, this.magnitude)
        this.setMantissa(this.mantissa + addedMantissa)
      }
    }
    
    this.normalizeArray()
    return this
  }
  
  added(number) {
    const clonedArray = this.clone()
    clonedArray.add(number)
    
    return clonedArray
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
    if (this.mantissa === 0)
      this.mantissa = 1
    
    if (this.mantissa < 1 || this.mantissa >= 10) {
      const mantissaOom = Math.floor(Math.log10(this.mantissa))
      
      this.arrayEntries[1] += mantissaOom
      this.mantissa /= 10 ** mantissaOom
    }
  }
  
  setMantissav2() {
    
  }
  
  getMantissav2() {
    if (this.arrayEntries.length === 1) return this.numberArray[0] / Math.pow(10, this.getMagnitude())
    
    if (this.arrayEntries.length === 2) {
      const mantissa = this.getMagnitude()
    }
  }
  
  normalizeMantissav2() {
    
  }
  
  normalizeArray() {
    this.addDebugLog("Entry count: " + this.arrayEntries.length)
    this.addDebugLog(`[Normalizer] Looping through array entries in order to normalize them!`, { type: "info" })
    
    if (this.arrayEntries.length === 1)
      return this.normalizeFirstEntry()
    
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
  
  normalizeFirstEntry() {
    const firstEntry = this.arrayEntries[0]
    
    if (firstEntry instanceof BAN) {
      this.addDebugLog("The first entry is a BAN array! Setting the array entries to the first entry's array entries...", { type: "info" })
        
      this.arrayEntries = firstEntry.arrayEntries
      this.normalizeArray()
      
      return
    }
      
    if (firstEntry instanceof Array) {
      this.addDebugLog(`The first entry is an array! 
Nested arrays will be flattened if there is only 1 entry in the array.`, { type: "warn" })
        
      this.arrayEntries = entry
      this.normalizeArray()
      
      return
    }  
    
    if (firstEntry > Number.MAX_SAFE_INTEGER) {
      const magnitude = Math.floor(Math.log10(firstEntry))
      const mantissa = firstEntry / Math.pow(10, magnitude)
        
      this.setMantissa(mantissa)
        
      this.arrayEntries[0] = 10
      this.arrayEntries[1] = magnitude
    }
  }
  
  getNormalizedArray() {
    const normalizedArray = this.clone()
    normalizedArray.normalizeArray()
    
    return normalizedArray
  }
  
  setupArrayFromString(string) {
    if (typeof string !== "string") return
    
    this.addDebugLog("Setting up array from string...", { type: "info" })
    
    const parsedNumber = Number(string)
    if (parsedNumber !== Number.POSITIVE_INFINITY && !Number.isNaN(parsedNumber)) {
      this.arrayEntries = [parsedNumber]
      return
    }
      
    const numberHasENotation = string.includes("e")
    if (!numberHasENotation) throw new Error("BAN Error: The parsed number is either infinite or not a number. Parsed number: " + parsedNumber)
    
    const [mantissa, ...magnitudeTowers] = string.split("e")
    const magnitude = magnitudeTowers.join("e")
    
    const parsedMantissa = Number(mantissa)
    let parsedMagnitude = Number(magnitude)
    
    if (parsedMagnitude === Number.POSITIVE_INFINITY || Number.isNaN(parsedMagnitude))
      parsedMagnitude = new BAN(magnitude)
    
    this.setMantissa(parsedMantissa)
    
    this.arrayEntries[0] = 10
    this.arrayEntries[1] = parsedMagnitude
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
    
    newArray.setMantissa(parsedMantissa)
    newArray.arrayEntries[1] = parsedMagnitude
    
    return newArray
  }
  
  get magnitude() {
    return Math.floor(this.arrayEntries[1]) ?? Math.floor(Math.log10(this.toNumber()))
  }
  
  getMagnitude() {
    if (this.arrayEntries.length === 1) return Math.floor(Math.log10(this.toNumber()))
    
    let magnitude = this.arrayEntries[1]
    if (magnitude instanceof BAN) 
      magnitude = magnitude.toNumber()
    
    return Math.floor(magnitude)
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
    if (this.arrayEntries.length === 1) return this.arrayEntries[0]
    return Math.pow(this.arrayEntries[0], this.arrayEntries[1]) * this.mantissa
  }
  
  valueOf() {
    return this.toNumber()
  }
}