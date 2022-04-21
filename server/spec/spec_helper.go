package spec

import (
	"fmt"
	"github.com/joho/godotenv"
	"github.com/nozomi-iida/attendance-management/app/models"
	"log"
	"os"
)

func SetUp() {
	if err := os.Chdir("../.."); err != nil {
		panic(err)
	}
	err_read := godotenv.Load(".env")
	if err_read != nil {
		log.Fatalf("error: %v", err_read)
	}
	models.ConnectDatabase(os.Getenv("DATABASE_NAME"))
}

// FIXME: modelが追加されるごとにコードを更新しないと行けないのが気に入らない
func CleanUpFixture() {
	models.DB.Exec("truncate accounts CASCADE;")
	db, err := models.DB.DB()
	if err != nil {
		fmt.Errorf("エラー")
	}
	db.Close()
}
