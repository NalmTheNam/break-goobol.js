const { state, effect } = window.BFS.MARKUP

const [count, updateCount] = MARKUP.state(0)

// data driven
MARKUP.effect(() => {
    if (count() > 10) {
        alert('You counted passed 10!')
    }
})

const countUp = () => {
    updateCount((prev) => prev + 1)
}

// reactive DOM/templates
MARKUP.html`
    <p>count: ${count}</p>
    <button type="button" onclick="${countUp}">count up</button>
`.render(document.body)


/*
const numberText = document.querySelector(".number")
const plainNumberText = document.querySelector(".plain-notation-number")
const numberArray = new BAN(0)

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
}*/