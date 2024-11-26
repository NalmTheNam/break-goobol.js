const numberText = document.querySelector(".number")
const plainNumberText = document.querySelector(".plain-notation-number")
let numberArray = new BAN(1.01)

const startButton = document.querySelector(".start")

startButton.addEventListener("click", () => {
  setInterval(() => {
    numberText.textContent = numberArray.toString()
    plainNumberText.textContent = `Without scientific notation: ${numberArray.toString({ notation: "plain" })}`
    
    numberArray = numberArray.mul((numberArray.magnitude / 50) + 1.01)
  }, 50)
}, { once: true })