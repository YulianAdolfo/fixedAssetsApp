package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"text/template"

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
func receiveNewRequest(w http.ResponseWriter, r *http.Request) {
	success := stateSuccess{
		State: "success",
	}
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
