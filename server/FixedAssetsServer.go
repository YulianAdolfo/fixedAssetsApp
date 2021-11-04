package main

import (
	"database/sql"
	"encoding/json"
	"fmt"

	_ "github.com/go-sql-driver/mysql"
)

type places struct {
	ID    string
	PLACE string
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
func getEspecialistsAreasCampus() string {
	databaseConnection := connectToData()
	query, err := databaseConnection.Query("SELECT * FROM fa_esp_campus")
	if err != nil {
		fmt.Println("Error selecting data - especialist-area-campus: " + err.Error())
	}
	var data places
	var dataArray []string
	for query.Next() {
		if err = query.Scan(&data.ID, &data.PLACE); err != nil {
			fmt.Println("Error scanning the data especialist-area-campus: " + err.Error())
		}
		storage := places{ID: data.ID, PLACE: data.PLACE}
		toJson, err := json.Marshal(storage)
		if err != nil {
			fmt.Println("Error marshalling the data in query scan especialist-area-campus: " + err.Error())
		}
		dataArray = append(dataArray, string(toJson))
	}
	dataToJson, err := json.Marshal(dataArray)
	if err != nil {
		fmt.Println("Error marshalling the data in especialist-area-campus: " + err.Error())
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
func main() {
	data1 := getEspecialistsAreasCampus()
	fmt.Println(data1)
	data2 := getMainAreasCampus()
	fmt.Println("Main.........................---------------")
	fmt.Println(data2)
}
