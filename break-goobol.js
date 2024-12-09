class BAN {
  static _debugMode = false
  static _verboseArrays = []
  
  static toggleDebugMode() {
    BAN._debugMode = !BAN._debugMode
    
    if (!BAN._debugMode) {
      for (let array of BAN._verboseArrays) {
        // Deproxify the array by replacing the old array with a new array
        array = array.clone()
      }
      
      BAN._verboseArrays = []
    }
    
    console.log("Debug mode turned " + BAN._debugMode ? "on!" : "off!")
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
    
    if (BAN._debugMode) {
      const verboseArray = new Proxy(this, {
        apply(func, thisArg, args) {
          const returnValue = Reflect.apply(...arguments)
          if (func.name === "addDebugLog") return returnValue
          
          array.addDebugLog(`function ${func.name}() called with arguments ${args}`)  
        },
        
        get(array, propName) {
          const property = Reflect.get(...arguments)
        
          if (typeof property === "function" && propName !== "addDebugLog")
            array.addDebugLog(`function ${propName}() accessed`)  
        
          return property
        }
      })
      
      BAN._verboseArrays.push(verboseArray)
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
  
  add(number) {
    if (this.arrayEntries.length === 1) {
      this.arrayEntries[0] += number
      this.normalizeArray()
    } else if (this.arrayEntries.length === 2) {
      const addedMantissa = number / Math.pow(10, this.magnitude)
      this.setMantissa(this.mantissa + addedMantissa)
    }
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
    
    this.addDebugLog("Entry count: " + entryCount)
    
    if (entryCount === 1) {
      const isFirstEntryBAN = firstEntry instanceof BAN
      const isFirstEntryArray = firstEntry instanceof Array
           
      if (firstEntry instanceof BAN) {
        this.addDebugLog("The first entry is a BAN array! Setting the array entries to the first entry's array entries...", { type: "info" })
        
        this.arrayEntries = firstEntry.arrayEntries
        this.normalizeArray()
      
        return
      }
      
      if (firstEntry instanceof Array) {
        this.addDebugLog(`The first entry is an array! 
Nested arrays will be flattened if there is only 1 entry in the array.`, { type: "warn" })
        
        this.arrayEntries = firstEntry
        this.normalizeArray()
      
        return
      }
    }
    
    this.addDebugLog(`Looping through array entries in order to detect nested arrays to convert them into BAN arrays...`, { type: "info" })
    
    for (const entryNumber in this.arrayEntries) {
      const entry = this.arrayEntries[entryNumber]
      
      if (entry instanceof Array) {
        this.addDebugLog(`Entry #${entryNumber} is an array, converting entry into BAN array...`)
        this.arrayEntries[entryNumber] = new BAN(entry)
      }
    }
    
    if (lastEntry === 1 && entryCount > 1) this.arrayEntries.pop()
    
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