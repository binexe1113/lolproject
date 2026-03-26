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
<<<<<<< HEAD
		QueueId       int               `json:"queueId"`
=======
>>>>>>> origin/master
		Participants  []ParticipantDto  `json:"participants"`
	} `json:"info"`
}

<<<<<<< HEAD
type LeagueEntryDto struct {
	SummonerId   string `json:"summonerId"`
	QueueType    string `json:"queueType"`
	Tier         string `json:"tier"`
	Rank         string `json:"rank"`
	LeaguePoints int    `json:"leaguePoints"`
	Wins         int    `json:"wins"`
	Losses       int    `json:"losses"`
}

type LeagueItemDto struct {
	SummonerId   string `json:"summonerId"`
	LeaguePoints int    `json:"leaguePoints"`
}

type LeagueListDto struct {
	Entries []LeagueItemDto `json:"entries"`
}

=======
>>>>>>> origin/master
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
<<<<<<< HEAD
	TotalDamageTaken            int `json:"totalDamageTaken"`
	GoldEarned                  int `json:"goldEarned"`
	TotalMinionsKilled          int `json:"totalMinionsKilled"`
	VisionScore                 int `json:"visionScore"`
=======
	VisionScore     int    `json:"visionScore"`
>>>>>>> origin/master
}
