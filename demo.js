const numberText = document.querySelector(".number")
const plainNumberText = document.querySelector(".plain-notation-number")
let numberArray = new BAN(0)

const startButton = document.querySelector(".start")

startButton.addEventListener("click", async () => {

}, { once: true })

function render() {
  numberText.textContent = numberArray.toString()
  plainNumberText.textContent = `Plain number: ${numberArray.toString({ notation: "plain" })}`
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function waitUntil(predicate, interval = 100) {
  const poll = resolve => predicate() ? resolve() : setTimeout(() => poll(resolve), interval)
  return new Promise(poll)  
}