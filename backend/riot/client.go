package riot

import (
	"encoding/json"
	"fmt"
	"net/http"
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
