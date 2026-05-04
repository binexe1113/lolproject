import Image from "next/image";
import { MatchCard } from "@/components/MatchCard";
import { ProfileTabs } from "@/components/ProfileTabs";

interface ProfilePageProps {
  params: Promise<{
    region: string;
    gameName: string;
    tagLine: string;
  }>;
}

async function getProfileData(region: string, gameName: string, tagLine: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  try {
    const res = await fetch(`${baseUrl}/api/summoner/${region}/${gameName}/${tagLine}`, {
      cache: "no-store"
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

async function getMatchHistory(region: string, gameName: string, tagLine: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  try {
    const res = await fetch(`${baseUrl}/api/summoner/${region}/${gameName}/${tagLine}/matches`, {
      cache: "no-store"
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

async function getLatestPatch() {
  try {
    const res = await fetch("https://ddragon.leagueoflegends.com/api/versions.json", {
      next: { revalidate: 3600 }
    });
    const versions = await res.json();
    return versions[0] || "15.5.1";
  } catch (error) {
    return "15.5.1";
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const resolvedParams = await params;
  
  const [data, matchesData, patchVersion] = await Promise.all([
    getProfileData(resolvedParams.region, resolvedParams.gameName, resolvedParams.tagLine),
    getMatchHistory(resolvedParams.region, resolvedParams.gameName, resolvedParams.tagLine),
    getLatestPatch()
  ]);
  
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-4 text-center">
        <div className="glass-panel p-12 rounded-[2rem] max-w-lg border border-[#FF0055]/30 shadow-[0_0_50px_rgba(255,0,85,0.1)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF0055] to-transparent"></div>
          <h1 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">Target Not Found</h1>
          <p className="text-zinc-400 text-lg mb-8 font-medium">O Riot ID <br/><strong className="text-white">Nome#Tag</strong> não foi localizado no servidor.</p>
          <a href="/" className="inline-flex px-8 py-4 bg-gradient-to-r from-[#CCFF00] to-[#88FF00] text-black rounded-2xl font-black uppercase tracking-widest transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(204,255,0,0.3)]">
            Voltar para o Analyzer
          </a>
        </div>
      </div>
    );
  }

  const { account, summoner, league, ladderPosition } = data;
  const iconUrl = `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/profileicon/${summoner.profileIconId}.png`;
  const soloQueue = league?.find((l: any) => l.queueType === "RANKED_SOLO_5x5");

  const APEX_TIERS = ["MASTER", "GRANDMASTER", "CHALLENGER"];
  const isApex = soloQueue && APEX_TIERS.includes(soloQueue.tier.toUpperCase());
  const rankLabel = soloQueue
    ? isApex
      ? soloQueue.tier
      : `${soloQueue.tier} ${soloQueue.rank}`
    : "Unranked";

  let wr = 0;
  let wrColor = "text-white";
  if (soloQueue) {
    wr = (soloQueue.wins / ((soloQueue.wins + soloQueue.losses) || 1)) * 100;
    if (wr > 55) wrColor = "text-[#CCFF00]";
    else if (wr < 45) wrColor = "text-[#FF0055]";
  }

  // Compute Top Champions
  const champStats: Record<string, { name: string, games: number, wins: number, kills: number, deaths: number, assists: number }> = {};
  if (matchesData && matchesData.length > 0) {
    matchesData.forEach((match: any) => {
      const me = match.info.participants.find((p: any) => p.puuid === account.puuid) || match.info.participants[0];
      if (!champStats[me.championId]) {
        champStats[me.championId] = { name: me.championName, games: 0, wins: 0, kills: 0, deaths: 0, assists: 0 };
      }
      const st = champStats[me.championId];
      st.games++;
      if (me.win) st.wins++;
      st.kills += me.kills;
      st.deaths += me.deaths;
      st.assists += me.assists;
    });
  }
  const topChamps = Object.values(champStats)
    .sort((a, b) => b.games - a.games || (b.wins/b.games) - (a.wins/a.games))
    .slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="relative overflow-hidden rounded-[2rem] glass-panel p-8 md:p-12 mb-8 group">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00E5FF]/5 to-[#7B2CBF]/5 pointer-events-none"></div>
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#CCFF00]/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
        
        <div className="relative flex flex-col md:flex-row items-center md:items-start gap-10 z-10">
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[1.5rem] overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative z-10 group-hover:scale-105 transition-transform duration-700 ease-out">
              <Image src={iconUrl} alt="Profile Icon" fill className="object-cover" unoptimized />
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#05050A] text-[#CCFF00] text-sm font-black px-5 py-1.5 rounded-full border border-[#CCFF00]/40 shadow-[0_0_15px_rgba(204,255,0,0.2)] z-20 tracking-wider">
              LVL {summoner.summonerLevel}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-3 mt-4 md:mt-2">
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight flex flex-wrap items-baseline justify-center md:justify-start gap-x-2 gap-y-1 uppercase font-[family-name:var(--font-syncopate)]">
              {account.gameName}
              <span className="text-3xl text-zinc-600 font-bold tracking-normal">#{account.tagLine}</span>
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-3 mt-4 mb-2">
               {soloQueue && (
                  <span className="px-5 py-1.5 rounded-xl bg-[#CCFF00] text-black text-sm font-black border border-[#CCFF00]/50 uppercase tracking-widest">
                    {rankLabel}
                  </span>
               )}
               <span className="px-5 py-1.5 rounded-xl bg-[#7000FF]/10 text-[#7000FF] text-sm font-bold border border-[#7000FF]/20 uppercase tracking-widest">
                  ZONE: {resolvedParams.region}
               </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col gap-6 sticky top-24 self-start">
          <div className="glass-panel border-[#7000FF]/30 rounded-[2rem] p-8 shadow-lg flex flex-col items-center justify-center relative overflow-hidden group min-h-[16rem]">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#7000FF] to-transparent opacity-50"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#7000FF]/10 to-transparent"></div>
              <h3 className="text-zinc-400 font-bold tracking-widest uppercase text-sm mb-2 relative z-10">Ranqueada Solo/Duo</h3>

              {soloQueue && (
                 <div className="relative w-32 h-32 mt-2 mb-2 z-10 drop-shadow-xl hover:scale-105 transition-transform duration-500">
                   <Image 
                     src={`https://opgg-static.akamaized.net/images/medals_new/${soloQueue.tier.toLowerCase()}.png`} 
                     alt={soloQueue.tier} 
                     fill 
                     className="object-contain drop-shadow-[0_0_15px_rgba(112,0,255,0.4)]" 
                     unoptimized 
                   />
                 </div>
              )}
              
              <div className="text-3xl xl:text-4xl font-black text-white relative z-10 drop-shadow-md text-center capitalize">
                {rankLabel}
              </div>
              
              {soloQueue ? (
                 <div className="flex flex-col items-center mt-2 w-full">
                   <p className="text-2xl text-[#CCFF00] relative z-10 font-black uppercase tracking-wider text-center shadow-[#CCFF00]/50 drop-shadow-lg">
                     {soloQueue.leaguePoints} LP
                   </p>
                   {isApex && ladderPosition > 0 && (
                     <p className="text-sm text-zinc-300 mt-1 relative z-10 font-bold uppercase tracking-wider text-center">
                       Rank #{ladderPosition}
                     </p>
                   )}
                   <div className="mt-4 pt-4 border-t border-white/10 w-full flex flex-col items-center justify-center relative z-10 mt-4 relative z-10 font-bold uppercase tracking-wider text-center">
                     <p className="text-sm text-zinc-400 mb-1">
                       {soloQueue.wins}W / {soloQueue.losses}L
                     </p>
                     <p className={`text-lg font-black ${wrColor}`}>
                       {wr.toFixed(1)}% WR
                     </p>
                   </div>
                 </div>
              ) : (
                 <p className="text-sm text-zinc-500 mt-4 relative z-10 font-bold uppercase tracking-wider text-center">
                   Aguardando Flex / MD5
                 </p>
              )}
          </div>

          <div className="glass-panel border-white/5 rounded-[2rem] p-6 shadow-lg flex flex-col items-start relative overflow-hidden group">
            <h3 className="text-zinc-400 font-bold tracking-widest uppercase text-sm mb-4 relative z-10 w-full border-b border-white/5 pb-3">Campeões Mais Jogados</h3>
            <div className="w-full flex flex-col gap-3 relative z-10">
              {topChamps.length > 0 ? topChamps.map((c, i) => {
                const champWr = (c.wins / c.games) * 100;
                let cColor = "text-white";
                if (champWr > 55) cColor = "text-[#CCFF00]";
                else if (champWr < 45) cColor = "text-[#FF0055]";
                const kda = ((c.kills + c.assists) / (c.deaths || 1)).toFixed(2);
                
                return (
                  <div key={i} className="flex items-center gap-3 bg-black/40 border border-white/5 p-3 rounded-xl">
                    <div className="w-10 h-10 rounded-lg overflow-hidden relative border border-white/10 shrink-0">
                      <Image 
                        src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/${c.name}.png`} 
                        alt={c.name} 
                        fill 
                        className="object-cover scale-110" 
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <p className="font-bold text-white text-sm truncate">{c.name}</p>
                        <p className={`font-black text-sm ${cColor}`}>{champWr.toFixed(0)}%</p>
                      </div>
                      <div className="flex justify-between items-center text-xs text-zinc-500 font-bold uppercase">
                        <span>{c.games} Play{c.games !== 1 ? 's' : ''}</span>
                        <span>{kda} KDA</span>
                      </div>
                    </div>
                  </div>
                )
              }) : (
                <div className="text-center py-4 text-zinc-600 text-xs font-bold uppercase">Sem dados suficientes</div>
              )}
            </div>
          </div>
        </div>
        
        <ProfileTabs 
          matchesData={matchesData} 
          accountPuuid={account.puuid} 
          region={resolvedParams.region} 
          patchVersion={patchVersion}
        />
      </div>
    </div>
  );
}
