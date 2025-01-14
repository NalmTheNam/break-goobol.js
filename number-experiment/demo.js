class State extends EventTarget {
  constructor(value) {
    super()
    this.value = value
  }
  
  update(value) {
    const updatedValue = typeof value == "function" ? value(this.value) : value
    this.value = updatedValue
    
    const updateEvent = new CustomEvent("statechange", { detail: this.value })
    this.dispatchEvent(updateEvent)
  }
  
  valueOf() {
    return this.value
  }
}

import BAN from "../break-goobol.js"
const number = new State(new BAN(0))

/*
function renderControlPanel() {
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
    "x^2": {
      press: () => updateNumber(num => num.pow(2))
    },
    "x^3": {
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
    <div class="control-panel-buttons">
      ${renderPanelButtons()}
    </div>
  `
}
*/

/*
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
*/

function setupCalculator() {
  const calculator = document.querySelector(".calculator")
  
  for (let i = 0; i <= 9; i++) {
    const button = document.createElement("button")
    
    button.classList.add("number-button")
    button.textContent = i
    
    calculator.appendChild(button)
  }
  
  const actionButtons = {
    "+": () => {}, 
    "-": () => {}, 
    "*": () => {}, 
    "/": () => {}
  }
  
  for (const [actionName, action] of Object.entries(actionButtons)) {
    const button = document.createElement("button")
    
    button.classList.add("action-button")
    button.textContent = actionName
    
    calculator.appendChild(button)
  }
}

number.addEventListener("statechange", ({ detail: value }) => {
  document.querySelector(".number").textContent = value
})

setInterval(() => number.update(number => number.add(1)), 50)

setupCalculator()

window.BAN = BAN
window.number = number