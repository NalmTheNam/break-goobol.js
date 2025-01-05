class BANFormat extends Intl.NumberFormat {
  //static BAN
  
  constructor(locales, options) {
    super(locales, options)
  }
  
  format(value) {
    const options = this.resolvedOptions()
    const BAN = BANFormat.BAN
    
    console.log(options.notation)
    
    if (options.notation == "compact") {
      if (typeof value === "number") value = new BAN(value)
      
      const illions = {
        before36OoM: ["K", "M", "B", "T", "Qa", "Qt", "Sx", "Sp", "Oc", "No", "Dc"],
        before306OoM: ["Vg", "Tg", "Qd", "Qi", "Se", "St", "Og", "Nn", "Ce"]
      }
      
      const illionPrefixes = ["U", "D", "T", "Qa", "Qt", "Sx", "Sp", "O", "N"]
      let displayedIllion = ""
      
      if (value.getMagnitude() < 36)
        displayedIllion = illions.before36OoM[Math.floor(value.getMagnitude() / 3) - 1] ?? ""
      
      if (value.arrayEntries.length === 1) 
        return `${value.toNumber() / 1000 ** Math.floor(value.getMagnitude() / 3)} ${displayedIllion}`
    }
    
    const formattedValue = super.format(value)
    return formattedValue
  }
}

export { BANFormat }