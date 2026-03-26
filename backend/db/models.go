package db

import (
	"time"

	"gorm.io/gorm"
)

// User represents an authenticated user on the platform
type User struct {
	gorm.Model
	Email    string `gorm:"uniqueIndex;not null"`
	Password string `gorm:"not null"`
}

// SearchHistory tracks searches made by users (or anonymous if UserID is null)
type SearchHistory struct {
	gorm.Model
	UserID     *uint
	User       User
	GameName   string
	TagLine    string
	Platform   string
	SearchedAt time.Time
}

// CachedProfile stores Riot API responses as JSONB to prevent hitting rate limits
type CachedProfile struct {
	gorm.Model
	PUUID        string `gorm:"uniqueIndex;not null"`
	AccountData  string `gorm:"type:jsonb"`
	SummonerData string `gorm:"type:jsonb"`
}
