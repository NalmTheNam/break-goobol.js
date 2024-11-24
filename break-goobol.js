class BAN {
  constructor(numberOrArray) {
    if (numberOrArray instanceof Array) {
      this.numberArray = numberOrArray
      
      // Rule 2 of BAN: If the last entry is 1, it can be removed
      
      /*
      const entryCount = this.numberArray.length - 1
      
      const lastEntry = this.numberArray[entryCount]
      if (lastEntry === 1) this.numberArray.pop()
      */
      
      return
    }
    
    const number = numberOrArray
    this.numberArray = [number]
  }
  
  toString() {
    const entryCount = this.numberArray.length
    
    this.numberArray
  }
}