let searchParams = new URLSearchParams(window.location.search)
const OWNER_NAME = searchParams.get("owner")
const GET_LIST_API = "https://www.noel-friedrich.de/todo/api/get-list.php"
const ADD_ITEM_API = "https://www.noel-friedrich.de/todo/api/add-item.php"
const EDIT_ITEM_API = "https://www.noel-friedrich.de/todo/api/edit-item.php"
const DELETE_ITEM_API = "https://www.noel-friedrich.de/todo/api/delete-item.php"
const CHECK_ITEM_API = "https://www.noel-friedrich.de/todo/api/check-item.php"
const LIST_CONTAINER = document.getElementById("list-container")
const ADD_BUTTON = document.getElementById("add-button")
const ADD_BUTTON_CONTAINER = document.getElementById("add-button-container")
const TITLE = document.getElementById("title")
const EDIT_BUTTON = document.getElementById("edit-button")
const DELETE_BUTTON = document.getElementById("delete-button")
const LIST_HEADER = document.getElementById("list-header")
const CONTEXT_MENU = document.getElementById("context-menu")
const LOADING = document.getElementById("loading")

TITLE.innerHTML = `ToDo: ${OWNER_NAME}`
LIST_HEADER.innerHTML = TITLE.innerHTML

window.mobileCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check
}

async function httpGetAsync(url, params={}) {
    return new Promise(resolve => {
        let xmlHttp = new XMLHttpRequest()
        xmlHttp.onreadystatechange = function() { 
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                resolve(xmlHttp.responseText)
        }
        xmlHttp.open("GET", url + formatUrlParams(params), true) 
        xmlHttp.send(null)
    })
}

function formatUrlParams(params) {
    return "?" + Object
        .keys(params)
        .map(function(key){
        return key + "=" + encodeURIComponent(params[key])
        })
        .join("&")
}

class List {

    addElement(content, attributes, tag="div", addToList=true) {
        let element = document.createElement(tag)
        element.textContent = content
        for (let attr in attributes)
            element.setAttribute(attr, attributes[attr])
        if (addToList)
            LIST_CONTAINER.insertBefore(element, ADD_BUTTON_CONTAINER)
        return element
    }

    async onCheck(rowId, checked, sendRequest=true) {
        if (sendRequest)
            await httpGetAsync(CHECK_ITEM_API, {item_id: rowId, check_val: (checked ? 1 : 0)})
        if (checked) {
            this.rowElements[rowId].text.style.textDecoration = "#0075ff line-through"
            this.rowElements[rowId].time.style.textDecoration = "#0075ff line-through"
        } else {
            this.rowElements[rowId].text.style.textDecoration = ""
            this.rowElements[rowId].time.style.textDecoration = ""
        }
    }

    addCheckbox(checked, rowId) {
        let container = this.addElement("", {class: "list-item list-item-checkbox-container"})
        let checkbox = this.addElement("", {class: "list-item-checkbox list-item", type: "checkbox"}, "input", false)
        checkbox.checked = checked
        checkbox.onclick = function() {
            this.onCheck(rowId, checkbox.checked)
        }.bind(this)
        container.appendChild(checkbox)
    }

    addRow(textContent, dueTime, done, rowId) {
        this.addCheckbox(done, rowId)
        let textElement = this.addElement(textContent, {class: "list-item list-item-content", item_id: rowId}, "div")
        let timeElement = this.addElement(dueTime, {class: "list-item list-item-due-time", item_id: rowId}, "div")
        this.rowElements[rowId] = {text: textElement, time: timeElement}
        this.onCheck(rowId, done, false)
    }

    activateEdit(rowId) {
        if (this.editing != false) return
        this.editing = rowId
        let textEdit = this.addElement("", {class: "list-item list-item-edit-text", type: "text"}, "input", false)
        textEdit.value = this.rowElements[rowId].text.textContent
        textEdit.setAttribute("item_id", rowId)
        textEdit.id = "edit-text"
        LIST_CONTAINER.insertBefore(textEdit, this.rowElements[rowId].text)
        this.rowElements[rowId].text.style.display = "none"
        textEdit.focus()
        textEdit.onblur = this.finishEdit.bind(this)
        textEdit.onkeydown = function(event) {
            if (event.key == "Enter")
                this.finishEdit()
        }.bind(this)
    }

    async finishEdit() {
        if (this.editing == false) return
        let rowId = this.editing
        this.editing = false
        this.textEdit = document.getElementById("edit-text")
        this.textEdit.remove()
        this.rowElements[rowId].text.style.display = ""
        this.rowElements[rowId].text.textContent = this.textEdit.value
        await httpGetAsync(EDIT_ITEM_API, {id: rowId, text_content: this.textEdit.value})
    }

