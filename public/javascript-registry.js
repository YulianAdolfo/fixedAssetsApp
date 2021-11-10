import { ADDRESS_SERVER } from "./javascript"
var buttonSendRegistry = document.querySelector('button')
var boxUser = document.getElementById("txt-reg-user")
var boxMail = document.getElementById("txt-reg-email")
var checkNotEmail = document.getElementById("diff-gmail")
var authorizedID = document.getElementById("id-authorized")
var password = document.getElementById("user-pass")
var rePassword = document.getElementById("redigit-password")

console.log(buttonSendRegistry)
console.log(ADDRESS_SERVER)

buttonSendRegistry.addEventListener("click", (e)=> {
    e.preventDefault()
    async function sendDataForRegistry() {
        var dataForFetch = {
            name : boxUser.value,
            email : boxMail.value,
            password : password.value,
            IDAuthorized : authorizedID.value
        }
        var state = await RegistryData(dataForFetch)
        console.log(state)
    }
    function RegistryData(data) {
        return new Promise((resolved, rejected)=>{
            fetch(ADDRESS_SERVER + "/registry", {
                method:"POST",
                headers: {
                    "content-type":"text/plain"
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
