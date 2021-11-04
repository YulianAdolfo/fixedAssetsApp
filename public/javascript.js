let addItems = document.getElementById("add-accessories")
let panel = null
let modal = null
addItems.onclick = () => {
    modal.style.display = "block"
}
function create_modal_form (windowDiv) {
    var container = document.createElement("div")
    var header = document.createElement("header")
    var textBoxNameItem = document.createElement("input")
    var textboxDescriptionItem = document.createElement("input")
    var buttonAddItem = document.createElement("button")
    var containerTable = document.createElement("div")
    var buttonClose = document.createElement("div")
    var button = document.createElement("button")
    let tr = document.createElement("tr")
    // creating table
    var tableAddedItem = document.createElement("table")
    for (var i = 0; i < 3; i++) {
        var th = document.createElement("th")
        if (i == 0) {
            th.innerHTML = "Nombre accesorio"
        } else if (i == 1) {
            th.innerHTML = "Descripción"
        } else {
            th.innerHTML = "Quitar"
        }
        tr.appendChild(th)
    }
    tableAddedItem.classList.add("table-style-items")
    tableAddedItem.appendChild(tr)

    textBoxNameItem.type = "text"
    textBoxNameItem.placeholder = "Ingrese nombre del accesorio"
    textboxDescriptionItem.type = "tex"
    textboxDescriptionItem.placeholder = "Ingrese una breve descripción (no obligatorio)"
    buttonAddItem.innerHTML = "Agregar"
    button.innerHTML = "Aceptar"
    container.classList.add("container-add-items")
    buttonClose.classList.add("button-div-close")
    containerTable.classList.add("container-table")
    header.appendChild(textBoxNameItem)
    header.appendChild(textboxDescriptionItem)
    header.appendChild(buttonAddItem)
    container.appendChild(header)
    containerTable.appendChild(tableAddedItem)
    container.appendChild(containerTable)
    buttonClose.appendChild(button)
    container.appendChild(buttonClose)
    windowDiv.appendChild(container)

    windowDiv.style.display = "none"
    buttonAddItem.onclick = () => {
        if (textBoxNameItem.value != "") {
            var trContent = document.createElement("tr")
            var tdName = document.createElement("td")
            var tdDescription = document.createElement("td")
            var tdDelete = document.createElement("td")
            var iconX = document.createElement("i")

            iconX.classList.add("fas", "fa-times")
            iconX.style.color = "red"
            iconX.style.cursor = "pointer"
            tdDelete.appendChild(iconX)
            trContent.appendChild(tdName).innerHTML = textBoxNameItem.value
            trContent.appendChild(tdDescription).innerHTML = textboxDescriptionItem.value
            trContent.appendChild(tdDelete)
            textBoxNameItem.value = ""
            textboxDescriptionItem.value = ""
            tableAddedItem.appendChild(trContent)

            iconX.onclick = (e) => {
                tableAddedItem.removeChild(e.target.parentElement.parentElement)
            }
        }
    }
    button.onclick = () => {
        windowDiv.style.display = "none"
    }
    return windowDiv
}
function panel_window() {
    panel = document.createElement("div")
    panel.classList.add("panel-window")
    document.body.appendChild(panel)
    return panel
}
// it creates the modal just one time
modal = create_modal_form(panel_window())