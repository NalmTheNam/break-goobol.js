import { Decimal } from "./break-goobol.js"

class BANFormat extends Intl.NumberFormat {
  format(value) {
    const options = this.resolvedOptions()
    
    if (options.notation == "compact") {
      const illions = [{
        before36OoM: ["K", "M", "B", "T", "Qa", "Qt", "Sx", "Sp", "Oc", "No", "Dc"],
        before306OoM: ["Vg", "Tg", "Qd", "Qi", "Se", "St", "Og", "Nn", "Ce"]
      }]
      
      const illionPrefixes = ["U", "D", "T", "Qa", "Qt", "Sx", "Sp", "O", "N"]
      
      
    }
    
    const formattedValue = super.format(value)
    return formattedValue
  }
}

export { BANFormat }