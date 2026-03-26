package db

import (
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
	dsn := os.Getenv("DB_DSN")
	if dsn == "" {
		log.Println("DB_DSN is not set, skipping database initialization")
		return
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Println("Failed to connect to postgres:", err)
		return
	}

	err = db.AutoMigrate(&User{}, &SearchHistory{}, &CachedProfile{})
	if err != nil {
		log.Println("Failed to migrate database:", err)
		return
	}

	DB = db
	log.Println("Database models migrated successfully")
}