    constructor(json) {
        this.json = json
        this.rowElements = Object()
        this.rows = Array()
        this.editing = false
        for (let item of json) {
            let row = {
                id: item.id,
                dueTime: item.due_time,
                textContent: item.text_content,
                done: item.done
            }
            this.rows.push(row)
            this.addRow(row.textContent, row.dueTime, row.done == 1, row.id)
        }
    }

}

class MobileList {

    addElement(content, attributes, tag="div", addToList=false) {
        let element = document.createElement(tag)
        element.textContent = content
        for (let attr in attributes)
            element.setAttribute(attr, attributes[attr])
        if (addToList)
            LIST_CONTAINER.insertBefore(element, ADD_BUTTON_CONTAINER)
        return element
    }

    async onCheck(rowId, checked, sendRequest=true) {
        if (sendRequest)
            await httpGetAsync(CHECK_ITEM_API, {item_id: rowId, check_val: (checked ? 1 : 0)})
        if (checked) {
            this.rowElements[rowId].text.style.textDecoration = "#0075ff line-through"
            this.rowElements[rowId].time.style.textDecoration = "#0075ff line-through"
        } else {
            this.rowElements[rowId].text.style.textDecoration = ""
            this.rowElements[rowId].time.style.textDecoration = ""
        }
    }

    addCheckbox(checked, rowId) {
        let container = this.addElement("", {class: "mobile-list-item-checkbox-container"})
        let checkbox = this.addElement("", {class: "mobile-list-item-checkbox", type: "checkbox"}, "input")
        checkbox.checked = checked
        checkbox.setAttribute("item_id", rowId)
        checkbox.onclick = function() {
            this.onCheck(rowId, checkbox.checked)
        }.bind(this)
        container.appendChild(checkbox)
        return container
    }

    addRow(textContent, dueTime, done, rowId) {
        let checkBoxContainer = this.addCheckbox(done, rowId)
        let textElement = this.addElement(textContent, {class: "mobile-list-item-content", item_id: rowId}, "div")
        let timeElement = this.addElement(dueTime, {class: "mobile-list-item-due-time", item_id: rowId}, "div")
        let rowContainer = this.addElement("", {class: "mobile-list-item"}, "div", true)
        let subContainer = this.addElement("", {class: "mobile-list-item-sub"}, "div")

        rowContainer.appendChild(textElement)
        if (dueTime != "-")
            rowContainer.appendChild(timeElement)
        else
            rowContainer.style.gridTemplateColumns = "1fr"
        rowContainer.appendChild(checkBoxContainer)
        this.rowElements[rowId] = {text: textElement, time: timeElement, container: rowContainer}
        this.onCheck(rowId, done, false)
    }

    activateEdit(rowId) {
        if (this.editing != false) return
        this.editing = rowId
        let textEdit = this.addElement("", {class: "mobile-list-item-edit-text", type: "text"}, "input", false)
        textEdit.value = this.rowElements[rowId].text.textContent
        textEdit.setAttribute("item_id", rowId)
        textEdit.id = "edit-text"
        this.rowElements[rowId].container.appendChild(textEdit)
        this.rowElements[rowId].text.style.display = "none"
        textEdit.focus()
        textEdit.onblur = this.finishEdit.bind(this)
        textEdit.onkeydown = function(event) {
            if (event.key == "Enter")
                this.finishEdit()
        }.bind(this)
    }

    async finishEdit() {
        if (this.editing == false) return
        let rowId = this.editing
        this.editing = false
        this.textEdit = document.getElementById("edit-text")
        this.textEdit.remove()
        this.rowElements[rowId].text.style.display = ""
        this.rowElements[rowId].text.textContent = this.textEdit.value
        await httpGetAsync(EDIT_ITEM_API, {id: rowId, text_content: this.textEdit.value})
    }

    constructor(json) {
        this.json = json
        this.rowElements = Object()
        this.rows = Array()
        this.editing = false
        for (let item of json) {
            let row = {
                id: item.id,
                dueTime: item.due_time,
                textContent: item.text_content,
                done: item.done
            }
            this.rows.push(row)
            this.addRow(row.textContent, row.dueTime, row.done == 1, row.id)
        }

        LIST_CONTAINER.classList.add("mobile")
        LIST_HEADER.classList.add("mobile")
        ADD_BUTTON.classList.add("mobile")
        CONTEXT_MENU.classList.add("mobile")
    }

}

