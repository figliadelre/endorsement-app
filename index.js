// javascript
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-endorsements-cf0a1-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementsInDB = ref(database, "endorsementList")

const endorsementInputFieldEl = document.getElementById("endorsement-input")
const endorsementFromInputEl = document.getElementById("from-field")
const endorsementToInputEl = document.getElementById("to-field")
const publishButtonEl = document.getElementById("publish-btn")
const endorsementsListEl = document.getElementById("endorsements")

publishButtonEl.addEventListener ("click", function() {
    const fromVal = document.getElementById("from-field").value
    const toVal = document.getElementById("to-field").value
    const messageVal = document.getElementById("endorsement-input").value

    const newEndorsement = {
        from: fromVal,
        to: toVal,
        message: messageVal
    }

    push(endorsementsInDB, newEndorsement)
    clearInputFields()
})

function clearInputFields(){
    endorsementFromInputEl.value = ""
    endorsementToInputEl.value = ""
    endorsementInputFieldEl.value = ""
}

function clearEndorsementListEl() {
    endorsementsListEl.innerHTML = ""
}

onValue (endorsementsInDB, function(snapshot) {
    if (snapshot.exists()) {
        clearEndorsementListEl()
        const itemsArray = Object.values(snapshot.val())

        for (let i = 0; i < itemsArray.length; i++) {
            const item = itemsArray[i]
            const articleEl = document.createElement("article")
            const headerEl = document.createElement("header")
            const messageEl = document.createElement("p")
            const footerEl = document.createElement("footer")
            headerEl.textContent = `To ${item.to}`
            messageEl.textContent = item.message
            footerEl.textContent = `From ${item.from}`
            articleEl.appendChild(headerEl)
            articleEl.appendChild(messageEl)
            articleEl.appendChild(footerEl)
            endorsementsListEl.appendChild(articleEl)
        }
        
    } else {
        endorsementsListEl.innerHTML = "Be the first to cheer another on!"
    }
})