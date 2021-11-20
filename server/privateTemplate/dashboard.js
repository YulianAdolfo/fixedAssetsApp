var dasboardContainerTable = document.getElementById("container-request-main")
function getTable() {
    return dasboardContainerTable.children[0]
}
function  getTableTr() {
    return document.createElement("tr")
}
function getTableTd() {
    return document.createElement("td")
}
function getLink() {
    return document.createElement("a")
}
function getIcon() {
    return document.createElement("i")
}
function getParagraph() {
    return document.createElement("p")
}
function getBackgroundPanel() {
    var panel = document.createElement("div")
    panel.classList.add("background-panel-style")
    return panel
}
function setContentTable(amountRequest) {
    var table = getTable()
    for(var i =0; i < amountRequest; i++)  {
        var lineHorizontalTable = getTableTr()
        for(var j =0; j < 4; j++) {
            var content = null
            var contentTD = getTableTd()
            switch(j) {
                case 0:
                    content = getLink()
                    content.href = "#"
                    content.title = "Clic para detalles avanzados"
                    content.innerHTML = "Testing"
                    break;
                case 1:
                    content = getParagraph()
                    content.innerHTML = "0000/00/00"
                    content.style.margin = "0"
                    break;
                case 2:
                    content = getIcon()
                    content.title = "acepto la solicitud"
                    content.classList.add("fas", "fa-check","accept-button")
                    break;
                case 3:
                    content = getIcon()
                    content.title = "rechazo la solicitud"
                    content.classList.add("fas", "fa-times", "refuse-button")
                    break;
            }
            contentTD.appendChild(content)
            lineHorizontalTable.appendChild(contentTD)
            table.appendChild(lineHorizontalTable)
        }
    }
}
function openDetails(nameDevice = "nombre el dispositivo") {
    var mainPanelInformation = document.body.appendChild(getBackgroundPanel())
    var panelInformation = document.createElement("div")
    var panelInformatioHeader = document.createElement("header")
    panelInformation.classList.add("information-container-request")
    panelInformatioHeader.innerHTML = nameDevice
    panelInformation.appendChild(panelInformatioHeader)
    mainPanelInformation.appendChild(panelInformation)
}
var backButton = ()=> {
    var button = document.getElementById("back-button")
    button.onclick = () => {
        document.getElementById("background-panel-style").style.display = "none"
    }
}
//setContentTable(30)
//openDetails()
backButton()