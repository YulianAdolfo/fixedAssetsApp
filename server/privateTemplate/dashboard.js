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
setContentTable(30)