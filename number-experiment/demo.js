import BAN from "../break-goobol.js"

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
    <button onclick=${startLNGI}>Start LNRI</button>
`.render(document.getElementById("app"))

function numberControlPanel() {
  const controlButtons = {
    "+1": {
      press: () => updateNumber(num => num.add(1))
    },
    "+10": {
      press: () => updateNumber(num => num.add(10))
    },
    "+100": {
      press: () => updateNumber(num => num.add(100))
    },
    "+1000": {
      press: () => updateNumber(num => num.add(1000))
    },
    "+10%": {
      press: () => updateNumber(num => num.add(num.mul(0.1)))
    },
    "x2": {
      press: () => updateNumber(num => num.mul(2))
    },
    "x3": {
      press: () => updateNumber(num => num.mul(3))
    },
    "x10": {
      press: () => updateNumber(num => num.mul(10))
    },
    "^2": {
      press: () => updateNumber(num => num.pow(2))
    },
    "^3": {
      press: () => updateNumber(num => num.pow(3))
    },
    "AC": {
      press: () => updateNumber(num => new BAN(0))
    },
  }
  
  function renderPanelButtons() {
    return html`
      ${Object.entries(controlButtons).map(([name, button]) => {
        return html`<button onclick=${button.press}>${name}</button>`
      })}
    `
  }
  
  return html`
    <h2>Control Panel</h2>
    <div class="control-panel-buttons">
      ${renderPanelButtons()}
    </div>
  `
}

function startLNGI() {
  if (controlPanelSettings().locked) return
  
  updateControlPanelSettings(settings => ({ ...settings, locked: true }))
  setInterval(() => {
    const magnitude = number().getMagnitude()
    
    updateNumber(number => number.add(1))
    if (number().gt(50)) updateNumber(number => number.mul(1.1))
    if (number().gt(1e16)) updateNumber(number => number.mul(1.5 + magnitude instanceof BAN ? 100 : magnitude / 10))
    if (number().gt(new BAN([10, 1000]))) updateNumber(number => number.pow(magnitude.toNumber?.() === Number.POSITIVE_INFINITY ? 1e300 : Math.pow(magnitude, 0.01) + 1))
  }, 50)
}

window.BAN = BAN
window.updateNumber = updateNumber
