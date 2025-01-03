class BANFormat extends Intl.NumberFormat {
  /*constructor(locales, options) {
    super(locales, options)
  }*/
  
  format(value) {
    let formattedValue = super.format(value)
    return formattedValue
  }
}

export { BANFormat }