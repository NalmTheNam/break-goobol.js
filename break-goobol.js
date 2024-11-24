class BAN {
  constructor(numberOrArray) {
    if (numberOrArray instanceof Array) 
      return this.numberArray = numberOrArray
    
    const number = numberOrArray
    this.numberArray = [number]
  }
}