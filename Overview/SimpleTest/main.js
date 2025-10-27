


function addElement() {

    let lInput = document.createElement("input")
    lInput.id = "leftInput"
    lInput.style.width = "100px"
    lInput.style.height = "15px"

    let addOpText = document.createElement("span")
    addOpText.innerText = " + "

    let rInput = document.createElement("input")
    rInput.id = "rightInput"
    rInput.style.width = "100px"
    rInput.style.height = "15px"

    let equalOpText = document.createElement("span")
    equalOpText.innerText = " = "

    let result = document.createElement("span")
    result.id = "resultSpan"

    let calcDiv = document.createElement("div")
    calcDiv.id = "calcDiv"

    calcDiv.append(lInput)
    calcDiv.append(addOpText)
    calcDiv.append(rInput)
    calcDiv.append(equalOpText)
    calcDiv.append(result)

    

    let currentDiv = document.querySelector('div[style*="margin-top"]') 
    if (currentDiv) {
        currentDiv.prepend(calcDiv)
    }

}


function doCalcButton() {
   const btn =  document.querySelector('.btn')
    btn.addEventListener('click', () => {
        let leftValue = parseFloat(document.getElementById("leftInput").value)
        let rightValue = parseFloat(document.getElementById("rightInput").value)
        let resultSpan = document.getElementById("resultSpan")
        if (!isNaN(leftValue) && !isNaN(rightValue)) {
            let sum = leftValue + rightValue
            resultSpan.innerText = sum.toString()
        } else {
            resultSpan.innerText = "Invalid input"
        }           

    })
}

addElement()
doCalcButton()