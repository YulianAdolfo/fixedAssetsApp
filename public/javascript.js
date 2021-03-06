let addItems = document.getElementById("add-accessories")
let sendRequestButton = document.getElementById("button-send-request")
let selectCampusAssetEmit = document.getElementById("select-campus-asset")
let selectPlaceAssetEmit = document.getElementById("select-area-campus-asset")
let selectCampusRecep = document.getElementById("select-campus-asset-r")
let selectAreaRecep = document.getElementById("select-area-campus-asset-r")
let selectReasonChange = document.getElementById("select-reason-asset")

let addedItemsList = []
let panel = null
let modal = null
const ADDRESS_SERVER = "http://172.16.1.23:5200/"
const USER_NAME = document.getElementById("user-name-td").textContent
addItems.onclick = () => {
    modal.style.display = "block"
}
selectCampusAssetEmit.onchange = (e) => {
    dataFromAreasCampus(e.target.value, selectPlaceAssetEmit)
}
selectCampusRecep.onchange = (e) => {
    dataFromAreasCampus(e.target.value, selectAreaRecep)
}
async function dataFromAreasCampus(campus, selectElement) {
    switch (campus) {
        case "0":
            removeItemsList(selectElement)
            break;
        case "1":
            retrievingDataProgress()
            var content = await getAreas("main-areas")
            removeItemsList(selectElement)
            appendItemsToList(selectElement, content)
            removeLastElementApp()
            break;
        case "2":
            retrievingDataProgress()
            var content = await getAreas("specialists-areas")
            removeItemsList(selectElement)
            appendItemsToList(selectElement, content)
            removeLastElementApp()
            break;
        case "3s":
            var content = await getAreas("reason-change")
            appendReasons(content, selectReasonChange)
            break;
    }
    function getAreas(URL) {
        // requesting the areas dependig of campus
        return new Promise((resolve, reject) => {
            fetch(ADDRESS_SERVER + URL, {
                method: "GET",
                headers: {
                    'content-type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => resolve(data))
                .catch((error) => reject(error))
        })
    }

}
function appendItemsToList(selectElement, dataInJson, d) {
    for (var i = 0; i < dataInJson.length; i++) {
        var data = JSON.parse(dataInJson[i])
        var opt = document.createElement("option")
        opt.innerHTML = data.PLACE
        selectElement.appendChild(opt)
    }
}
function removeItemsList(selectElement) {
    while (selectElement.children.length > 1) {
        selectElement.removeChild(selectElement.lastChild)
    }
}
function create_modal_form(windowDiv) {
    var container = document.createElement("div")
    var header = document.createElement("header")
    var textBoxNameItem = document.createElement("input")
    var textboxDescriptionItem = document.createElement("input")
    var buttonAddItem = document.createElement("button")
    var containerTable = document.createElement("div")
    var button = document.createElement("button")
    let tr = document.createElement("tr")
    // creating table
    var tableAddedItem = document.createElement("table")
    tableAddedItem.id = "table-of-items"
    for (var i = 0; i < 3; i++) {
        var th = document.createElement("th")
        if (i == 0) {
            th.innerHTML = "Nombre accesorio"
        } else if (i == 1) {
            th.innerHTML = "Descripci??n"
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
    textboxDescriptionItem.placeholder = "Ingrese una breve descripci??n (no obligatorio)"
    buttonAddItem.innerHTML = "Agregar"
    button.innerHTML = "Aceptar"
    container.classList.add("container-add-items")
    containerTable.classList.add("container-table")
    header.appendChild(textBoxNameItem)
    header.appendChild(textboxDescriptionItem)
    header.appendChild(buttonAddItem)
    containerTable.appendChild(tableAddedItem)
    container.appendChild(containerTable)
    header.appendChild(button)
    container.appendChild(header)
    windowDiv.appendChild(container)

    windowDiv.style.display = "none"
    buttonAddItem.onclick = () => {
        if (textBoxNameItem.value != "") {
            if (addedItemsList.length < 15) {
                var trContent = document.createElement("tr")
                var tdName = document.createElement("td")
                var tdDescription = document.createElement("td")
                var tdDelete = document.createElement("td")
                var iconX = document.createElement("i")

                iconX.classList.add("fas", "fa-times")
                iconX.style.color = "red"
                iconX.style.cursor = "pointer"
                iconX.style.fontSize = "18px"
                iconX.style.fontWeight = "bold"
                let nItem = textBoxNameItem.value
                let dItem = textboxDescriptionItem.value
                tdDelete.appendChild(iconX)
                trContent.appendChild(tdName).innerHTML = nItem
                trContent.appendChild(tdDescription).innerHTML = dItem
                trContent.appendChild(tdDelete)
                textBoxNameItem.value = ""
                textboxDescriptionItem.value = ""
                tableAddedItem.appendChild(trContent)
                var appendData = {
                    nameItem: nItem,
                    descriptionItem: dItem
                }
                var toJson = JSON.stringify(appendData)
                addedItemsList.push(toJson)
                iconX.onclick = (e) => {
                    addedItemsList = addedItemsList.filter(item => item !== toJson)
                    tableAddedItem.removeChild(e.target.parentElement.parentElement)
                }
            } else {
                alert("Ha alcanzado el l??mte maximo de registros")
            }
        }
    }
    button.onclick = () => {
        windowDiv.style.display = "none"
        var accessoriesbox = document.getElementById("accessories-box")
        accessoriesbox.value = addedItemsList.length + " accesorios agregados"
    }
    return windowDiv
}
function panel_window() {
    panel = document.createElement("div")
    panel.classList.add("panel-window")
    document.body.appendChild(panel)
    return panel
}
function data_for_request() {
    let prepareDataToSend = null
    // getting the first data container
    var assetName = document.getElementById("asset-box").value
    var brand = document.getElementById("brand-box").value
    var model = document.getElementById("model-box").value
    var serial = document.getElementById("serial-box").value
    var otherItemsAdded = JSON.stringify(addedItemsList)

    // getting the emition campus and place
    var emitionCampus = document.getElementById("select-campus-asset")
    var emitionPlace = document.getElementById("select-area-campus-asset")
    emitionCampus = emitionCampus.options[emitionCampus.selectedIndex].value
    emitionPlace = emitionPlace.options[emitionPlace.selectedIndex].value

    // getting the reception campus and place
    var receptionCampus = document.getElementById("select-campus-asset-r")
    var receptionPlace = document.getElementById("select-area-campus-asset-r")
    receptionCampus = receptionCampus.options[receptionCampus.selectedIndex].value
    receptionPlace = receptionPlace.options[receptionPlace.selectedIndex].value

    // getting reason and description why
    var reason = document.getElementById("select-reason-asset")
    var descriptionWhy = document.getElementById("txt-area-description").value
    reason = reason.options[reason.selectedIndex].value

    if (assetName != "" && brand != "" && model != "" && serial != "" && emitionCampus != "0" &&
        emitionPlace != "0" && receptionCampus != "0" &&
        receptionPlace != "0" && reason != "0" && descriptionWhy != "") {
        var toJsonData = {
            "Username": USER_NAME,
            "AssetName": assetName,
            "Brand": brand,
            "Model": modal,
            "Serial": serial,
            "OtherItems": otherItemsAdded,
            "EmCampus": emitionCampus,
            "EmPlace": emitionPlace,
            "ReCampus": receptionCampus,
            "RePlace": receptionPlace,
            "Reason": reason,
            "Description": descriptionWhy
        }
        prepareDataToSend = JSON.stringify(toJsonData)
    } else {
        prepareDataToSend = null
        //createAlertToUser("empty", "A??n faltan campos por llenar en esta secci??n, por favor verifique")
    }
    return prepareDataToSend
}
sendRequestButton.onclick = (e) => {
    e.preventDefault()
    let dataAsset = data_for_request()
    if (dataAsset != null) {
        sendingData(dataAsset)
    } else {
        notificationApp("Existen campos vacios, verifique", "empty")
    }
    async function sendingData(contentRequest) {
        onprogressFunction(panel_window())
        await sendRequestToServer(contentRequest)
        returnToInitFields()
        removeLastElementApp()
        notificationApp("Exitoso", "successfull")
    }
    function sendRequestToServer(contentRequest) {
        var stateRequest = new Promise((resolve, reject) => {
            fetch(ADDRESS_SERVER + "new-request-asset", {
                method: "POST",
                header: {
                    'content-type': 'application/json'
                },
                body: contentRequest
            })
                .then(response => response.json())
                .then(data => resolve(data))
                .catch((error) => { reject(error) })
        })
        return stateRequest
    }
}
function getReasons() {
    dataFromAreasCampus("3s", selectReasonChange)
}
function appendReasons(dataInJson, selectElement) {
    for (var i = 0; i < dataInJson.length; i++) {
        var data = JSON.parse(dataInJson[i])
        var opt = document.createElement("option")
        opt.innerHTML = data.Reason_change
        selectElement.appendChild(opt)
    }
}
function onprogressFunction(onprogressWin) {
    onprogressWin.style.backgroundColor = "rgba(0, 0,0 , .8)"
    onprogressWin.style.display = "flex"
    onprogressWin.style.justifyContent = "center"
    onprogressWin.style.alignItems = "center"
    var progressPanel = document.createElement("div")
    var progressIcon = document.createElement("div")
    var progressMessage = document.createElement("p")

    progressMessage.innerHTML = "Enviado, por favor espere..."
    progressMessage.style.width = "100%"
    progressMessage.style.textAlign = "center"
    progressMessage.style.fontSize = "20px"
    progressMessage.style.color = "white"
    progressMessage.style.margin = "0"
    progressMessage.style.marginTop = "5px"

    progressIcon.style.backgroundImage = "url(../public/Images/loading.gif)"
    progressIcon.style.backgroundSize = "contain"
    progressIcon.style.width = "45px"
    progressIcon.style.height = "45px"
    progressIcon.style.display = "block"
    progressIcon.style.margin = "0 auto"
    progressIcon.style.marginTop = "10px"

    progressPanel.style.width = "300px"
    progressPanel.style.height = "100px"
    progressPanel.style.borderRadius = "10px"
    progressPanel.style.backgroundColor = "rgb(30, 219, 5)"

    progressPanel.classList.add("responsive-win")
    progressPanel.appendChild(progressIcon)
    progressPanel.appendChild(progressMessage)
    onprogressWin.appendChild(progressPanel)

}
function createAlertToUser(warning, content) {
    let alert = document.createElement("div")
    let iconX = document.createElement("i")
    let color = null
    alert.style.width = "350px"
    alert.style.height = "100px"
    alert.style.position = "absolute"
    alert.style.right = "20px"
    alert.style.bottom = "10px"
    alert.style.borderRadius = "10px"
    alert.style.color = "white"
    alert.style.fontSize = "18px"
    alert.style.display = "flex"
    alert.style.justifyContent = "center"
    alert.style.alignItems = "center"
    alert.style.textAlign = "center"
    alert.style.paddingLeft = "8px"
    alert.style.paddingRight = "8px"
    alert.style.transform = "translateX(110%)"

    iconX.classList.add("fas", "fa-times")
    iconX.style.position = "absolute"
    iconX.style.right = "6px"
    iconX.style.top = "5px"
    iconX.style.color = "white"
    iconX.style.fontSize = "15px"
    switch (warning) {
        case "ERROR":
            color = "red"
            break;
        case "empty":
            color = "orange"
            break;
        case "successfull":
            color = "rgba(0, 207, 35, 0.924)"
            break;
    }
    alert.style.backgroundColor = color
    alert.appendChild(iconX)
    alert.innerHTML += content
    document.body.appendChild(alert)
    iconX.onclick = () => {
        document.body.removeChild(alert)
    }
    setTimeout(() => {
        alert.style.transition = ".8s"
        alert.style.transform = "translateX(0%)"
        setTimeout(() => {
            alert.style.transition = ".8s"
            alert.style.transform = "translateX(110%)"
            setTimeout(() => {
                document.body.removeChild(alert)
            }, 3000);
        }, 3000);
    }, 300);
}
function retrievingDataProgress() {
    var rtvData = panel_window()
    var h3 = document.createElement("h3")
    //rtvData.style.backgroundColor = "rgba(0, 0,0 , .8)"
    rtvData.style.display = "flex"
    rtvData.style.justifyContent = "center"
    rtvData.style.alignItems = "center"
    h3.innerHTML = "Recuperando datos, por favor espere..."
    h3.style.backgroundColor = "rgb(30, 219, 5)"
    h3.style.padding = "10px"
    h3.style.borderRadius = "5px"
    h3.style.color = "white"
    h3.style.boxShadow = "-1px 1px 5px .5px white"
    h3.style.fontSize = "15px"
    rtvData.appendChild(h3)

}
function notificationApp(messageA=undefined, state) {
    scrollingToTop()
    // structure of the notification
    let color = null

    if (state == "successfull") {
        color = "rgb(3, 223, 58)"
    }else if (state == "error") {
        color = "red"
    }else {
        color = "rgb(253, 135, 0)"
    }
    var containerNotify = document.createElement("div")
    var message = document.createElement("p")
    var icon = document.createElement("img")
    icon.src = "../public/Images/successfull.png"
    icon.style.width = "25px"
    icon.style.height = "25px"
    icon.style.marginRight = "5px"
    message.innerHTML = messageA
    containerNotify.style.backgroundColor = color
    containerNotify.appendChild(icon)
    containerNotify.appendChild(message)
    containerNotify.classList.add("container-notification")
    document.body.appendChild(containerNotify)

    
    setTimeout(() => {
        containerNotify.classList.add("container-notification-animation")
        setTimeout(() => {
           containerNotify.classList.remove("container-notification-animation") 
           containerNotify.classList.add("container-notification-animation-up")
           setTimeout(() => {
            removeLastElementApp()
           }, 500);
        }, 1600);
    }, 320);
}
function scrollingToTop(){
    window.scroll({top:0, left:0, behavior:"smooth"})
}
function activateOverFlowApp(state) {
    state === true ? document.body.style.overflowY = "scroll" : document.body.style.overflowY = "hidden"
}
function removeLastElementApp() {
    document.body.removeChild(document.body.lastChild)
}
function returnToInitFields() {
    document.getElementById("asset-box").value = ""
    document.getElementById("brand-box").value = ""
    document.getElementById("model-box").value = ""
    document.getElementById("serial-box").value = ""
    document.getElementById("select-campus-asset").value = "0"
    document.getElementById("select-area-campus-asset").value = "0"
    document.getElementById("select-campus-asset-r").value = "0"
    document.getElementById("select-area-campus-asset-r").value = "0"
    document.getElementById("select-reason-asset").value = "0"
    document.getElementById("txt-area-description").value = ""

    var tableOfItems = document.getElementById("table-of-items")
    while (tableOfItems.children.length > 1) {
        tableOfItems.removeChild(tableOfItems.lastChild)
    }
}
// it creates the modal just one time
modal = create_modal_form(panel_window())
getReasons()