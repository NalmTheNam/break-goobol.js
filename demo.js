import BAN from "./break-goobol.js"

const { state, effect, html } = window.BFS.MARKUP
const [number, updateNumber] = state(new BAN(0))

html`
    <h1>break-goobol.js</h1>
    <h2 class="number">${number}</h2>
    <p class="plain-notation-number">Plain number: 0</p>
    ${NumberControlPanel}
`.render(document.getElementById("app"))

function NumberControlPanel() {
  const addNumber = () => {
    updateNumber(num => num.add(1))
  }
  
  const raiseNumber = () => {
    updateNumber(num => num.pow(2))
  }
  
  const raiseNumberTo10 = () => {
    updateNumber(num => num.pow(10))
  }
  
  return html`
    <button onclick="${addNumber}">Add +1 to number</button>
    <button onclick="${raiseNumber}">Raise the number to the power of 2</button>
    <button onclick="${raiseNumberTo10}">Raise the number to the power of 10</button>
  `
}

window.BAN = BAN
window.updateNumber = updateNumber