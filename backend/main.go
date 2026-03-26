package main

import (
	"log"
	"net/http"
	"os"

	"lolproject-backend/db"
	"lolproject-backend/riot"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found or error loading it, looking for OS env vars")
	}

	apiKey := os.Getenv("RIOT_API_KEY")
	if apiKey == "" {
		log.Fatal("RIOT_API_KEY is not set")
	}

	riotClient := riot.NewClient(apiKey)

	db.InitDB()

	r := gin.Default()

	// CORS basic middleware (we will need this for frontend communication soon)
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	r.GET("/api/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "ok",
		})
	})
	
	r.GET("/api/summoner/:regionPlatform/:gameName/:tagLine", func(c *gin.Context) {
		gameName := c.Param("gameName")
		tagLine := c.Param("tagLine")
		platform := c.Param("regionPlatform")

		cluster := "americas"
		if platform == "euw1" || platform == "eun1" {
			cluster = "europe"
		} else if platform == "kr" || platform == "jp1" {
			cluster = "asia"
		}

		account, err := riotClient.GetAccountByRiotID(cluster, gameName, tagLine)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Account not found or Riot API error"})
			return
		}

		summoner, err := riotClient.GetSummonerByPUUID(platform, account.Puuid)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Summoner details not found"})
			return
		}

		league, _ := riotClient.GetLeagueEntries(platform, account.Puuid)

		// For apex tiers, compute the real ladder position by fetching the full league list
		ladderPosition := 0
		apexTiers := map[string]bool{"MASTER": true, "GRANDMASTER": true, "CHALLENGER": true}
		for _, entry := range league {
			if apexTiers[entry.Tier] {
				ladderPosition = riotClient.GetApexLadderPosition(platform, entry.Tier, entry.QueueType, entry.LeaguePoints)
				break
			}
		}

		c.JSON(http.StatusOK, gin.H{
			"account":        account,
			"summoner":       summoner,
			"league":         league,
			"ladderPosition": ladderPosition,
		})
	})

	r.GET("/api/summoner/:regionPlatform/:gameName/:tagLine/matches", func(c *gin.Context) {
		gameName := c.Param("gameName")
		tagLine := c.Param("tagLine")
		platform := c.Param("regionPlatform")

		cluster := "americas"
		if platform == "euw1" || platform == "eun1" || platform == "tr1" || platform == "ru" {
			cluster = "europe"
		} else if platform == "kr" || platform == "jp1" {
			cluster = "asia"
		} else if platform == "oc1" || platform == "ph2" || platform == "sg2" || platform == "th2" || platform == "tw2" || platform == "vn2" {
			cluster = "sea"
		}

		account, err := riotClient.GetAccountByRiotID(cluster, gameName, tagLine)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Account not found"})
			return
		}

		// Fetch last 5 matches initially to prevent blowing rate limit with parallel requests
		matchIds, err := riotClient.GetMatchIdsByPUUID(cluster, account.Puuid, 5)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch match list"})
			return
		}

		type matchResult struct {
			match *riot.MatchDto
			err   error
			index int
		}
		
		results := make(chan matchResult, len(matchIds))
		
		for i, matchId := range matchIds {
			go func(mId string, idx int) {
				match, err := riotClient.GetMatch(cluster, mId)
				results <- matchResult{match: match, err: err, index: idx}
			}(matchId, i)
		}

		matches := make([]*riot.MatchDto, len(matchIds))
		for i := 0; i < len(matchIds); i++ {
			res := <-results
			if res.err == nil {
				matches[res.index] = res.match
			} else {
				log.Println("Error fetching match:", res.err)
			}
		}

		var validMatches []riot.MatchDto
		for _, m := range matches {
			if m != nil {
				validMatches = append(validMatches, *m)
			}
		}

		c.JSON(http.StatusOK, validMatches)
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	
	log.Printf("Server starting on port %s", port)
	r.Run(":" + port)
}
