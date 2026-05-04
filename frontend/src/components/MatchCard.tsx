"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

function getQueueName(queueId: number | string, gameMode: string) {
  // Se o servidor backend ainda não estiver exportando o queueId, damos um fallback
  if (!queueId || Number(queueId) === 0) return gameMode === "CLASSIC" ? "Summoners Rift" : (gameMode || "Desconhecido");
  
  switch (String(queueId)) {
    case "420": return "Ranked Solo/Duo";
    case "440": return "Ranked Flex";
    case "450": return "ARAM";
    case "400": case "430": return "Normal Draft";
    case "490": return "Quickplay";
    case "1700": case "1701": return "Arena";
    default: return `Modo ${queueId}`;
  }
}

export function MatchCard({ match, me, region, patchVersion }: { match: any, me: any, region: string, patchVersion: string }) {
  const [expanded, setExpanded] = useState(false);
  const isWin = me.win;

  return (
    <div className={`relative flex flex-col rounded-xl border transition-all duration-300 ${isWin ? 'border-[#CCFF00]/30 bg-[#CCFF00]/5 shadow-[inset_0_0_20px_rgba(204,255,0,0.05)] hover:border-[#CCFF00]/60' : 'border-[#FF0055]/30 bg-[#FF0055]/5 shadow-[inset_0_0_20px_rgba(255,0,85,0.05)] hover:border-[#FF0055]/60'}`}>
      
      {/* Clickable Header for expanding */}
      <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-5">
           <div className={`w-14 h-14 rounded-lg bg-[#05050A] overflow-hidden relative border shadow-lg ${isWin ? 'border-[#CCFF00]/30' : 'border-[#FF0055]/30'}`}>
              <Image 
                src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/${me.championName}.png`} 
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
           <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-1">{getQueueName(match.info.queueId, match.info.gameMode)}</span>
           <span className="text-white font-black text-md">CS: {me.totalMinionsKilled || 0}</span>
           <span className="text-yellow-400 font-bold text-xs uppercase tracking-wider">{((me.goldEarned || 0) / 1000).toFixed(1)}k Gold</span>
           <span className="text-red-400 font-bold text-xs uppercase tracking-wider mt-1" title="Damage Dealt">Dmg: {me.totalDamageDealtToChampions || 0}</span>
           <span className="text-zinc-500 font-bold text-xs uppercase tracking-wider" title="Damage Taken">Tk: {me.totalDamageTaken || 0}</span>
        </div>
      </div>

      {/* Expanded Match Detail Plate */}
      {expanded && (
        <div className="border-t border-white/10 p-5 bg-[#030305]/80 rounded-b-xl backdrop-blur-md">
           <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">Integrantes da Partida</h4>
           <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              <div className="flex flex-col gap-2">
                 {match.info.participants.slice(0, 5).map((p: any, i: number) => (
                    <Link key={i} href={`/profile/${region}/${p.riotIdGameName}/${p.riotIdTagline}`} className="flex items-center gap-3 hover:bg-white/5 p-1.5 rounded-lg transition-colors group">
                       <div className={`w-7 h-7 relative rounded border ${p.win ? 'border-[#CCFF00]/40' : 'border-[#FF0055]/40'} overflow-hidden`}>
                          <Image src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/${p.championName}.png`} alt={p.championName} fill className="object-cover scale-110" unoptimized />
                       </div>
                       <span className={`text-sm font-bold truncate tracking-wide ${p.puuid === me.puuid ? 'text-white' : 'text-zinc-400'} group-hover:text-[#CCFF00]`}>
                         {p.riotIdGameName}
                       </span>
                    </Link>
                 ))}
              </div>
              <div className="flex flex-col gap-2">
                 {match.info.participants.slice(5, 10).map((p: any, i: number) => (
                    <Link key={i} href={`/profile/${region}/${p.riotIdGameName}/${p.riotIdTagline}`} className="flex items-center gap-3 justify-end hover:bg-white/5 p-1.5 rounded-lg transition-colors group">
                       <span className={`text-sm font-bold truncate tracking-wide text-right ${p.puuid === me.puuid ? 'text-white' : 'text-zinc-400'} group-hover:text-[#FF0055]`}>
                         {p.riotIdGameName}
                       </span>
                       <div className={`w-7 h-7 relative rounded border ${p.win ? 'border-[#CCFF00]/40' : 'border-[#FF0055]/40'} overflow-hidden`}>
                          <Image src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/${p.championName}.png`} alt={p.championName} fill className="object-cover scale-110" unoptimized />
                       </div>
                    </Link>
                 ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
