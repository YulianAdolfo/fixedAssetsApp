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
	"github.com/gorilla/sessions"
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
type newRegistryUserData struct {
	Name         string
	Email        string
	Password     string
	IDAuthorized string
}
type dataForLogin struct {
	User     string
	Password string
	ID       int
}

const (
	username = "assetsUser"
	password = "AssYul.2000.05*"
	connType = "tcp"
	connPort = "3306"
	hostname = "127.0.0.1"
	dbname   = "fixed_assets"
)

var (
	loginKeySecret      = []byte("authorized-user-to-access")
	storeLoginKeySecret = sessions.NewCookieStore(loginKeySecret)
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
	return successProcess()
}
func getAuthorizedUser() string {
	type authorizedCode struct {
		authorizedCode string
	}
	var data authorizedCode
	databaseConnection := connectToData()
	query, err := databaseConnection.Query("SELECT authorizedCode from authorizeduser")
	if err != nil {
		fmt.Println("Error selecting authorized code: " + err.Error())
	}
	for query.Next() {
		if err = query.Scan(&data.authorizedCode); err != nil {
			fmt.Println("Error scanning the authorizedCode: " + err.Error())
		}
	}
	defer databaseConnection.Close()
	defer query.Close()
	return data.authorizedCode
}

// registry of new users
func newReigstryUser(r *http.Request) string {
	// extracting the data of body
	bodyRequest, err := ioutil.ReadAll(r.Body)
	if err != nil {
		fmt.Println("Error reading the body in registry user " + err.Error())
	}
	var dataBody newRegistryUserData
	err = json.Unmarshal(bodyRequest, &dataBody)
	if err != nil {
		fmt.Println("Error " + err.Error())
	}
	if getAuthorizedUser() == dataBody.IDAuthorized {
		// connecting to database
		databaseConnection := connectToData()
		query := "INSERT INTO fa_users (NAME, PASSWORD, EMAIL) VALUES (?,?,?)"
		contextQuery, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		// preparing the query
		preparingQuery, err := databaseConnection.PrepareContext(contextQuery, query)
		if err != nil {
			fmt.Println("Error preparing the query: " + err.Error())
		}
		resultQuery, err := preparingQuery.ExecContext(contextQuery, dataBody.Name, dataBody.Password, dataBody.Email)
		if err != nil {
			fmt.Println("Error excecuting the query: " + err.Error())
		}
		if ID, err := resultQuery.LastInsertId(); err != nil {
			fmt.Println("Error getting the last ID: " + err.Error())
		} else {
			// encrypting the password using AES_ENCRYPTION
			query = "UPDATE fa_users SET PASSWORD = AES_ENCRYPT(?,?)"
			preparingQuery, err = databaseConnection.Prepare(query)
			if err != nil {
				fmt.Println("Error preparing the query: " + err.Error())
			}
			preparingQuery.Exec(dataBody.Password, ID)
		}
		defer preparingQuery.Close()
		defer databaseConnection.Close()
		return successProcess()
	} else {
		return failProcess()
	}
}
func loginUser(r *http.Request) int {
	r.ParseForm()
	user := r.FormValue("txt-box-user")
	passwordUser := r.FormValue("txt-box-password")
	// connecting to databaase
	databaseConnection := connectToData()
	// query to verify
	query := "SELECT ID FROM fa_users WHERE NAME = " + "'" + user + "'" + " OR EMAIL= " + "'" + user + "'" + " AND AES_DECRYPT(PASSWORD, ID) =" + "'" + passwordUser + "'"
	existUser, err := databaseConnection.Query(query)
	if err != nil {
		fmt.Println("Error quering the login user: " + err.Error())
	}
	var dataLg dataForLogin
	for existUser.Next() {
		err = existUser.Scan(&dataLg.ID)
		if err != nil {
			fmt.Println("Error scanning the user data: " + err.Error())
		}
	}
	defer databaseConnection.Close()
	return dataLg.ID
}

