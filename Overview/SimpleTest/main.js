(function() {

    const mainDiv = document.querySelector('.main')
    const btn = document.querySelector('.btn')

    if (!mainDiv || !btn) {
        alert("error")
        return
    }

    function createUI() {

       const lInput =  document.createElement("input")
       const rInput =  document.createElement("input")
       const resultSpan = document.createElement("span")
       const addOpText = document.createElement("span")
       const equalOpText = document.createElement("span")

        lInput.id = "leftInput"
        lInput.style.width = "100px"
        lInput.style.height = "15px"

        addOpText.textContent = " + "

        rInput.id = "rightInput"
        rInput.style.width = "100px"
        rInput.style.height = "15px"

        equalOpText.textContent = " = "
        resultSpan.id = "resultSpan"


        // [lInput,rInput].forEach(inp => inp.addEventListener('keydown', e => {
        //     if (e.key === 'Enter') {
        //         btn.click()
        //     }
        // }))



        mainDiv.append(lInput,addOpText,rInput,equalOpText,resultSpan)
    }

    function bindClickEvent() {


        btn.addEventListener('click', () => {
            const lValue = parseFloat(document.getElementById("leftInput").value.trim())
            const rValue = parseFloat(document.getElementById("rightInput").value.trim())

            const resultSpan = document.getElementById("resultSpan")

            if (Number.isFinite(lValue) && Number.isFinite(parseFloat(rValue))) 
                resultSpan.textContent = (lValue + rValue).toString()
            else 
                resultSpan.textContent = "Invalid input"

        })

    }

    createUI()
    bindClickEvent();

})()

