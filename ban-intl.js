class BANFormat extends Intl.NumberFormat {
  constructor(locales, options) {
    super(locales, options)
    if (!options.BAN) throw new Error("This extension of NumberFormat must have a BAN class")
    
    const resolvedOptions = this.resolvedOptions()
    this.resolvedOptions = () => {
      return {
        resolvedOptions,
        BAN: options.BAN
      }
    }
  }
  
  format(value) {
    const options = this.resolvedOptions()
    const BAN = options.BAN
    
    if (options.notation == "compact") {
      if (typeof value === "number") value = new BAN(value)
      
      const illions = [{
        before36OoM: ["K", "M", "B", "T", "Qa", "Qt", "Sx", "Sp", "Oc", "No", "Dc"],
        before306OoM: ["Vg", "Tg", "Qd", "Qi", "Se", "St", "Og", "Nn", "Ce"]
      }]
      
      const illionPrefixes = ["U", "D", "T", "Qa", "Qt", "Sx", "Sp", "O", "N"]
      let displayedIllion = ""
      
      if (value.getMagnitude() < 36) {
        displayedIllion = illions.before36OoM[Math.floor(value.getMagnitude() / 3)]
      }
      
      if (value.arrayEntries.length === 0) return value.toNumber() / 10 ** Math.floor(value.getMagnitude() / 3)
    }
    
    const formattedValue = super.format(value)
    return formattedValue
  }
}

export { BANFormat }