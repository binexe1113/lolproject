package riot

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"
)

type Client struct {
	apiKey     string
	httpClient *http.Client
}

func NewClient(apiKey string) *Client {
	return &Client{
		apiKey: apiKey,
		httpClient: &http.Client{
			// Simple timeout to prevent hanging requests
			Timeout: 10 * time.Second,
		},
	}
}

func (c *Client) newRequest(method, url string) (*http.Request, error) {
	req, err := http.NewRequest(method, url, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("X-Riot-Token", c.apiKey)
	return req, nil
}

func (c *Client) GetAccountByRiotID(cluster string, gameName, tagLine string) (*AccountDto, error) {
	url := fmt.Sprintf("https://%s.api.riotgames.com/riot/account/v1/accounts/by-riot-id/%s/%s", cluster, gameName, tagLine)
	
	req, err := c.newRequest("GET", url)
	if err != nil {
		return nil, err
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("Riot API error (Account): status code %d", resp.StatusCode)
	}

	var account AccountDto
	if err := json.NewDecoder(resp.Body).Decode(&account); err != nil {
		return nil, err
	}

	return &account, nil
}

func (c *Client) GetSummonerByPUUID(platform string, puuid string) (*SummonerDto, error) {
	url := fmt.Sprintf("https://%s.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/%s", platform, puuid)
	
	req, err := c.newRequest("GET", url)
	if err != nil {
		return nil, err
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("Riot API error (Summoner): status code %d", resp.StatusCode)
	}

	var summoner SummonerDto
	if err := json.NewDecoder(resp.Body).Decode(&summoner); err != nil {
		return nil, err
	}

	return &summoner, nil
}

func (c *Client) GetMatchIdsByPUUID(cluster string, puuid string, count int) ([]string, error) {
	url := fmt.Sprintf("https://%s.api.riotgames.com/lol/match/v5/matches/by-puuid/%s/ids?start=0&count=%d", cluster, puuid, count)
	
	req, err := c.newRequest("GET", url)
	if err != nil {
		return nil, err
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("Riot API error (MatchIDs): status code %d", resp.StatusCode)
	}

	var matchIds []string
	if err := json.NewDecoder(resp.Body).Decode(&matchIds); err != nil {
		return nil, err
	}

	return matchIds, nil
}

func (c *Client) GetMatch(cluster string, matchId string) (*MatchDto, error) {
	url := fmt.Sprintf("https://%s.api.riotgames.com/lol/match/v5/matches/%s", cluster, matchId)
	
	req, err := c.newRequest("GET", url)
	if err != nil {
		return nil, err
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("Riot API error (Match): status code %d", resp.StatusCode)
	}

	var match MatchDto
	if err := json.NewDecoder(resp.Body).Decode(&match); err != nil {
		return nil, err
	}

	return &match, nil
}

func (c *Client) GetLeagueEntries(platform string, puuid string) ([]LeagueEntryDto, error) {
	url := fmt.Sprintf("https://%s.api.riotgames.com/lol/league/v4/entries/by-puuid/%s", platform, puuid)
	
	req, err := c.newRequest("GET", url)
	if err != nil {
		return nil, err
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("Riot API error (League by-puuid): status code %d", resp.StatusCode)
	}

	var entries []LeagueEntryDto
	if err := json.NewDecoder(resp.Body).Decode(&entries); err != nil {
		return nil, err
	}

	return entries, nil
}

// getLeagueSize fetches an apex league and returns the total number of entries.
func (c *Client) getLeagueSize(platform, segment, queue string) int {
	url := fmt.Sprintf("https://%s.api.riotgames.com/lol/league/v4/%s/by-queue/%s", platform, segment, queue)
	req, err := c.newRequest("GET", url)
	if err != nil {
		return 0
	}
	resp, err := c.httpClient.Do(req)
	if err != nil || resp.StatusCode != http.StatusOK {
		return 0
	}
	defer resp.Body.Close()
	var list LeagueListDto
	if err := json.NewDecoder(resp.Body).Decode(&list); err != nil {
		return 0
	}
	return len(list.Entries)
}

// GetApexLadderPosition returns the approximate global 1-based ladder position for an apex player.
// It counts players in higher tiers (Challenger > Grandmaster > Master) as an offset, then
// adds the in-tier position counted by LP.
func (c *Client) GetApexLadderPosition(platform, tier, queueType string, leaguePoints int) int {
	tierUpper := strings.ToUpper(tier)

	queue := "RANKED_SOLO_5x5"
	if queueType != "" {
		queue = queueType
	}

	// Fetch the player's own tier league
	var segment string
	switch tierUpper {
	case "CHALLENGER":
		segment = "challengerleagues"
	case "GRANDMASTER":
		segment = "grandmasterleagues"
	case "MASTER":
		segment = "masterleagues"
	default:
		return 0
	}

	url := fmt.Sprintf("https://%s.api.riotgames.com/lol/league/v4/%s/by-queue/%s", platform, segment, queue)
	req, err := c.newRequest("GET", url)
	if err != nil {
		return 0
	}
	resp, err := c.httpClient.Do(req)
	if err != nil || resp.StatusCode != http.StatusOK {
		return 0
	}
	defer resp.Body.Close()

	var leagueList LeagueListDto
	if err := json.NewDecoder(resp.Body).Decode(&leagueList); err != nil {
		return 0
	}

	// Count players in this tier with more LP — this is the in-tier position
	inTierPosition := 1
	for _, entry := range leagueList.Entries {
		if entry.LeaguePoints > leaguePoints {
			inTierPosition++
		}
	}

	// Add offset for all players in tiers above this one
	offset := 0
	switch tierUpper {
	case "GRANDMASTER":
		offset = c.getLeagueSize(platform, "challengerleagues", queue)
	case "MASTER":
		offset += c.getLeagueSize(platform, "challengerleagues", queue)
		offset += c.getLeagueSize(platform, "grandmasterleagues", queue)
	}

	return offset + inTierPosition
}
