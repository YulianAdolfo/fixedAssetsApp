package main

import (
	"bytes"
	"fmt"
	"net/smtp"
	"text/template"
)

const (
	SIMPLE_MAIL_TRANSFER_HOST = "smtp.gmail.com"
	SIMPLE_MAIL_TRANSFER_PORT = "587"
)

func SendEmailToAdmin(address []string, subject string, dataUserEmail *dataNewRequest) string {
	fmt.Println(dataUserEmail.Username)
	sendmail, err := sendEmailNow(address, subject, dataUserEmail)
	if err != nil {
		fmt.Println(err)
	}
	return sendmail
}
func getCredentialEmitter() (string, string) {
	emitterEmail := "downloadfromega2018@gmail.com"
	emitterEmailPassword := "descargardemega2018"

	return emitterEmail, emitterEmailPassword
}
func sendEmailNow(addressEmailTo []string, subjectEmail string, dataUserEmail *dataNewRequest) (string, error) {
	// address where will send the notification emails
	email, password := getCredentialEmitter()
	// Template email
	templateEmailSend, err := template.ParseFiles("./privateTemplate/templateEmail.html")
	if err != nil {
		fmt.Println("Error parsing the template email: " + err.Error())
	}
	var containerHTML bytes.Buffer
	mimeHeaders := "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n"
	containerHTML.Write([]byte(fmt.Sprintf("Subject:"+subjectEmail+"\nTo:", addressEmailTo, "\nFrom:"+email+"\n%s\n\n", mimeHeaders)))

	templateEmailSend.Execute(&containerHTML, struct {
		User            string
		EmitionCampus   string
		EmitionPlace    string
		ReceptionCampus string
		ReceptionPlace  string
		Reason          string
		Description     string
	}{
		User:            dataUserEmail.Username,
		EmitionCampus:   dataUserEmail.EmCampus,
		EmitionPlace:    dataUserEmail.EmPlace,
		ReceptionCampus: dataUserEmail.ReCampus,
		ReceptionPlace:  dataUserEmail.RePlace,
		Reason:          dataUserEmail.Reason,
		Description:     dataUserEmail.Description,
	})
	// message to send
	/* messageToSend := []byte(
	"From:" + email + "\r\n" +
		"To:" + addressTo + "\r\n" +
		"Subject:" + subjectEmail + "\r\n\r\n" +
		EmailBody) */

	// authenticate emitter
	authenticateEmitter := smtp.PlainAuth("", email, password, SIMPLE_MAIL_TRANSFER_HOST)

	// sending email
	err = smtp.SendMail(SIMPLE_MAIL_TRANSFER_HOST+":"+SIMPLE_MAIL_TRANSFER_PORT, authenticateEmitter, email, addressEmailTo, containerHTML.Bytes())

	if err != nil {
		fmt.Println("Error sending the email " + err.Error())
		return "", err
	}
	return "success", nil
}
