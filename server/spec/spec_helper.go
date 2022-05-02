package spec

import (
	"github.com/joho/godotenv"
	"github.com/nozomi-iida/attendance-management/app/models"
	"log"
	"os"
	"testing"
)

func TestMain(m *testing.M) {
	SetUp()
	defer CleanUpFixture()

	m.Run()
	CloseDb()
}

func SetUp() {
	if err := os.Chdir("../.."); err != nil {
		panic(err)
	}
	err_read := godotenv.Load(".env")
	if err_read != nil {
		log.Fatalf("error: %v", err_read)
	}
	models.ConnectDatabase("attendance_management_test")
}

// FIXME: modelが追加されるごとにコードを更新しないと行けないのが気に入らない
func CleanUpFixture() {
	models.DB.Exec("truncate accounts CASCADE;")
	models.DB.Exec("truncate attendances;")
}

func CloseDb() {
	db, err := models.DB.DB()
	if err != nil {
		log.Fatal(err)
	}
	db.Close()
}
