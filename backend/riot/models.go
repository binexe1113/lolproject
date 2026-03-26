package riot

type AccountDto struct {
	Puuid    string `json:"puuid"`
	GameName string `json:"gameName"`
	TagLine  string `json:"tagLine"`
}

type SummonerDto struct {
	AccountId     string `json:"accountId"`
	ProfileIconId int    `json:"profileIconId"`
	RevisionDate  int64  `json:"revisionDate"`
	Id            string `json:"id"`
	Puuid         string `json:"puuid"`
	SummonerLevel int    `json:"summonerLevel"`
}

type MatchDto struct {
	Metadata struct {
		MatchId      string   `json:"matchId"`
		Participants []string `json:"participants"`
	} `json:"metadata"`
	Info struct {
		GameCreation  int64             `json:"gameCreation"`
		GameDuration  int64             `json:"gameDuration"`
		GameMode      string            `json:"gameMode"`
		Participants  []ParticipantDto  `json:"participants"`
	} `json:"info"`
}

type ParticipantDto struct {
	Puuid           string `json:"puuid"`
	RiotIdGameName  string `json:"riotIdGameName"`
	RiotIdTagline   string `json:"riotIdTagline"`
	ChampionName    string `json:"championName"`
	ChampionId      int    `json:"championId"`
	Kills           int    `json:"kills"`
	Deaths          int    `json:"deaths"`
	Assists         int    `json:"assists"`
	Win             bool   `json:"win"`
	Item0           int    `json:"item0"`
	Item1           int    `json:"item1"`
	Item2           int    `json:"item2"`
	Item3           int    `json:"item3"`
	Item4           int    `json:"item4"`
	Item5           int    `json:"item5"`
	Item6           int    `json:"item6"`
	TotalDamageDealtToChampions int `json:"totalDamageDealtToChampions"`
	VisionScore     int    `json:"visionScore"`
}
