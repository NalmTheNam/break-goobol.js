const numberText = document.querySelector(".number")
let numberArray = new BAN(1.01)

const startButton = document.querySelector(".start")

startButton.addEventListener("click", () => {
  setInterval(() => {
    numberText.textContent = numberArray.toString()
    
    if (numberArray.numberArray[1] > 20)
      numberArray = numberArray.mul((numberArray.numberArray[1] / 50) + 1)
    else
      numberArray = numberArray.mul((3 / 50) + 1)
  }, 50)
}, { once: true })