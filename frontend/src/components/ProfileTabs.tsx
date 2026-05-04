"use client";

import { useState } from "react";
import Image from "next/image";
import { MatchCard } from "@/components/MatchCard";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ProfileTabsProps {
  matchesData: any[];
  accountPuuid: string;
  region: string;
  patchVersion: string;
}

interface MatchupStat {
  enemyName: string;
  games: number;
  wins: number;
  kills: number;
  deaths: number;
  assists: number;
}

interface ChampStat {
  name: string;
  games: number;
  wins: number;
  kills: number;
  deaths: number;
  assists: number;
  matchups: Record<string, MatchupStat>;
}

export function ProfileTabs({ matchesData, accountPuuid, region, patchVersion }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<"history" | "champions">("history");
  const [expandedChamp, setExpandedChamp] = useState<string | null>(null);

  // Compute stats
  const champStats: Record<string, ChampStat> = {};

  if (matchesData && matchesData.length > 0) {
    matchesData.forEach((match: any) => {
      const me = match.info.participants.find((p: any) => p.puuid === accountPuuid) || match.info.participants[0];
      
      // Find direct lane opponent
      const enemy = match.info.participants.find((p: any) => 
        p.teamId !== me.teamId && 
        p.teamPosition === me.teamPosition && 
        p.teamPosition !== ""
      );

      if (!champStats[me.championName]) {
        champStats[me.championName] = { 
          name: me.championName, 
          games: 0, wins: 0, kills: 0, deaths: 0, assists: 0, 
          matchups: {} 
        };
      }
      const st = champStats[me.championName];
      st.games++;
      if (me.win) st.wins++;
      st.kills += me.kills;
      st.deaths += me.deaths;
      st.assists += me.assists;

      // Log matchup if opponent found
      if (enemy) {
        if (!st.matchups[enemy.championName]) {
          st.matchups[enemy.championName] = {
            enemyName: enemy.championName,
            games: 0, wins: 0, kills: 0, deaths: 0, assists: 0
          };
        }
        const m = st.matchups[enemy.championName];
        m.games++;
        if (me.win) m.wins++;
        m.kills += me.kills;
        m.deaths += me.deaths;
        m.assists += me.assists;
      }
    });
  }

  const sortedChamps = Object.values(champStats).sort((a, b) => b.games - a.games || (b.wins/b.games) - (a.wins/a.games));

  return (
    <div className="glass-panel border-white/5 rounded-[2rem] p-8 md:col-span-2 relative overflow-hidden group flex flex-col items-start justify-start w-full">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-10"></div>
      
      {/* Tabs Header */}
      <div className="flex w-full border-b border-white/5 mb-6">
        <button 
          onClick={() => setActiveTab("history")}
          className={`flex-1 py-4 text-center font-bold tracking-widest uppercase text-sm transition-all ${activeTab === "history" ? "text-[#CCFF00] border-b-2 border-[#CCFF00]" : "text-zinc-500 hover:text-white"}`}
        >
          Últimas Batalhas ({matchesData.length})
        </button>
        <button 
          onClick={() => setActiveTab("champions")}
          className={`flex-1 py-4 text-center font-bold tracking-widest uppercase text-sm transition-all ${activeTab === "champions" ? "text-[#CCFF00] border-b-2 border-[#CCFF00]" : "text-zinc-500 hover:text-white"}`}
        >
          Progresso por Campeão
        </button>
      </div>

      <div className="relative z-10 w-full h-full flex flex-col gap-3">
        {activeTab === "history" && (
          <>
            {!matchesData || matchesData.length === 0 ? (
              <div className="w-full h-32 rounded-2xl border border-white/5 bg-black/40 flex items-center justify-center">
                 <p className="text-zinc-500 font-bold uppercase tracking-wider text-sm">Nenhum registro de combate recente.</p>
              </div>
            ) : (
              matchesData.map((match: any, index: number) => {
                const me = match.info.participants.find((p: any) => p.puuid === accountPuuid) || match.info.participants[0];
                return <MatchCard key={index} match={match} me={me} region={region} patchVersion={patchVersion} />;
              })
            )}
          </>
        )}

        {activeTab === "champions" && (
          <div className="flex flex-col gap-4 w-full">
            {sortedChamps.length === 0 ? (
              <div className="w-full h-32 rounded-2xl border border-white/5 bg-black/40 flex items-center justify-center">
                 <p className="text-zinc-500 font-bold uppercase tracking-wider text-sm">Nenhum campeão registrado nessas partidas.</p>
              </div>
            ) : (
              sortedChamps.map((c, idx) => {
                const wr = (c.wins / c.games) * 100;
                const kda = ((c.kills + c.assists) / (c.deaths || 1)).toFixed(2);
                let wrColor = "text-white";
                if (wr > 55) wrColor = "text-[#CCFF00]";
                else if (wr < 45) wrColor = "text-[#FF0055]";

                const isExpanded = expandedChamp === c.name;
                const sortedMatchups = Object.values(c.matchups).sort((a, b) => b.games - a.games);

                return (
                  <div key={idx} className="flex flex-col bg-black/40 border border-white/5 rounded-2xl overflow-hidden transition-all duration-300">
                    {/* Champion Row Header */}
                    <div 
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5"
                      onClick={() => setExpandedChamp(isExpanded ? null : c.name)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden relative border border-white/10 shrink-0 shadow-lg">
                          <Image 
                            src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/${c.name}.png`} 
                            alt={c.name} 
                            fill 
                            className="object-cover scale-110" 
                            unoptimized
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-white uppercase tracking-wider">{c.name}</span>
                          <span className="text-xs text-zinc-500 font-bold uppercase">{c.games} Play{c.games !== 1 ? 's' : ''}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 sm:gap-12">
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-zinc-500 font-bold uppercase mb-1">KDA</span>
                          <span className="text-white font-bold">{kda}</span>
                        </div>

                        <div className="flex flex-col items-center min-w-[3rem]">
                          <span className="text-xs text-zinc-500 font-bold uppercase mb-1">WR</span>
                          <span className={`font-black ${wrColor}`}>{wr.toFixed(0)}%</span>
                        </div>
                        
                        <div className="text-zinc-500">
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                      </div>
                    </div>

                    {/* Matchups Dropdown */}
                    {isExpanded && (
                      <div className="bg-[#0A0A0F] border-t border-white/5 p-4 flex flex-col gap-3">
                        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-2">Confrontos (Matchups)</h4>
                        {sortedMatchups.length === 0 ? (
                           <p className="text-xs text-zinc-600 font-bold pl-2">Sem dados de rota definidos (ex: ARAM).</p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {sortedMatchups.map((m, mIdx) => {
                              const mWr = (m.wins / m.games) * 100;
                              const mKda = ((m.kills + m.assists) / (m.deaths || 1)).toFixed(2);
                              let mWrColor = "text-white";
                              if (mWr > 55) mWrColor = "text-[#CCFF00]";
                              else if (mWr < 45) mWrColor = "text-[#FF0055]";

                              return (
                                <div key={mIdx} className="flex items-center gap-3 bg-black/50 border border-white/5 p-3 rounded-xl border-l-[3px] border-l-[#7000FF]/50 hover:border-l-[#CCFF00] transition-colors">
                                  <div className="w-8 h-8 rounded-md overflow-hidden relative shrink-0 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all">
                                    <Image 
                                      src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/${m.enemyName}.png`} 
                                      alt={m.enemyName} 
                                      fill 
                                      className="object-cover scale-110" 
                                      unoptimized
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                      <span className="text-xs font-bold text-zinc-300 uppercase truncate pr-2">VS {m.enemyName}</span>
                                      <span className={`text-xs font-black ${mWrColor}`}>{m.wins}W {m.games - m.wins}L</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="text-[10px] text-zinc-500 font-bold uppercase">{m.games} Games</span>
                                      <span className="text-[10px] text-zinc-400 font-bold">{mKda} KDA</span>
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
