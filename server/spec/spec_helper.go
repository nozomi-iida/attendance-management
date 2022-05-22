package spec

import (
	"fmt"
	"github.com/nozomi-iida/attendance-management/app/models"
	"log"
	"os"
	"path/filepath"
	"testing"
	"time"
)

var currentDir, _ = filepath.Abs(".")

func SetUp(t *testing.T) {
	if err := os.Chdir("../.."); err != nil {
		panic(err)
	}
	t.Setenv("DATABASE_HOST", "db")
	t.Setenv("DATABASE_PORT", "5432")
	t.Setenv("DATABASE_USERNAME", "deploy")
	t.Setenv("DATABASE_PASSWORD", "password")
	models.ConnectDatabase("attendance_management_test")
}

func CloseDb() {
	if err := os.Chdir(currentDir); err != nil {
		panic(err)
	}
	if err := os.Chdir("."); err != nil {
		panic(err)
	}
	db, err := models.DB.DB()
	if err != nil {
		log.Fatal(err)
	}
	models.DB.Exec("truncate accounts CASCADE;")
	models.DB.Exec("truncate attendances;")
	db.Close()
	fmt.Println("Close DB")
}

// テストでは時間を常にUTCで使うため
func ISOTime2JP(isoTime time.Time) time.Time {
	return isoTime.In(time.FixedZone("JST", 9*60*60))
}
