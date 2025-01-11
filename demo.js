import BAN from "./break-goobol.js"

const { state, effect, html } = window.BFS.MARKUP
const [number, updateNumber] = state(new BAN(0))
const [controlPanelSettings, updateControlPanelSettings] = state({
  locked: false
})

html`
    <h1>break-goobol.js</h1>
    <h2 class="number">${number}</h2>
    <p class="plain-notation-number">Plain number: 0</p>
    ${numberControlPanel()}
    <button onclick=${startLNGI}>Start LNGI</button>
`.render(document.getElementById("app"))

function numberControlPanel() {
  const controlButtons = {
    "Add +1 to number": {
      press: () => updateNumber(num => num.add(1))
    },
    "Add +10 to number": {
      press: () => updateNumber(num => num.add(10))
    },
    "Add +100 to number": {
      press: () => updateNumber(num => num.add(100))
    },
    "Add +1000 to number": {
      press: () => updateNumber(num => num.add(1000))
    },
    "Add 10% to number": {
      press: () => updateNumber(num => num.add(num.mul(0.1)))
    },
    "Multiply number by 2": {
      press: () => updateNumber(num => num.mul(2))
    },
    "Multiply number by 3": {
      press: () => updateNumber(num => num.mul(3))
    },
    "Multiply number by 10": {
      press: () => updateNumber(num => num.mul(10))
    },
    "Raise number to the second power": {
      press: () => updateNumber(num => num.pow(2))
    },
    "Raise number to the third power": {
      press: () => updateNumber(num => num.pow(3))
    },
    "Reset number to 0": {
      press: () => updateNumber(num => new BAN(0))
    },
  }
  
  function renderPanelButtons() {
    return html`
      <div class="control-panel-buttons">
        ${Object.entries(controlButtons).map(([name, button]) => {
          return html`<button onclick=${button.press}>${name}</button>`
        })}
      </div>
    `
  }
  
  return html`
    ${renderPanelButtons()}
  `
}

function startLNGI() {
  updateControlPanelSettings(settings => ({ ...settings, locked: true }))
  setInterval(() => {
    updateNumber(number => number.add(1))
    if (number().gt(50)) updateNumber(number => number.mul(1.1))
  }, 50)
}

window.BAN = BAN
window.updateNumber = updateNumber