var menuButton = document.getElementById("menu-bar")
var accptButton = document.getElementById("btn-acc")
var rjtButton = document.getElementById("btn-rjt")

accptButton.onclick = () => acceptReject("rgb(30, 219, 5)", "¿Realmente desea aceptar esta solicitud?", 0)
rjtButton.onclick = () => acceptReject("red", "¿Realmente desea rechazar esta solicitud?", 1)

var dasboardContainerTable = document.getElementById("container-request-main")
function getTable() {
    return dasboardContainerTable.children[0]
}
function getTableTr() {
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
function getMainForm() {
    var form = document.createElement("div")
    form.classList.add("form-sub-menu")
    return form
}
function getInputBox() {
    var input = document.createElement("input")
    input.type = "text"
    return input
}
function getButton() {
    return document.createElement("button")
}
function getTitleHeader() {
    return document.getElementById("title-header")
}
function getBackgroundPanel() {
    var confirmationPanel = document.createElement("div")
    confirmationPanel.style.width = "100%"
    confirmationPanel.style.height = "100%"
    confirmationPanel.style.position = "absolute"
    confirmationPanel.style.top = "0"
    confirmationPanel.style.left = "0"
    confirmationPanel.style.backgroundColor = "rgba(0,0,0,.5)"
    return confirmationPanel
}
menuButton.onclick = () => menuWin()

function setContentTable(amountRequest) {
    var table = getTable()
    for (var i = 0; i < amountRequest; i++) {
        var lineHorizontalTable = getTableTr()
        for (var j = 0; j < 4; j++) {
            var content = null
            var contentTD = getTableTd()
            switch (j) {
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
                    content.classList.add("fas", "fa-check", "accept-button")
                    content.onclick = () => acceptReject("rgb(30, 219, 5)", "¿Realmente desea aceptar esta solicitud?", 0)
                    break;
                case 3:
                    content = getIcon()
                    content.title = "rechazo la solicitud"
                    content.classList.add("fas", "fa-times", "refuse-button")
                    content.onclick = () => acceptReject("red", "¿Realmente desea rechazar esta solicitud?", 1)
                    break;
            }
            contentTD.appendChild(content)
            lineHorizontalTable.appendChild(contentTD)
            table.appendChild(lineHorizontalTable)
        }
    }
}
async function acceptReject(color, message, action = null) {
    var state = await requestConfirmationAction(color, message)
    if (state) {
        if (action == 0) {
            console.log("el usuario acepta la solicitud")
        } else if (action == 1) {
            console.log("el usuario rechaza la solicitud")
        } else {
            console.log("nada")
        }
    }
}
var backButton = () => {
    var button = document.getElementById("back-button")
    button.onclick = () => {
        document.getElementById("background-panel-style").style.display = "none"
    }
}
function requestConfirmationAction(color, messageContent) {
    var confirmationPanel = getBackgroundPanel()
    var boxAlert = document.createElement("div")
    var buttonYes = document.createElement("button")
    var buttonNo = document.createElement("button")
    var message = document.createElement("p")
    // alert box
    boxAlert.style.width = "300px"
    boxAlert.style.height = "150px"
    boxAlert.style.backgroundColor = color
    boxAlert.style.borderRadius = "10px"
    boxAlert.style.position = "absolute"
    boxAlert.style.left = "50%"
    message.innerHTML = messageContent
    message.style.textAlign = "center"
    message.style.color = "white"
    message.style.fontSize = "18px"
    boxAlert.style.top = "-30%"
    boxAlert.style.transform = "translateX(-50%)"
    // buttons
    buttonYes.innerHTML = "SI"
    buttonNo.innerHTML = "NO"
    buttonYes.style.backgroundColor = "white"
    buttonNo.style.backgroundColor = "white"
    buttonYes.style.width = "100px"
    buttonNo.style.width = "100px"
    buttonNo.style.padding = "0"
    buttonYes.style.border = "none"
    buttonYes.style.borderRadius = "2px"
    buttonYes.style.fontSize = "15px"
    buttonNo.style.fontSize = "15px"
    buttonNo.style.border = "none"
    buttonNo.style.borderRadius = "2px"
    buttonNo.style.fontSize = "15px"
    buttonNo.style.color = "black"


    buttonYes.style.margin = "0 auto"
    buttonYes.style.marginLeft = "40px"
    buttonYes.style.marginRight = "20px"
    buttonYes.style.marginTop = "10px"

    buttonYes.style.padding = "5px"
    buttonNo.style.padding = "5px"
    buttonYes.style.cursor = "pointer"
    buttonNo.style.cursor = "pointer"
    // append to boxalert
    boxAlert.appendChild(message)
    boxAlert.appendChild(buttonYes)
    boxAlert.appendChild(buttonNo)
    // append to confirmation alert
    confirmationPanel.appendChild(boxAlert)
    // append to body
    document.body.appendChild(confirmationPanel)

    setTimeout(() => {
        boxAlert.style.top = "35%"
        boxAlert.style.transition = "1s"
    }, 50);

    return new Promise((yes, no) => {
        buttonYes.onclick = () => { yes(true) }
        buttonNo.onclick = () => { no(false) }
    }).catch(() => removeLastChild())
}
function menuWin() {
    function getLi() {
        return document.createElement("li")
    }
    function getUl() {
        return document.createElement("ul")
    }
    var menu = getBackgroundPanel()
    var menuSide = document.createElement("div")
    var options = document.createElement("h2")
    var optionList = getUl()

    menu.id = "container-menu-app"
    options.innerHTML = "<i class='fas fa-arrow-left' style='position:absolute; left:10px;cursor:pointer;'></i>"
    options.innerHTML += "<i class='fas fa-user-cog'></i>"
    options.innerHTML += "Opciones"

    menuSide.classList.add("styles-menu-dashboard")

    var submenu1 = getUl()
    var submenu2 = getUl()
    optionList.appendChild(getLi()).innerHTML = "<i class='fas fa-home'></i>" + "Inicio"
    optionList.appendChild(getLi()).innerHTML = "<i class='fas fa-user'></i>" + "Usuarios" + "<i class='fas fa-plus'></i>"
    optionList.appendChild(submenu1)
    submenu1.appendChild(getLi()).innerHTML = "<i class='fas fa-user-plus'></i>" + "Crear nuevo usuario"
    submenu1.appendChild(getLi()).innerHTML = "<i class='fas fa-user-slash'></i>" + "Activar/Inactivar usuarios"
    submenu1.appendChild(getLi()).innerHTML = "<i class='fas fa-user-minus'></i>" + "Eliminar usuarios"
    optionList.appendChild(getLi()).innerHTML = "<i class='fas fa-file-excel'></i>" + "Generar reportes"
    optionList.appendChild(getLi()).innerHTML = "<i class='fas fa-key'></i>" + "Credenciales" + "<i class='fas fa-plus'></i>"
    optionList.appendChild(submenu2)
    submenu2.appendChild(getLi()).innerHTML = "<i class='fas fa-unlock'></i>" + "Cambiar contraseña"
    submenu2.appendChild(getLi()).innerHTML = "<i class='fas fa-id-card'></i>" + "Cambiar ID de autorización"
    optionList.appendChild(getLi()).innerHTML = "<i class='fas fa-sign-out-alt'></i>" + "Salir"
    menuSide.appendChild(options)
    menuSide.appendChild(optionList)

    menu.appendChild(menuSide)
    document.body.appendChild(menu)

    optionList.children[1].onclick = (e) => setActionList(e.target, optionList.children[2]) // users
    optionList.children[4].onclick = (e) => setActionList(e.target, optionList.children[5]) // credentials
    function setActionList(element, submenuList) {
        var subMenu = submenuList
        if (subMenu.style.display == "" || subMenu.style.display == "none") {
            subMenu.style.display = "block"
            element.children[1].classList.replace("fa-plus", "fa-minus")
            element.style.backgroundColor = "#0194ce"
        } else {
            subMenu.style.display = "none"
            element.children[1].classList.replace("fa-minus", "fa-plus")
            element.style.backgroundColor = "transparent"
        }
    }
    options.children[0].onclick = () => closeMenu()
    menu.onclick = (e) => {
        if(e.target.id == "container-menu-app") {
            closeMenu( )
        }
    }
    function closeMenu() {
        menuSide.classList.add("close-menu-app")
        setTimeout(() => {removeLastChild()}, 100);
    }

}
function backgroundSubmenuSection() {
    var panel = getBackgroundPanel()
    panel.style.top = "50px"
    panel.style.backgroundColor = "white"
    return panel

    
}
function createNewForm() {
    var panel = backgroundSubmenuSection()
    var form = getMainForm()
    var user = getInputBox()
    var email = getInputBox()
    var password = getInputBox()
    var button = getButton()

    form.appendChild(user)
    form.appendChild(email)
    form.appendChild(password)
    form.appendChild(button)
    panel.appendChild(form)

    document.body.appendChild(panel)

    return panel
}
function newAdminUser() {
    let containerForm = createNewForm()
    let form = containerForm.children[0]
    let username = form.children[0]
    let email = form.children[1]
    let password = form.children[2]
    let button = form.children[3]

    username.placeholder = "Ingrese nombre de usuario"
    email.placeholder = "Ingrese correo electrónico @gmail.com"
    password.placeholder = "Ingrese la contraseña (temporal)"
    password.type = "password"
    button.innerHTML = "Registrar"
    getTitleHeader().innerHTML = "Nuevo usuario Admin"

}
function changePassword() {
    let containerForm = createNewForm()
    let form = containerForm.children[0]
    let actualPassword = form.children[0]
    let newPassword = form.children[1]
    let confirmPassword = form.children[2]
    let button = form.children[3]

    actualPassword.placeholder = "Ingrese contraseña actual"
    newPassword.placeholder = "Ingrese la nueva contraseña"
    confirmPassword.placeholder = "Confirme la nueva contraseña"
    actualPassword.type = "password"
    newPassword.type = "password"
    confirmPassword.type = "password"
    button.innerHTML = "Cambiar"
    getTitleHeader().innerHTML = "Cambio de credenciales"

}
function changeIDauthorized() {
    let containerForm = createNewForm()
    let form = containerForm.children[0]
    let actualID = form.children[0]
    let newID = form.children[1]
    let confirmId = form.children[2]
    let button = form.children[3]

    actualID.placeholder = "Ingrese ID actual"
    newID.placeholder = "Ingrese la nuevo ID"
    confirmId.placeholder = "Confirme el nuevo ID"
    confirmId.type = "text"
    button.innerHTML = "Cambiar ID"
    getTitleHeader().innerHTML = "Cambio ID registro"

}
function blockUnblockDeleteUsers() {
    let containerForm = createNewForm()
    let form = containerForm.children[0]
    form.style.height = "85%"
    form.style.position = "absolute"
    form.style.left = "50%"
    form.style.top = "0"
    form.style.transform = "translate(-50%, 0%)"
    form.style.display = "block"
    form.style.margin = "0 auto"
    form.style.marginTop = "10px"
    form.style.padding = "0"
    form.classList.add("form-search-block-unblock-delete")
    while(form.firstChild) {
        form.removeChild(form.lastElementChild)
    }

    var nav = document.createElement("nav")
    var boxSearch = getInputBox()
    var buttonSearch = getButton()
    boxSearch.placeholder = "Ingrese nombre usuario o correo electrónico"
    buttonSearch.innerHTML = "<i class='fas fa-search'></i>"
    nav.appendChild(boxSearch)
    nav.appendChild(buttonSearch)

    // table
    var table = document.createElement("table")
    var tr = getTableTr()
    tr.appendChild(document.createElement("th")).innerHTML = "Nombre"
    tr.appendChild(document.createElement("th")).innerHTML = "Tipo"
    tr.appendChild(document.createElement("th")).innerHTML = "Acción"
    table.appendChild(tr)
    form.appendChild(nav)
    form.appendChild(table)

    // creating content

    for(var i =0; i  < 1; i++) {
        var tr = getTableTr()
        for(var j =0; j < 3; j++) {
            var td = getTableTd()
            switch(j) {
                case 0:
                    td.innerHTML = "nombre de usuario"
                    break;
                case 1:
                    td.innerHTML = "Usuario"
                    break;
                case 2:
                    var select = document.createElement("select")
                    var opt = document.createElement("option")
                    opt.innerHTML = "Seleccione"
                    select.appendChild(opt)
                    td.appendChild(select)
                    break;
            }
            tr.appendChild(td)
        }
        table.appendChild(tr)
    }
    
}
function removeLastChild() {
    document.body.removeChild(document.body.lastElementChild)
}
//blockUnblockDeleteUsers()
backButton()
//menuWin()
setContentTable(5)
//createNewAdminUser()