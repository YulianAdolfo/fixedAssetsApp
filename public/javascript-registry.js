var buttonSendRegistry = document.querySelector('button')
var boxUser = document.getElementById("txt-reg-user")
var boxMail = document.getElementById("txt-reg-email")
var checkNotEmail = document.getElementById("diff-gmail")
var authorizedID = document.getElementById("id-authorized")
var password = document.getElementById("user-pass")
var rePassword = document.getElementById("redigit-password")

buttonSendRegistry.addEventListener("click", (e)=> {
    e.preventDefault()
    async function sendDataForRegistry() {
        var dataForFetch = {
            "Name": boxUser.value,
            "Email" : boxMail.value,
            "Password" : password.value,
            "IDAuthorized" : authorizedID.value
        }
        var data = JSON.stringify(dataForFetch)
        var state = await RegistryData(data)
        console.log(state)
    }
    function RegistryData(data) {
        return new Promise((resolved, rejected)=>{
            fetch("http://192.168.1.18:5200/registry", {
                method:"POST",
                header: {
                    "content-type":"application/json"
                },
                body: data
            })
            .then(receivedData => receivedData.json())
            .then(data => resolved(data))
            .catch(error => rejected(error))
        })
    }
    sendDataForRegistry()
})
