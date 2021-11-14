var buttonSendRegistry = document.querySelector('button')
var boxUser = document.getElementById("txt-reg-user")
var boxMail = document.getElementById("txt-reg-email")
var checkNotEmail = document.getElementById("diff-gmail")
var authorizedID = document.getElementById("id-authorized")
var password = document.getElementById("user-pass")
var rePassword = document.getElementById("redigit-password")

// verify if the email or username are registered yet
function verifyBasicData(box, url) {
    var boxValue = box.value.trim()
    box.disabled = true
    return new Promise((resolved, rejected) => {
        fetch("/" + url + "?string=" + boxValue, {
            method: "get",
            headers: {
                "content-type": "application/json"
            }
        })
            .then(email => email.json())
            .then(existEmail => resolved(existEmail))
            .catch(error => rejected(error))
    })
}

checkNotEmail.onchange = () => {
    if (checkNotEmail.checked) {
        boxMail.disabled = true
        boxMail.style.backgroundColor = "#ddd"
        boxMail.value = ""
        alert("Sin un correo electrónico válido NO podrás recuperar tu cuenta si olvidas tu contraseña y tendrás que memorizar tu nombre de usuario para poder acceder al aplicativo")
    } else {
        boxMail.disabled = false
        boxMail.style.backgroundColor = "white"
    }
}

buttonSendRegistry.addEventListener("click", (e) => {
    e.preventDefault()
    if (boxUser.value != "" && authorizedID.value != "" && password.value != "" && rePassword.value != "") {
        if (!checkNotEmail.checked && boxMail.value != "" || checkNotEmail.checked) {
            var messageToUser = ""
            for (var i = 0; i < 5; i++) {
                switch (i) {
                    case 0:
                        if (boxUser.value.length < 5) { messageToUser += "Nombre demasiado corto, debe tener al menos 5 caracteres\n" }
                        break;
                    case 1:
                        if (!checkNotEmail.checked && boxMail.value.substring(0, boxMail.value.length - 10).length < 5) {
                            messageToUser += "Correo electrónico debe tener al menos 5 caracteres carácteres y debe ser '@gmail.com'\n"
                        } else {
                            if (!checkNotEmail.checked && !boxMail.value.includes("@gmail.com")) {
                                messageToUser += "El correo debe ser '@gmail.com'\n"
                            }
                        }
                        break;
                    case 3:
                        if (password.value != rePassword.value) {
                            messageToUser += "Las contraseas no coinciden\n"
                        } else {
                            if (password.value.length < 5) {
                                messageToUser += "Contraseña demasiado corta, debe tener una longitud de al menos 5 caracteres"
                            }
                        }
                        break;
                }
            }
            // if there area errors, so show them in an alert
            if (messageToUser.length > 0) {
                alert(messageToUser)
            } else {
                // call function to prepare the data to send the request
                sendDataForRegistry()
            }
        } else {
            boxMail.classList.add("emptyFields")
            deleteClass()
        }
    } else {
        unfillField2()
        deleteClass()
    }
    function unfillField2() {
        console.log("adsfkjsdf")
        var boxes = [boxUser, boxMail, authorizedID, password, rePassword]
        boxes.forEach(box => {
            if (box.value == "") {
                if (!box.disabled) {
                    box.classList.add("emptyFields")
                }
            }
        })
    }
    function deleteClass() {
        setTimeout(() => {
            boxUser.classList.remove("emptyFields")
            boxMail.classList.remove("emptyFields")
            authorizedID.classList.remove("emptyFields")
            password.classList.remove("emptyFields")
            rePassword.classList.remove("emptyFields")
        }, 500);
    }
    async function sendDataForRegistry() {
        // first verify if the user exists
        var checkUserName = await verifyBasicData(boxUser, "verify-user-user-name")
        // second verify if the email exists
        var checkEmail = null
        if (!checkNotEmail.checked) {
            checkEmail = await verifyBasicData(boxMail, "verify-user-email")
        }
        boxUser.disabled = false
        boxMail.disabled = false
        // if the email and the user has not been registered yet
        if (checkUserName.State == "success" || !checkNotEmail.checked && checkEmail.State == "success") {
            var dataForFetch = { 
                "Name": boxUser.value,
                "Email": boxMail.value,
                "Password": password.value,
                "IDAuthorized": authorizedID.value
            }
            // set window loading
            onprogressFunction(panel_window())
            // convert to json the data 
            var data = JSON.stringify(dataForFetch)
            // calling the function to send data 
            var state = await RegistryData(data)
            removeLastElementApp()
            // return to empty fields
            boxUser.value = ""
            boxMail.value = ""
            authorizedID.value = ""
            password.value = ""
            rePassword.value = ""
            // go to top page
            scrollingToTop()
            if (state.State == "success") {
                notificationApp("Registro exitoso", state.State, "../public/Images/successfull.png")
                setTimeout(() => {
                    location.href = "/login"
                }, 1600);
            } else {
                notificationApp("Registro no autorizado", "error", "../public/Images/err.png")
            }
        }else {
            // if the username or email exists
            scrollingToTop()
            notificationApp("El usuario o correo ya está registrado", "empty", "../public/Images/err.png")
            boxUser.value = ""
            boxMail.value = ""
        }
    }
    function RegistryData(data) {
        return new Promise((resolved, rejected) => {
            fetch("http://192.168.1.18:5200/registry", {
                method: "POST",
                header: {
                    "content-type": "application/json"
                },
                body: data
            })
                .then(receivedData => receivedData.json())
                .then(data => resolved(data))
                .catch(error => rejected(error))
        })
    }
})
function panel_window() {
    panel = document.createElement("div")
    document.body.appendChild(panel)
    return panel
}
function onprogressFunction(onprogressWin) {
    onprogressWin.style.backgroundColor = "rgba(0, 0,0 , .8)"
    onprogressWin.style.display = "flex"
    onprogressWin.style.justifyContent = "center"
    onprogressWin.style.alignItems = "center"
    onprogressWin.style.position = "fixed"
    onprogressWin.style.left = "0"
    onprogressWin.style.top = "0"
    onprogressWin.style.width = "100%"
    onprogressWin.style.height = "100%"
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
function notificationApp(messageA = undefined, state, iconPath = null) {
    scrollingToTop()
    // structure of the notification
    let color = null

    if (state == "success") {
        color = "rgb(3, 223, 58)"
    } else if (state == "error") {
        color = "red"
    } else {
        color = "rgb(253, 135, 0)"
    }
    console.log(color)
    console.log(state)
    var containerNotify = document.createElement("div")
    var message = document.createElement("p")
    var icon = document.createElement("img")
    icon.src = iconPath
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
function scrollingToTop() {
    window.scroll({ top: 0, left: 0, behavior: "smooth" })
}
function removeLastElementApp() {
    document.body.removeChild(document.body.lastChild)
}