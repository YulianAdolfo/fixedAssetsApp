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

func SendEmailToAdmin(address, subject, contentMessage string) string {
	sendmail, err := sendEmailNow(address, subject, contentMessage)
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
func sendEmailNow(addressTo, subjectEmail, EmailBody string) (string, error) {
	// address where will send the notification emails
	email, password := getCredentialEmitter()
	// address to send the email
	addressEmailTo := []string{addressTo}
	// Template email
	templateEmailSend, err := template.ParseFiles("./privateTemplate/templateEmail.html")
	if err != nil {
		fmt.Println("Error parsing the template email: " + err.Error())
	}
	var containerHTML bytes.Buffer
	mimeHeaders := "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n"
	containerHTML.Write([]byte(fmt.Sprintf("Subject: Testing subject HTML \n%s\n\n ", mimeHeaders)))

	templateEmailSend.Execute(&containerHTML, struct {
		Name    string
		Message string
	}{
		Name:    "Yulian Adolfo",
		Message: "Mensaje en html",
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
