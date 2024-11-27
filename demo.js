const numberText = document.querySelector(".number")
const plainNumberText = document.querySelector(".plain-notation-number")
let numberArray = new BAN(0)

const startButton = document.querySelector(".start")
const music = new Audio("https://cdn.glitch.global/4d173a17-a535-4eeb-b5b6-05cb49509181/Heaven%20and%20Hell%20-%20Jeremy%20Blake%20%5B%20ezmp3.cc%20%5D.mp3")

startButton.addEventListener("click", async () => {
  if (music.readyState == HTMLMediaElement.HAVE_ENOUGH_DATA) await waitUntil(() => music.readyState == HTMLMediaElement.HAVE_ENOUGH_DATA)
  music.play()
  
  setInterval(() => {
    numberText.textContent = numberArray.toString()
    plainNumberText.textContent = `Plain number: ${numberArray.toString({ notation: "plain" })}`
    
    numberArray = numberArray.mul((numberArray.magnitude / 50) + 1.01)
  }, 50)
}, { once: true })

function waitUntil(predicate, interval = 100) {
  const poll = resolve => predicate() ? resolve() : setTimeout(() => poll(resolve), interval)
  return new Promise(poll)  
}