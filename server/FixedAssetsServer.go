package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"text/template"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

type places struct {
	ID    string
	PLACE string
}
type reasons struct {
	Reason_change string
}
type stateSuccess struct {
	State string
}
type dataNewRequest struct {
	Username    string
	AssetName   string
	Brand       string
	Model       string
	Serial      string
	OtherItems  string
	EmCampus    string
	EmPlace     string
	ReCampus    string
	RePlace     string
	Reason      string
	Description string
}

const (
	username = "assetsUser"
	password = "AssYul.2000.05*"
	connType = "tcp"
	connPort = "3306"
	hostname = "127.0.0.1"
	dbname   = "fixed_assets"
)

// connectin to database
func connectToData() *sql.DB {
	connection, err := sql.Open("mysql", username+":"+password+"@"+connType+"("+hostname+":"+connPort+")/"+dbname)
	if err != nil {
		fmt.Println("Error connecting to database: " + err.Error())
	}
	return connection
}

// function to get especialists area campus
func getSpecialistsAreasCampus() string {
	databaseConnection := connectToData()
	query, err := databaseConnection.Query("SELECT * FROM fa_esp_campus")
	if err != nil {
		fmt.Println("Error selecting data - specialist-area-campus: " + err.Error())
	}
	var data places
	var dataArray []string
	for query.Next() {
		if err = query.Scan(&data.ID, &data.PLACE); err != nil {
			fmt.Println("Error scanning the data specialist-area-campus: " + err.Error())
		}
		storage := places{ID: data.ID, PLACE: data.PLACE}
		toJson, err := json.Marshal(storage)
		if err != nil {
			fmt.Println("Error marshalling the data in query scan specialist-area-campus: " + err.Error())
		}
		dataArray = append(dataArray, string(toJson))
	}
	dataToJson, err := json.Marshal(dataArray)
	if err != nil {
		fmt.Println("Error marshalling the data in specialist-area-campus: " + err.Error())
	}
	defer databaseConnection.Close()
	return string(dataToJson)
}