class AddItemPopup {

    makeElement(tag, attributes, content) {
        let element = document.createElement(tag)
        for (let attr in attributes)
            element.setAttribute(attr, attributes[attr])
        if (content)
            element.textContent = content
        return element
    }

    delete() {
        document.body.removeChild(this.body)
        activePopup = null
    }

    async submit() {
        let text = this.textInput.value
        let dueTime = "-"
        if (this.dueTimeInput.value) {
            dueTime = new Date(this.dueTimeInput.value)
            dueTime = `${dueTime.getDate()}.${dueTime.getMonth() + 1}.${dueTime.getFullYear()}`
        }
        if (text.length < 2) {
            alert("Bitte gib einen gültigen Text ein")
            return
        }
        console.log(text, dueTime)
        this.delete()
        await httpGetAsync(ADD_ITEM_API, {text_content: text, due_time: dueTime, owner_name: OWNER_NAME})
        window.location.reload()
    }

    constructor() {
        this.body = this.makeElement("div", {class: "popup"})
        this.body.appendChild(this.makeElement("h1", {}, "Neues ToDo"))
        this.textInput = this.makeElement("input", {class: "popup-input", type: "text", placeholder: "Text"})
        this.dueTimeInput = this.makeElement("input", {class: "popup-input", type: "date", placeholder: "Bis"})
        this.button = this.makeElement("button", {class: "popup-button add-button"}, "Hinzufügen")
        this.x = this.makeElement("button", {class: "close-button"}, "x")

        if (window.mobileCheck())
            this.body.classList.add("mobile")

        this.body.appendChild(this.x)
        this.body.appendChild(this.textInput)
        this.body.appendChild(this.dueTimeInput)
        this.body.appendChild(this.button)
        document.body.appendChild(this.body)

        this.textInput.onkeydown = async function(e) {
            if (e.key == "Enter")
                await this.submit()
        }.bind(this)

        this.button.addEventListener("click", () => this.submit())
        this.x.addEventListener("click", () => this.delete())

        this.textInput.focus()
    }
}

let list = null

let activePopup = null

ADD_BUTTON.addEventListener("click", event => {
    if (!activePopup)
        activePopup = new AddItemPopup()
})

async function main() {
    let jsonStr = await httpGetAsync(GET_LIST_API, {owner_name: OWNER_NAME})
    LOADING.style.display = "none"
    if (window.mobileCheck())
        list = new MobileList(JSON.parse(jsonStr))
    else
        list = new List(JSON.parse(jsonStr))
}

main()

document.body.addEventListener("click", function(event) {
    if (!CONTEXT_MENU.classList.contains("hidden"))
        CONTEXT_MENU.classList.add("hidden")
})

let LAST_CONTEXT_TARGET_ID = null

document.body.oncontextmenu = function(event) {
    let target = event.target
    if (target.hasAttribute("item_id")) {
        CONTEXT_MENU.classList.remove("hidden")
        CONTEXT_MENU.style.left = event.clientX + "px"
        CONTEXT_MENU.style.top = (event.clientY + document.getElementsByTagName("html")[0].scrollTop) + "px"
        LAST_CONTEXT_TARGET_ID = target.getAttribute("item_id")
        event.preventDefault()
        if (window.mobileCheck()) {
            CONTEXT_MENU.style.left = (event.clientX - CONTEXT_MENU.clientWidth / 2) + "px"
            CONTEXT_MENU.style.top = (event.clientY + document.getElementsByTagName("html")[0].scrollTop - CONTEXT_MENU.clientHeight / 2) + "px"
        }
    }
}

EDIT_BUTTON.onclick = event => {
    if (LAST_CONTEXT_TARGET_ID == null || list.editing != false) return
    list.activateEdit(LAST_CONTEXT_TARGET_ID)
}

DELETE_BUTTON.onclick = async event => {
    if (LAST_CONTEXT_TARGET_ID == null) return
    if (confirm("Willst du den Eintrag wirklich löschen?")) {
        await httpGetAsync(DELETE_ITEM_API, {id: LAST_CONTEXT_TARGET_ID})
        window.location.reload()
    }
}

if (!OWNER_NAME) {
    window.location.href = "choose"
}

document.body.addEventListener("keydown", event => {
    if (event.key == "+") {
        event.preventDefault()
        ADD_BUTTON.click()
    } else if (event.key == "Escape") {
        if (activePopup) {
            activePopup.delete()
        }
    }
})