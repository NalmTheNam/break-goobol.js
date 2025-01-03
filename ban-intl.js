class BANFormat extends Intl.NumberFormat {
  #options
  
  constructor(locales, options) {
    super(locales, options)
    this.#options = options
  }
  
  format(value) {
    const formattedValue = super.format(value)
    return formattedValue
  }
}

export { BANFormat }