// function to get main area campus
func getMainAreasCampus() string {
	databaseConnection := connectToData()
	query, err := databaseConnection.Query("SELECT * FROM fa_main_campus")
	if err != nil {
		fmt.Println("Error in query get-main-areas: " + err.Error())
	}
	var data places
	var dataArray []string
	for query.Next() {
		err = query.Scan(&data.ID, &data.PLACE)
		if err != nil {
			fmt.Println("Error scanning the data in get-main-area-campus: " + err.Error())
		}
		storage := places{ID: data.ID, PLACE: data.PLACE}
		toJson, err := json.Marshal(storage)
		if err != nil {
			fmt.Println("Error marshalling the data in scann get-main-area-campus: " + err.Error())
		}
		dataArray = append(dataArray, string(toJson))
	}
	dataToJson, err := json.Marshal(dataArray)
	if err != nil {
		fmt.Println("Error marshalling the data in dataArray: " + err.Error())
	}
	defer databaseConnection.Close()
	return string(dataToJson)
}
func getReasonChange() string {
	databaseConnection := connectToData()
	query, err := databaseConnection.Query("SELECT REASON_CHANGE FROM fa_reason_change")
	if err != nil {
		fmt.Println("Error in query get-main-areas: " + err.Error())
	}
	var data reasons
	var dataArray []string
	for query.Next() {
		err = query.Scan(&data.Reason_change)
		if err != nil {
			fmt.Println("Error scanning the data in get-reason: " + err.Error())
		}
		storage := reasons{Reason_change: data.Reason_change}
		toJson, err := json.Marshal(storage)
		if err != nil {
			fmt.Println("Error marshalling the reasons " + err.Error())
		}
		dataArray = append(dataArray, string(toJson))
	}
	dataToJson, err := json.Marshal(dataArray)
	if err != nil {
		fmt.Println("Error marshalling the data in dataArray: " + err.Error())
	}
	defer databaseConnection.Close()
	return string(dataToJson)
}
func insertRegistryRequestAsset(r *http.Request) string {
	// creating type struct
	var dataForInsert dataNewRequest
	// reading the content sent by users
	contentBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		fmt.Println("Error reading the body " + err.Error())
	}
	// converting the body to json format
	json.Unmarshal(contentBody, &dataForInsert)
	// request connection db
	databaseConnection := connectToData()
	// creating the query
	query := "INSERT INTO biomedic_data (USER, ASSET, BRAND, MODEL, SERIAL, ACCESSORIES, DATETIME, CAMPUS_EMITION, PLACE_EMITION, REASON, CAMPUS_RECEPTION, PLACE_RECEPTION, DESCRIPTION, STATE) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
	// creating th context
	contextQuery, cancelfunc := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancelfunc()
	// preparing the query
	statementQuery, err := databaseConnection.PrepareContext(contextQuery, query)
	if err != nil {
		fmt.Println("Error preparing the query " + err.Error())
	}
	defer statementQuery.Close()
	_, err = statementQuery.ExecContext(contextQuery,
		dataForInsert.Username,
		dataForInsert.AssetName,
		dataForInsert.Brand,
		dataForInsert.Model,
		dataForInsert.Serial,
		dataForInsert.OtherItems,
		time.Now().String(),
		dataForInsert.EmCampus,
		dataForInsert.EmPlace,
		dataForInsert.Reason,
		dataForInsert.ReCampus,
		dataForInsert.RePlace,
		dataForInsert.Description, 0) // zero indicates the state 0 (sent but not approved)
	if err != nil {
		fmt.Println("Error exceuting the query context in insert " + err.Error())
	}
	// if the register of data was successfull, we continue sending the notification through email to the administrators
	if dataForInsert.EmCampus == "1" {
		dataForInsert.EmCampus = "Sede central"
	} else {
		dataForInsert.EmCampus = "Sede especialistas"
	}
	if dataForInsert.ReCampus == "1" {
		dataForInsert.ReCampus = "Sede central"
	} else {
		dataForInsert.ReCampus = "Sede especialistas"
	}
	dataForEmail := dataNewRequest{
		Username:    dataForInsert.Username,
		EmCampus:    dataForInsert.EmCampus,
		EmPlace:     dataForInsert.EmPlace,
		ReCampus:    dataForInsert.ReCampus,
		RePlace:     dataForInsert.RePlace,
		Reason:      dataForInsert.Reason,
		Description: dataForInsert.Description,
	}
	/* 	1- yulianrojas2000@gmail is the email where will be sent the notification of a new request biomedic asset
	it´s possible to add many emails to the array
	2- Message email
	3- Data for administrators
	*/
	go SendEmailToAdmin([]string{"yulianrojas2000@gmail.com"}, "Prueba de envío -Golang", &dataForEmail)
	return "Proceso exitoso, se notificará en breve al administrador"
}
func receiveNewRequest(w http.ResponseWriter, r *http.Request) {
	state := insertRegistryRequestAsset(r)
	success := stateSuccess{State: state}
	toJson, err := json.Marshal(success)
	if err != nil {
		fmt.Println("Error " + err.Error())
	}
	fmt.Fprint(w, string(toJson))
}
func accountUser(w http.ResponseWriter, r *http.Request) {
	accountPage := template.Must(template.ParseFiles("../users/app.html"))
	accountPage.Execute(w, nil)
}
func specialistsAreas(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, getSpecialistsAreasCampus())
}
func mainAreas(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, getMainAreasCampus())
}
func reasonWhyChange(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, getReasonChange())
}
func main() {
	publicSpace := http.FileServer(http.Dir("../public"))
	http.Handle("/public/", http.StripPrefix("/public/", publicSpace))
	http.HandleFunc("/new-request-asset", receiveNewRequest)
	http.HandleFunc("/account-new-request", accountUser)
	http.HandleFunc("/specialists-areas", specialistsAreas)
	http.HandleFunc("/main-areas", mainAreas)
	http.HandleFunc("/reason-change", reasonWhyChange)
	http.ListenAndServe(":5200", nil)
}
