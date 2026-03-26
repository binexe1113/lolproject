"use client";

import { useState, useEffect } from "react";

const WORDS = ["DECONSTRUCT", "DOMINATE", "DEEPEN", "DISCOVER"];
import { Search, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Home() {
  const [riotId, setRiotId] = useState("");
  const [region, setRegion] = useState("br1");
  const router = useRouter();

  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    const handleType = () => {
      const i = loopNum % WORDS.length;
      const fullText = WORDS[i];

      setText(
        isDeleting
          ? fullText.substring(0, text.length - 1)
          : fullText.substring(0, text.length + 1)
      );

      setTypingSpeed(isDeleting ? 40 : 100);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum((prev) => prev + 1);
        setTypingSpeed(400);
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!riotId.includes("#")) {
      alert("Formato inválido. Use Nome#Tag (ex: Kami#BR1)");
      return;
    }
    const [name, tag] = riotId.split("#");
    router.push(`/profile/${region}/${name}/${tag}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] px-4 relative">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-5xl flex flex-col items-center text-center space-y-16 z-10"
      >
        <div className="space-y-8 relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 px-6 py-2 bg-[#CCFF00]/10 border border-[#CCFF00]/30 text-[#CCFF00] text-xs font-bold uppercase tracking-[0.3em]"
          >
            <Flame size={14} className="text-[#CCFF00]" />
            Data Analytics Protocol
          </motion.div>

          <h1 className={`text-5xl md:text-8xl lg:text-9xl font-black uppercase tracking-[0.02em] text-white leading-[1.1] font-[family-name:var(--font-syncopate)] flex flex-col md:block min-h-[140px] md:min-h-auto`}>
            <span className="inline-block min-w-[20px] border-r-[0.1em] border-[#CCFF00] pr-1 md:pr-2 mr-2 md:mr-0">
              {text}
            </span>
            <br className="hidden md:block"/>
            <span className="text-gradient">The Meta.</span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto font-light">
            Não jogue no escuro. Receba insights agressivos e métricas absolutas para destruir o Nexus inimigo. 
          </p>
        </div>

        <form onSubmit={handleSearch} className="w-full max-w-4xl relative group">
          <div className="absolute -inset-2 bg-[#CCFF00]/20 blur-2xl rounded-sm opacity-0 group-hover:opacity-100 transition duration-500"></div>
          
          <div className="relative flex flex-col md:flex-row items-center bg-[#07070A] border-2 border-white/5 p-2 gap-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="w-full md:w-auto">
              <select 
                className="w-full md:w-32 bg-[#101015] text-[#CCFF00] py-5 px-6 font-bold text-lg outline-none hover:bg-[#1A1A24] transition-colors cursor-pointer appearance-none border-r border-white/5 uppercase tracking-wider"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              >
                <option value="br1">BR</option>
                <option value="na1">NA</option>
                <option value="euw1">EUW</option>
                <option value="kr">KR</option>
              </select>
            </div>
            
            <input
              type="text"
              placeholder="RIOT ID#TAG"
              value={riotId}
              onChange={(e) => setRiotId(e.target.value)}
              className="flex-1 w-full bg-transparent py-5 px-8 text-3xl outline-none placeholder:text-zinc-700 font-bold text-white uppercase tracking-wider"
            />
            
            <button 
              type="submit"
              className="w-full md:w-auto px-12 py-5 bg-[#CCFF00] text-black font-black text-xl hover:bg-white flex items-center justify-center gap-4 transition-all uppercase tracking-[0.2em]"
            >
              Analyze
              <Search className="w-6 h-6 stroke-[3]" />
            </button>
          </div>
        </form>
        
        <div className="flex flex-wrap justify-center items-center gap-6 text-xs font-bold text-zinc-600 uppercase tracking-widest pt-8">
          <span>Targets:</span>
          <button type="button" onClick={() => { setRiotId("Faker#KR1"); setRegion("kr"); }} className="text-white hover:text-[#CCFF00] transition-colors">FAKER#KR1</button>
          <span className="w-1 h-1 bg-[#CCFF00]"></span>
          <button type="button" onClick={() => { setRiotId("Kami#BR1"); setRegion("br1"); }} className="text-white hover:text-[#CCFF00] transition-colors">KAMI#BR1</button>
        </div>
      </motion.div>
    </div>
  );
}