// verifying if the user o email has already registered
func checkingExistenceOfBasicData(fieldName, valueFieldName string) int {
	databaseConnection := connectToData()
	query := "SELECT ID FROM fa_users WHERE " + fieldName + "=" + "'" + valueFieldName + "'"
	queryExec, err := databaseConnection.Query(query)
	if err != nil {
		fmt.Println("Error quering the username of database: " + err.Error())
	}
	var existsUser dataForLogin
	for queryExec.Next() {
		err = queryExec.Scan(&existsUser.ID)
		if err != nil {
			fmt.Println("Error reading the data of users existence: " + err.Error())
		}
	}
	defer databaseConnection.Close()
	return existsUser.ID
}
func successProcess() string {
	var successfull stateSuccess
	successfull.State = "success"
	dataReturn, _ := json.Marshal(successfull)
	return string(dataReturn)
}
func failProcess() string {
	var successfull stateSuccess
	successfull.State = "fail"
	dataReturn, _ := json.Marshal(successfull)
	return string(dataReturn)
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
func accessingToAccount(w http.ResponseWriter, r *http.Request) {
	// getting the cookie from the user
	sessionFromUser, err := storeLoginKeySecret.Get(r, "authorized-access")
	if err != nil {
		fmt.Println("Error getting the cookie: " + err.Error())
	}
	// verifying if the user has an account to access
	stateFoundUser := loginUser(r)
	if stateFoundUser != 0 {
		// if the user exists so, set authenticated-user state true and finally save it
		sessionFromUser.Values["authenticated-user"] = true
		sessionFromUser.Save(r, w)
		http.Redirect(w, r, "/account-new-request", http.StatusFound)
		return
	}
	failLogin := struct {
		Message string
	}{
		Message: "Credenciales incorrectas o usuario inexistente",
	}
	login := getLoginPage()
	login.Execute(w, &failLogin)

}
func accountUser(w http.ResponseWriter, r *http.Request) {
	sessionFromUser, err := storeLoginKeySecret.Get(r, "authorized-access")
	if err != nil {
		fmt.Println("Error getting the cookie: " + err.Error())
	}
	// checking if the user has been authenticated
	authorizeToSee, okToSee := sessionFromUser.Values["authenticated-user"].(bool)
	if !authorizeToSee || !okToSee {
		http.Error(w, "Forbidden", http.StatusForbidden)
		return
	}
	accountPage := template.Must(template.ParseFiles("../users/app.html"))
	accountPage.Execute(w, nil)
}
func registryForm(w http.ResponseWriter, r *http.Request) {
	accountPage := template.Must(template.ParseFiles("../users/registryUser.html"))
	accountPage.Execute(w, nil)
}
func accessToLogin(w http.ResponseWriter, r *http.Request) {
	login := getLoginPage()
	login.Execute(w, nil)
}
func getLoginPage() *template.Template {
	return template.Must(template.ParseFiles("../users/login.html"))
}
func logOutAccount(w http.ResponseWriter, r *http.Request) {
	sessionFromUser, err := storeLoginKeySecret.Get(r, "authorized-access")
	if err != nil {
		fmt.Println("Error getting the cookie: " + err.Error())
	}
	sessionFromUser.Values["authenticated-user"] = false
	sessionFromUser.Save(r, w)
	http.Redirect(w, r, "/login-user", http.StatusFound)
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
func registryUser(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, newReigstryUser(r))
}

// checking if the email exists
func checkEmail(w http.ResponseWriter, r *http.Request) {
	IDUserEmail := checkingExistenceOfBasicData("EMAIL", r.URL.Query().Get("string"))
	if IDUserEmail != 0 {
		fmt.Fprintf(w, existenceUser())
		return
	}
	fmt.Fprintf(w, failProcess())
}
func existenceUser() string {
	StateOfExistance := struct {
		State bool
	}{
		State: true,
	}
	stateEx, err := json.Marshal(StateOfExistance)
	if err != nil {
		fmt.Println("Error marsalling the state of existance: " + err.Error())
	}
	return string(stateEx)
}

// checking if the usename exists
func checkUserName(w http.ResponseWriter, r *http.Request) {
	IDUserName := checkingExistenceOfBasicData("NAME", r.URL.Query().Get("string"))
	if IDUserName != 0 {
		fmt.Fprintf(w, existenceUser())
		return
	}
	fmt.Fprintf(w, failProcess())
}
func main() {
	publicSpace := http.FileServer(http.Dir("../public"))
	http.Handle("/public/", http.StripPrefix("/public/", publicSpace))
	http.HandleFunc("/new-request-asset", receiveNewRequest)
	http.HandleFunc("/account-new-request", accountUser)
	http.HandleFunc("/specialists-areas", specialistsAreas)
	http.HandleFunc("/main-areas", mainAreas)
	http.HandleFunc("/reason-change", reasonWhyChange)
	http.HandleFunc("/registry", registryUser)
	http.HandleFunc("/login", accessToLogin)
	http.HandleFunc("/account", accessingToAccount)
	http.HandleFunc("/login-user", accessToLogin)
	http.HandleFunc("/login-out", logOutAccount)
	http.HandleFunc("/registry-user-form", registryForm)
	http.HandleFunc("/verify-user-email", checkEmail)
	http.HandleFunc("/verify-user-user-name", checkUserName)
	http.ListenAndServe(":5200", nil)
}
