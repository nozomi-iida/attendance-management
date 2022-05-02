package models

import (
	"fmt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"os"
)

var DB *gorm.DB

// TODO: 日本時刻に
func ConnectDatabase(dbname string) {
	dsn := fmt.Sprintf("host=%s dbname=%s user=%s password=%s port=%s TimeZone=Asia/Shanghai",
		os.Getenv("DATABASE_HOST"),
		dbname,
		os.Getenv("DATABASE_USERNAME"),
		os.Getenv("DATABASE_PASSWORD"),
		os.Getenv("DATABASE_PORT"),
	)

	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		panic("Failed to connect to database!")
	}

	database.AutoMigrate(&Account{}, &Attendance{})

	fmt.Println("db connected!")
	DB = database
}
