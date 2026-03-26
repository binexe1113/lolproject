import { notFound } from "next/navigation";
import Image from "next/image";
<<<<<<< HEAD
import { MatchCard } from "@/components/MatchCard";
=======
>>>>>>> origin/master

interface ProfilePageProps {
  params: Promise<{
    region: string;
    gameName: string;
    tagLine: string;
  }>;
}

async function getProfileData(region: string, gameName: string, tagLine: string) {
  try {
    const res = await fetch(`http://localhost:8080/api/summoner/${region}/${gameName}/${tagLine}`, {
<<<<<<< HEAD
      cache: "no-store"
=======
      next: { revalidate: 60 }
>>>>>>> origin/master
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

async function getMatchHistory(region: string, gameName: string, tagLine: string) {
  try {
    const res = await fetch(`http://localhost:8080/api/summoner/${region}/${gameName}/${tagLine}/matches`, {
<<<<<<< HEAD
      cache: "no-store"
=======
      next: { revalidate: 60 }
>>>>>>> origin/master
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const resolvedParams = await params;
  
<<<<<<< HEAD
=======
  // Fetch both profile and matches in parallel for speed
>>>>>>> origin/master
  const [data, matchesData] = await Promise.all([
    getProfileData(resolvedParams.region, resolvedParams.gameName, resolvedParams.tagLine),
    getMatchHistory(resolvedParams.region, resolvedParams.gameName, resolvedParams.tagLine)
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

<<<<<<< HEAD
  const { account, summoner, league, ladderPosition } = data;
  const iconUrl = `https://ddragon.leagueoflegends.com/cdn/14.5.1/img/profileicon/${summoner.profileIconId}.png`;
  const soloQueue = league?.find((l: any) => l.queueType === "RANKED_SOLO_5x5");

  const APEX_TIERS = ["MASTER", "GRANDMASTER", "CHALLENGER"];
  const isApex = soloQueue && APEX_TIERS.includes(soloQueue.tier.toUpperCase());
  const rankLabel = soloQueue
    ? isApex
      ? soloQueue.tier
      : `${soloQueue.tier} ${soloQueue.rank}`
    : "Unranked";

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
=======
  const { account, summoner } = data;
  const iconUrl = `https://ddragon.leagueoflegends.com/cdn/14.5.1/img/profileicon/${summoner.profileIconId}.png`;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Profile Header */}
>>>>>>> origin/master
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
<<<<<<< HEAD
            <div className="flex items-center justify-center md:justify-start gap-3 mt-4 mb-2">
               {soloQueue && (
                  <span className="px-5 py-1.5 rounded-xl bg-[#CCFF00] text-black text-sm font-black border border-[#CCFF00]/50 uppercase tracking-widest">
                    {rankLabel}
                  </span>
               )}
               <span className="px-5 py-1.5 rounded-xl bg-[#7000FF]/10 text-[#7000FF] text-sm font-bold border border-[#7000FF]/20 uppercase tracking-widest">
                  ZONE: {resolvedParams.region}
               </span>
=======
            <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
               <span className="px-5 py-1.5 rounded-xl bg-[#CCFF00]/10 text-[#CCFF00] text-sm font-bold border border-[#CCFF00]/20 uppercase tracking-widest shadow-[inset_0_0_10px_rgba(204,255,0,0.05)]">
                  ZONE: {resolvedParams.region}
               </span>
               <span className="px-5 py-1.5 rounded-xl bg-[#7000FF]/10 text-[#7000FF] text-sm font-bold border border-[#7000FF]/20 uppercase tracking-widest">
                  Ladder Rank
               </span>
>>>>>>> origin/master
            </div>
          </div>
        </div>
      </div>

<<<<<<< HEAD
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel border-[#7000FF]/30 rounded-[2rem] p-8 shadow-lg flex flex-col items-center justify-center relative overflow-hidden group h-64 sticky top-24">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#7000FF] to-transparent opacity-50"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#7000FF]/10 to-transparent"></div>
            <h3 className="text-zinc-400 font-bold tracking-widest uppercase text-sm mb-3 relative z-10">Ranqueada Solo/Duo</h3>
            <div className="text-4xl xl:text-5xl font-black text-white relative z-10 drop-shadow-md text-center capitalize mt-4">
              {rankLabel}
            </div>
            
            {soloQueue ? (
               <div className="flex flex-col items-center">
                 <p className="text-2xl text-[#CCFF00] mt-2 relative z-10 font-black uppercase tracking-wider text-center shadow-[#CCFF00]/50 drop-shadow-lg">
                   {isApex && ladderPosition > 0 ? `#${ladderPosition}` : `${soloQueue.leaguePoints} LP`}
                 </p>
                 <p className="text-xs text-zinc-500 mt-4 relative z-10 font-bold uppercase tracking-wider text-center">
                   {soloQueue.wins}W / {soloQueue.losses}L - <span className="text-[#CCFF00]">{(soloQueue.wins / ((soloQueue.wins + soloQueue.losses) || 1) * 100).toFixed(1)}%</span> WR
                 </p>
               </div>
            ) : (
               <p className="text-sm text-zinc-500 mt-2 relative z-10 font-bold uppercase tracking-wider text-center">
                 Aguardando Flex / MD5
               </p>
            )}
=======
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel border-[#7000FF]/30 rounded-[2rem] p-8 shadow-lg flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#7000FF] to-transparent opacity-50"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#7000FF]/10 to-transparent"></div>
            <h3 className="text-zinc-400 font-bold tracking-widest uppercase text-sm mb-3 relative z-10">Ranqueada Solo/Duo</h3>
            <div className="text-5xl font-black text-white relative z-10 drop-shadow-md">Unranked</div>
            <p className="text-sm text-zinc-500 mt-3 relative z-10 font-bold uppercase tracking-wider">Calibrando...</p>
>>>>>>> origin/master
        </div>
        
        <div className="glass-panel border-white/5 rounded-[2rem] p-8 md:col-span-2 relative overflow-hidden group flex flex-col items-start justify-start">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-10"></div>
<<<<<<< HEAD
            <h3 className="text-zinc-400 font-bold tracking-widest uppercase text-sm mb-6 relative z-10 w-full border-b border-white/5 pb-4">Últimas Batalhas</h3>
=======
            <h3 className="text-zinc-400 font-bold tracking-widest uppercase text-sm mb-6 relative z-10 w-full border-b border-white/5 pb-4">Últimas 5 Batalhas</h3>
>>>>>>> origin/master
            
            <div className="relative z-10 w-full h-full flex flex-col gap-3">
               {!matchesData || matchesData.length === 0 ? (
                 <div className="w-full h-32 rounded-2xl border border-white/5 bg-black/40 flex items-center justify-center">
                    <p className="text-zinc-500 font-bold uppercase tracking-wider text-sm">Nenhum registro de combate recente.</p>
                 </div>
               ) : (
                 matchesData.map((match: any, index: number) => {
<<<<<<< HEAD
                   const me = match.info.participants.find((p: any) => p.puuid === account.puuid) || match.info.participants[0];
                   return <MatchCard key={index} match={match} me={me} region={resolvedParams.region} />;
=======
                   const me = match.info.participants.find((p: any) => p.puuid === data.account.puuid) || match.info.participants[0];
                   const isWin = me.win;
                   
                   return (
                     <div key={index} className={`relative flex items-center justify-between p-4 rounded-xl border transition-all hover:scale-[1.01] ${isWin ? 'border-[#CCFF00]/30 bg-[#CCFF00]/10 shadow-[inset_0_0_20px_rgba(204,255,0,0.05)]' : 'border-[#FF0055]/30 bg-[#FF0055]/5 shadow-[inset_0_0_20px_rgba(255,0,85,0.05)]'}`}>
                        <div className="flex items-center gap-5">
                           <div className="w-14 h-14 rounded-lg bg-[#05050A] overflow-hidden relative border border-white/10 shadow-lg">
                              <Image 
                                src={`https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/${me.championName}.png`} 
                                alt={me.championName} 
                                fill 
                                className="object-cover scale-110" 
                                unoptimized
                              />
                           </div>
                           <div className="flex flex-col">
                              <span className={`font-black uppercase tracking-widest text-lg ${isWin ? 'text-[#CCFF00]' : 'text-[#FF0055]'}`}>
                                {isWin ? "VICTORY" : "DEFEAT"}
                              </span>
                              <span className="text-white font-bold tracking-wider">{me.kills} / <span className="text-zinc-500">{me.deaths}</span> / {me.assists}</span>
                           </div>
                        </div>
                        <div className="hidden sm:flex flex-col items-end">
                           <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">{match.info.gameMode}</span>
                           <span className="text-white font-black text-lg">CS: {me.totalMinionsKilled || 0}</span>
                        </div>
                     </div>
                   );
>>>>>>> origin/master
                 })
               )}
            </div>
        </div>
      </div>
    </div>
  );
}
