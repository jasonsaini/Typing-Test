const QUOTE_API_URL = "https://api.quotable.io/random"

const MAX_ARR_DIFF = 3;

const textDisplayElement = document.getElementById('textDisplay')
const textInputElement = document.getElementById('textInput')
const wordCounterElement = document.getElementById('wordCounter')
const startButton = document.getElementById('startButton')

let seconds  = 0
let startTime = 0
let endTime = 0
let started = false
let numWords = 0
let correct = true

wpmVals = []



// get random quote from the API
function getRandomQuote(){
    return fetch(QUOTE_API_URL)
    .then(response => response.json())
    .then(data => data.content)
}


// render quote in html
async function renderQuote(){
    const quote = await getRandomQuote()
    textDisplayElement.innerHTML = ''
    numWords = quote.split(' ').length
    quote.split('').forEach(character => {
        const charSpan = document.createElement('span')
        charSpan.innerText = character
        textDisplayElement.appendChild(charSpan)
    })
    textInputElement.value = ''
    startTime = Date.now()
    enforceTextareaFocus()
}

// processes user input and compares it to each letter in the quote
function processText(){

    // collect quote and user input as arrays
    const textArr = textDisplayElement.querySelectorAll('span')
    const inputArr = textInputElement.value.split('')

    // flag to check each letter's correctness
    correct = true
    textArr.forEach((charSpan, index) => {
        const character = inputArr[index]
        // if there are no characters, do not style the text
        if (character == null){
            charSpan.classList.remove('correct')
            charSpan.classList.remove('incorrect')
            correct = false
        // style any correct input
        } else if (character === charSpan.innerText){
            charSpan.classList.add('correct')
            charSpan.classList.remove('incorrect')
        // style any incorrect input
        } else {
            charSpan.classList.remove('correct')
            charSpan.classList.add('incorrect')
            correct = false
        }
})
    // end timer if the user has finished typing
    if(correct) { 
        endTime = Date.now()
        // convert time to seconds-> minutes then calculate WPM
        seconds = (endTime - startTime) / 1000 
        let curWPM = (numWords / (seconds/60)).toFixed(0)
        wordCounterElement.innerHTML = "Previous WPM: " + curWPM
        
        // add wpms to array to get averages
        wpmVals.push(curWPM)

        // render a new quote
        renderQuote()

        // show users avg wpm
        alertWPM()

    }
    enforceTextareaFocus()
}

// show average WPM on completion
function alertWPM(){

    // only show if user has completed passage
    if(textInputElement.length - textDisplayElement.length > MAX_ARR_DIFF){
        return;
    }

     // calculate avg wpm
    let avgWpm = 0;
    if(wpmVals.length == 1){
        avgWpm =  wpmVals[0]
    }
    else {
        total = 0
        for(var i = 0; i < wpmVals.length; i++){
            total += Number(wpmVals[i]);
        }
        avgWpm = (total / wpmVals.length).toFixed(0)
    }
    
    alert("Your current average is " + avgWpm + " words per minute! Click OK to keep going.")
    enforceTextareaFocus()
}


function enforceTextareaFocus()
{
    const activeElement = document.activeElement
    if(textInputElement != activeElement){
        textInputElement.focus()
    }
    else{
        return
    }
}



//add event listener for start button
startButton.addEventListener("click", 
renderQuote)

document.body.addEventListener('click', enforceTextareaFocus, true);

// Event listener for user input
if(textInputElement){
    textInputElement.focus()
    textInputElement.addEventListener('input', () => {
        processText()
    })
    textDisplayElement.addEventListener('click', enforceTextareaFocus)
}