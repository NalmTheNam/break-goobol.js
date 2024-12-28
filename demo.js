import BAN from "./break-goobol.js"

const { state, effect, html } = window.BFS.MARKUP
const [number, updateNumber] = state(new BAN(0))

const countUp = () => {
    updateNumber(num => num.add(1))
}

// reactive DOM/templates
html`
    <h1>break-goobol.js</h1>
    <h2 class="number">${number}</h2>
    <p class="plain-notation-number">Plain number: 0</p>
    <button onclick="${countUp}">Add +1 to number</button>
`.render(document.getElementById("app"))

function NumberControlPanel() {
  
}

window.number = number