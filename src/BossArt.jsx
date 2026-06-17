import React from "react";

// ============================================================
// BOSS ART — six shaded dark-fantasy bosses, palette-driven.
// blood/ash/spectral free; gilded/void are Slayer's Guild.
// ============================================================

export const PALETTES = {
  blood:    { label: "Blood",    free: true,  body1:"#7a1a22", body2:"#4a0e14", body3:"#220609", fin:"#2a0a0c", finS:"#5a1018", dark:"#160406", glow:"#ff6b35", glowA:"#ffd966", glowB:"#ff8a3a", glowC:"#c83018", bone:"#d8ccb4", bone2:"#b8ac94", metal:"#c8a030", metalDark:"#6a5210", scar:"#7a4a42", scar2:"#c86850", horn:"#2a1d16", horn2:"#1e140e", hi:"#8a2028", hi2:"#8a2a32", belly:"#b8884a", ash:"#8a7f72", pupil:"#120304" },
  ash:      { label: "Ash",      free: true,  body1:"#6a665e", body2:"#46423a", body3:"#2a2824", fin:"#34322c", finS:"#56524a", dark:"#16150f", glow:"#d8d2c0", glowA:"#f0ecd8", glowB:"#e8e2cc", glowC:"#b8b2a0", bone:"#e0dccc", bone2:"#c0bcae", metal:"#9a9282", metalDark:"#5a5448", scar:"#8a857a", scar2:"#a8a290", horn:"#34302a", horn2:"#26231e", hi:"#7a766c", hi2:"#8a857a", belly:"#b0aa98", ash:"#9a958a", pupil:"#0e0d0b" },
  spectral: { label: "Spectral", free: true,  body1:"#1a6a5a", body2:"#104a40", body3:"#082822", fin:"#0c3028", finS:"#1a5a4a", dark:"#05140f", glow:"#5ee8c0", glowA:"#aef0dc", glowB:"#7eecc8", glowC:"#2eb898", bone:"#bde8da", bone2:"#9cc8ba", metal:"#3a9a82", metalDark:"#206a56", scar:"#2a8a72", scar2:"#4aa890", horn:"#0e2e26", horn2:"#0a201a", hi:"#1a7a64", hi2:"#2a8a72", belly:"#7ab8a6", ash:"#6aa896", pupil:"#03100c" },
  gilded:   { label: "Gilded",   free: false, body1:"#9a7d1e", body2:"#6a5210", body3:"#3a2d08", fin:"#43340c", finS:"#7a5d12", dark:"#1c1404", glow:"#ffd966", glowA:"#fff0b8", glowB:"#ffe07a", glowC:"#d4af37", bone:"#f0e6c8", bone2:"#d0c6a8", metal:"#ffd966", metalDark:"#9a7d1e", scar:"#b89440", scar2:"#d4b050", horn:"#43340c", horn2:"#32270a", hi:"#b8902a", hi2:"#c8a030", belly:"#e0c870", ash:"#c8b276", pupil:"#140e02" },
  void:     { label: "Void",     free: false, body1:"#5a2a98", body2:"#3a1a68", body3:"#1e0e40", fin:"#281452", finS:"#4a2480", dark:"#0e0620", glow:"#b06aff", glowA:"#d8b0ff", glowB:"#c490ff", glowC:"#8a4ad8", bone:"#cab8e8", bone2:"#a892c8", metal:"#9a6ad8", metalDark:"#4e3280", scar:"#6a4aa0", scar2:"#8a5ac0", horn:"#1c1034", horn2:"#140a26", hi:"#6a3aa8", hi2:"#7a4ab8", belly:"#b890e0", ash:"#8a76b0", pupil:"#08041a" },
};

export const FREE_SKINS = Object.keys(PALETTES).filter((k) => PALETTES[k].free);

function Usurer({ p }) {
  return (
    <g>
<defs>
    <linearGradient id="uub" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor={p.body1}/><stop offset="50%" stopColor={p.body2}/><stop offset="100%" stopColor={p.body3}/>
    </linearGradient>
    <radialGradient id="uueye" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor={p.glowA}/><stop offset="45%" stopColor={p.glowB}/><stop offset="100%" stopColor={p.glowC}/>
    </radialGradient>
    <radialGradient id="uucoin" cx="40%" cy="35%" r="70%">
      <stop offset="0%" stopColor="#ffe9a0"/><stop offset="55%" stopColor="#d4af37"/><stop offset="100%" stopColor="#8a6d1e"/>
    </radialGradient>
    <linearGradient id="uushade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#000" stopOpacity="0.4"/><stop offset="100%" stopColor="#000" stopOpacity="0"/>
    </linearGradient>
  </defs>

  <ellipse cx="100" cy="170" rx="58" ry="9" fill="#000" opacity="0.5"/>

  
  <path d="M 124 60 C 152 72 162 96 152 116 C 142 136 114 142 94 132 C 74 122 58 128 52 144 C 47 158 58 170 74 170"
        fill="none" stroke="url(#uub)" strokeWidth="21" strokeLinecap="round"/>
  
  <path d="M 124 60 C 152 72 162 96 152 116 C 142 136 114 142 94 132"
        fill="none" stroke={p.belly} strokeWidth="6" strokeLinecap="round" strokeDasharray="3 4" opacity="0.55"/>
  
  <path d="M 94 132 C 74 122 58 128 52 144 C 47 158 58 170 74 170"
        fill="none" stroke={p.dark} strokeWidth="8" strokeLinecap="round" opacity="0.4"/>
  <path d="M 74 170 C 86 170 94 162 90 152" fill="none" stroke={p.body3} strokeWidth="11" strokeLinecap="round"/>

  
  <path d="M 134 70 L 150 54 L 147 70 L 165 62 L 156 80 L 172 80 L 158 94 L 170 104 L 154 104 L 160 118 L 144 112"
        fill={p.fin} stroke={p.finS} strokeWidth="1.2"/>
  <path d="M 134 70 L 150 54 L 147 70 L 158 66 L 150 80 Z" fill={p.body2} opacity="0.8"/>

  
  <g stroke="#1a0507" strokeWidth="1.6" opacity="0.85"><path d="M 138 90 l 8 9"/><path d="M 143 88 l 8 9"/><path d="M 110 132 l 8 -8"/></g>
  <g stroke={p.scar2} strokeWidth="0.7" opacity="0.6"><path d="M 139 89 l 8 9"/><path d="M 111 131 l 8 -8"/></g>

  
  <g>
    <path d="M 128 62 C 112 56 104 44 110 32 C 115 24 130 22 142 28 C 154 35 158 48 150 56 C 144 62 135 64 128 62 Z" fill="url(#uub)" stroke={p.dark} strokeWidth="1.5"/>
    
    <path d="M 116 38 C 124 33 134 33 142 39 C 134 37 124 37 116 41 Z" fill={p.hi} opacity="0.55"/>
    
    <path d="M 114 36 C 104 28 100 16 106 6 C 108 14 112 20 117 24 L 114 28 C 117 31 120 33 122 34 Z" fill={p.horn}/>
    <path d="M 134 28 C 132 18 136 8 144 2 C 142 10 146 18 149 24 L 144 26 Z" fill={p.horn2}/>
    
    <path d="M 146 54 C 156 56 164 54 170 47 C 168 60 155 67 144 62 Z" fill={p.dark}/>
    <path d="M 149 56 l 1.5 8 l 4 -7 z" fill={p.bone}/>
    <path d="M 158 54 l 1 6 l 3.5 -5 z" fill={p.bone}/>
    <path d="M 153 62 l 3 5 l 1 -6 z" fill={p.bone2}/>
    
    <ellipse cx="130" cy="42" rx="6.5" ry="5" fill="url(#uueye)" className="ba-glow" style={{filter:`drop-shadow(0 0 5px ${p.glow})`}}/>
    <ellipse cx="130" cy="42" rx="1.8" ry="4" fill={p.dark}/>
    <ellipse cx="128" cy="40" rx="1.5" ry="1.8" fill="#fff" opacity="0.6"/>
    <ellipse cx="118" cy="46" rx="3" ry="2.4" fill={p.dark}/>
  </g>

  
  <g>
    <ellipse cx="73" cy="150" rx="16" ry="16" fill="url(#uucoin)" stroke={p.metalDark} strokeWidth="2"/>
    <ellipse cx="73" cy="150" rx="10.5" ry="10.5" fill="none" stroke={p.metalDark} strokeWidth="1.3" opacity="0.7"/>
    <text x="73" y="156" fontFamily="Georgia, serif" fontSize="15" fontWeight="bold" fill={p.metalDark} textAnchor="middle">$</text>
    <path d="M 64 140 a 13 13 0 0 1 18 0" fill="none" stroke="#fff" strokeWidth="1.4" opacity="0.4"/>
  </g>
  <path d="M 88 152 C 86 144 80 138 72 136 C 80 140 84 146 84 154 Z" fill={p.dark}/>

  
  <g fill={p.glow}><circle cx="44" cy="74" r="1.6" opacity="0.8"/><circle cx="166" cy="146" r="1.3" opacity="0.7"/><circle cx="100" cy="22" r="1.2" opacity="0.6"/></g>
    </g>
  );
}

function Wraith({ p }) {
  return (
    <g>
<defs>
<linearGradient id="wwb" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={p.body1}/><stop offset="100%" stopColor={p.body3}/></linearGradient>
<radialGradient id="wwface" cx="50%" cy="40%" r="60%"><stop offset="0%" stopColor={p.fin}/><stop offset="100%" stopColor="#000"/></radialGradient>
<radialGradient id="wweye" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor={p.glowA}/><stop offset="50%" stopColor={p.glowB}/><stop offset="100%" stopColor={p.glowC}/></radialGradient>
</defs>
<ellipse cx="100" cy="172" rx="46" ry="8" fill="#000" opacity="0.45"/>

<path d="M 100 40 C 126 42 138 64 134 90 C 132 112 140 134 132 156 L 122 146 L 117 162 L 106 150 L 100 166 L 94 150 L 83 162 L 78 146 L 68 156 C 60 134 68 112 66 90 C 62 64 74 42 100 40 Z" fill="url(#wwb)"/>
<path d="M 100 40 C 74 42 62 64 66 90 C 68 112 60 134 68 156 L 78 146 L 80 100 C 78 72 86 52 100 40 Z" fill={p.dark} opacity="0.6"/>

<g fill={p.glow} opacity="0.5"><circle cx="88" cy="150" r="1.3"/><circle cx="100" cy="158" r="1.3"/><circle cx="112" cy="150" r="1.3"/></g>

<path d="M 100 30 C 124 30 134 48 130 66 C 120 58 110 56 100 56 C 90 56 80 58 70 66 C 66 48 76 30 100 30 Z" fill={p.body2}/>
<path d="M 100 30 C 80 30 70 46 72 62 C 80 56 90 54 100 54 C 95 50 92 40 100 30 Z" fill={p.fin} opacity="0.8"/>

<ellipse cx="100" cy="52" rx="17" ry="15" fill="url(#wwface)"/>
<ellipse cx="93" cy="50" r="3.2" rx="3.2" ry="3.2" fill="url(#wweye)" className="ba-glow" style={{filter:`drop-shadow(0 0 4px ${p.glow})`}}/>
<ellipse cx="107" cy="50" rx="3.2" ry="3.2" fill="url(#wweye)" className="ba-glow" style={{filter:`drop-shadow(0 0 4px ${p.glow})`}}/>

<g transform="rotate(-8 100 28)">
<path d="M 68 28 L 100 15 L 132 28 L 100 39 Z" fill={p.horn}/>
<path d="M 68 28 L 100 15 L 100 39 Z" fill={p.horn2} opacity="0.6"/>
<rect x="96" y="11" width="8" height="5" fill={p.horn}/>
<line x1="130" y1="29" x2="139" y2="48" stroke={p.metalDark} strokeWidth="1.5"/>
<circle cx="139" cy="50" r="2.8" fill={p.glowB} className="ba-glow" style={{filter:`drop-shadow(0 0 2px ${p.glow})`}}/>
</g>

<rect x="72" y="94" width="56" height="18" rx="3" fill={p.bone}/>
<rect x="72" y="94" width="56" height="6" rx="3" fill={p.bone}/>
<rect x="68" y="92" width="8" height="22" rx="4" fill={p.bone2}/>
<rect x="124" y="92" width="8" height="22" rx="4" fill={p.bone2}/>
<line x1="80" y1="100" x2="120" y2="100" stroke={p.glow} strokeWidth="1.8" opacity="0.85"/>
<line x1="80" y1="106" x2="110" y2="106" stroke={p.glow} strokeWidth="1.8" opacity="0.55"/>

<g stroke={p.metalDark} strokeWidth="2" fill="none" opacity="0.85"><circle cx="130" cy="122" r="3.4"/><circle cx="133" cy="131" r="3.4"/><circle cx="136" cy="140" r="3.4"/></g>
<g fill={p.ash} opacity="0.4"><circle cx="50" cy="72" r="1.3"/><circle cx="152" cy="96" r="1.1"/></g>
    </g>
  );
}

function Steed({ p }) {
  return (
    <g>
<defs>
<linearGradient id="ssb" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={p.body1}/><stop offset="55%" stopColor={p.body2}/><stop offset="100%" stopColor={p.body3}/></linearGradient>
<radialGradient id="sseye" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor={p.glowA}/><stop offset="50%" stopColor={p.glowB}/><stop offset="100%" stopColor={p.glowC}/></radialGradient>
<radialGradient id="ssgear" cx="40%" cy="35%" r="70%"><stop offset="0%" stopColor="#ffe9a0"/><stop offset="60%" stopColor={p.metal}/><stop offset="100%" stopColor={p.metalDark}/></radialGradient>
</defs>
<ellipse cx="100" cy="172" rx="52" ry="8" fill="#000" opacity="0.45"/>

<g transform="translate(60 138) rotate(-12)">
<circle r="30" fill="none" stroke={p.body3} strokeWidth="9"/>
<circle r="30" fill="none" stroke={p.body2} strokeWidth="3"/>
<g stroke={p.metalDark} strokeWidth="3" opacity="0.7"><line x1="0" y1="-26" x2="0" y2="26"/><line x1="-26" y1="0" x2="26" y2="0"/><line x1="-18" y1="-18" x2="18" y2="18"/></g>
<circle r="6.5" fill="url(#ssgear)"/><circle r="2.5" fill={p.dark}/>
</g>

<path d="M 96 168 C 90 134 96 100 118 76 C 126 67 136 60 146 58 L 156 76 C 142 84 130 100 124 120 C 118 140 118 156 122 168 Z" fill="url(#ssb)"/>
<path d="M 96 168 C 92 138 98 106 114 82 C 106 104 102 138 106 168 Z" fill={p.dark} opacity="0.5"/>

<g fill={p.fin} stroke={p.finS} strokeWidth="1"><path d="M 120 74 L 110 56 L 122 64 L 120 46 L 132 60 L 134 42 L 142 58 Z"/><path d="M 104 102 L 92 92 L 106 94 Z"/><path d="M 96 132 L 84 126 L 98 124 Z"/></g>

<g>
<path d="M 146 58 C 158 52 168 56 172 64 C 176 72 180 84 186 94 C 190 100 188 106 182 106 C 174 106 166 100 160 92 C 152 94 144 90 140 80 C 136 70 138 62 146 58 Z" fill="url(#ssb)"/>
<path d="M 160 92 C 164 100 172 106 180 108 C 174 112 164 110 158 104 C 154 100 154 96 156 93 Z" fill={p.dark}/>
<path d="M 154 60 C 164 62 172 72 180 88 L 176 90 C 168 76 161 67 152 64 Z" fill={p.hi} opacity="0.5"/>
<ellipse cx="181" cy="96" rx="2.6" ry="1.8" fill={p.dark}/>
<g fill={p.bone}><path d="M 164 99 l 2 5 l 2.5 -4 z"/><path d="M 171 102 l 1.5 5 l 2.5 -4 z"/></g>
<ellipse cx="153" cy="72" rx="5.4" ry="4.6" fill={p.dark}/>
<ellipse cx="153" cy="72" rx="3.4" ry="2.8" fill="url(#sseye)" className="ba-glow" style={{filter:`drop-shadow(0 0 4px ${p.glow})`}}/>
<path d="M 148 56 L 142 40 L 154 50 Z" fill={p.horn}/><path d="M 158 54 L 158 40 L 166 52 Z" fill={p.horn2}/>
</g>

<g transform="translate(118 152)">
<g fill={p.metalDark}><rect x="-3.5" y="-22" width="7" height="8"/><rect x="-3.5" y="14" width="7" height="8"/><rect x="-22" y="-3.5" width="8" height="7"/><rect x="14" y="-3.5" width="8" height="7"/></g>
<circle r="16" fill="url(#ssgear)"/><circle r="10.5" fill={p.metalDark}/><circle r="4" fill={p.dark}/>
</g>
<rect x="134" y="120" width="6" height="15" rx="2" fill={p.horn} transform="rotate(22 137 127)"/>
<g fill={p.ash} opacity="0.4"><circle cx="146" cy="114" r="3"/><circle cx="152" cy="106" r="2.2"/></g>
    </g>
  );
}

function Colossus({ p }) {
  return (
    <g>
<defs>
<linearGradient id="ccb" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={p.body1}/><stop offset="55%" stopColor={p.body2}/><stop offset="100%" stopColor={p.body3}/></linearGradient>
<radialGradient id="ccwin" cx="50%" cy="40%" r="60%"><stop offset="0%" stopColor={p.glowA}/><stop offset="60%" stopColor={p.glowB}/><stop offset="100%" stopColor={p.glowC}/></radialGradient>
</defs>
<ellipse cx="100" cy="178" rx="62" ry="9" fill="#000" opacity="0.5"/>

<path d="M 38 90 C 26 96 20 112 24 132 C 27 146 36 156 48 158 L 54 142 C 46 138 42 128 44 116 C 45 106 50 98 56 94 Z" fill={p.body3}/>
<path d="M 162 90 C 174 96 180 112 176 132 C 173 146 164 156 152 158 L 146 142 C 154 138 158 128 156 116 C 155 106 150 98 144 94 Z" fill={p.body3}/>

<path d="M 56 84 L 144 84 L 150 122 L 142 160 L 58 160 L 50 122 Z" fill="url(#ccb)"/>
<path d="M 56 84 L 100 84 L 100 160 L 58 160 L 50 122 Z" fill={p.dark} opacity="0.5"/>
<g stroke={p.dark} strokeWidth="2"><line x1="52" y1="110" x2="148" y2="110"/><line x1="54" y1="136" x2="146" y2="136"/><line x1="84" y1="84" x2="82" y2="110"/><line x1="118" y1="110" x2="120" y2="136"/></g>
<path d="M 64 92 L 70 102 L 66 112" fill="none" stroke={p.dark} strokeWidth="1.6"/>

<path d="M 74 30 L 74 84 L 126 84 L 126 30 L 116 30 L 116 38 L 108 38 L 108 30 L 92 30 L 92 38 L 84 38 L 84 30 Z" fill="url(#ccb)"/>
<path d="M 74 30 L 74 84 L 96 84 L 96 38 L 92 38 L 92 30 L 84 30 L 84 38 L 74 38 Z" fill={p.dark} opacity="0.5"/>
<g stroke={p.dark} strokeWidth="1.4"><line x1="74" y1="52" x2="126" y2="52"/><line x1="74" y1="68" x2="126" y2="68"/><line x1="96" y1="38" x2="96" y2="52"/><line x1="110" y1="52" x2="110" y2="68"/></g>

<path d="M 86 56 a 4 5 0 0 1 8 0 l 0 6 l -8 0 Z" fill="url(#ccwin)" className="ba-glow" style={{filter:`drop-shadow(0 0 3px ${p.glow})`}}/>
<path d="M 106 56 a 4 5 0 0 1 8 0 l 0 6 l -8 0 Z" fill="url(#ccwin)" className="ba-glow" style={{filter:`drop-shadow(0 0 3px ${p.glow})`}}/>
<path d="M 92 84 a 8 9 0 0 1 16 0 l -16 0 Z" fill={p.dark}/>
<g stroke={p.metalDark} strokeWidth="1.6"><line x1="96" y1="78" x2="96" y2="84"/><line x1="100" y1="76" x2="100" y2="84"/><line x1="104" y1="78" x2="104" y2="84"/></g>

<g stroke={p.metalDark} strokeWidth="2.2" fill="none" opacity="0.85"><circle cx="66" cy="120" r="3.4"/><circle cx="78" cy="124" r="3.4"/><circle cx="90" cy="127" r="3.4"/><circle cx="102" cy="128" r="3.4"/><circle cx="114" cy="127" r="3.4"/><circle cx="126" cy="124" r="3.4"/><circle cx="138" cy="120" r="3.4"/></g>
<rect x="34" y="152" width="26" height="20" rx="5" fill={p.fin}/>
<rect x="140" y="152" width="26" height="20" rx="5" fill={p.fin}/>
    </g>
  );
}

function Plague({ p }) {
  return (
    <g>
<defs>
<linearGradient id="ppb" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={p.body1}/><stop offset="100%" stopColor={p.body3}/></linearGradient>
<radialGradient id="ppeye" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor={p.glowA}/><stop offset="50%" stopColor={p.glowB}/><stop offset="100%" stopColor={p.glowC}/></radialGradient>
</defs>
<ellipse cx="100" cy="174" rx="46" ry="8" fill="#000" opacity="0.45"/>
<path d="M 100 60 C 130 62 144 84 142 112 C 141 132 148 148 140 164 L 130 154 L 126 168 L 114 156 L 108 170 L 98 156 L 90 168 L 82 154 L 72 164 C 64 148 71 132 70 112 C 68 84 74 62 100 60 Z" fill="url(#ppb)"/>
<path d="M 100 60 C 74 62 68 84 70 112 C 71 132 64 148 72 164 L 82 154 L 84 112 C 83 88 88 70 100 60 Z" fill={p.dark} opacity="0.6"/>
<path d="M 80 66 L 100 78 L 120 66 L 114 58 L 86 58 Z" fill={p.fin}/>

<ellipse cx="100" cy="38" rx="34" ry="8" fill={p.horn}/>
<path d="M 82 38 C 82 24 90 16 100 16 C 110 16 118 24 118 38 Z" fill={p.horn}/>
<path d="M 82 38 C 82 24 90 16 100 16 C 94 22 90 30 90 38 Z" fill={p.horn2}/>
<path d="M 84 44 C 84 38 92 34 100 34 C 108 34 116 38 116 44 C 116 52 110 56 104 56 L 96 56 C 90 56 84 52 84 44 Z" fill={p.dark}/>

<path d="M 98 48 C 106 46 118 50 126 60 C 118 60 110 58 104 56 C 100 54 97 51 98 48 Z" fill={p.bone}/>
<path d="M 98 48 C 104 47 112 50 120 56 C 112 55 105 53 101 51 Z" fill={p.bone2}/>
<circle cx="95" cy="46" r="4.6" fill={p.dark} stroke={p.metalDark} strokeWidth="1.4"/>
<circle cx="95" cy="46" r="2.2" fill="url(#ppeye)" className="ba-glow" style={{filter:`drop-shadow(0 0 3px ${p.glow})`}}/>

<line x1="142" y1="70" x2="134" y2="166" stroke={p.horn} strokeWidth="4.5" strokeLinecap="round"/>
<path d="M 142 70 C 136 60 140 50 150 48 C 144 54 144 62 148 68 Z" fill={p.horn}/>
<circle cx="149" cy="50" r="3.4" fill="url(#ppeye)" className="ba-glow" style={{filter:`drop-shadow(0 0 3px ${p.glow})`}}/>
<g fill={p.bone}><rect x="134" y="96" width="12" height="5" rx="2.5"/><rect x="134" y="102" width="12" height="5" rx="2.5"/></g>

<g transform="rotate(-12 56 92)"><rect x="46" y="84" width="20" height="14" rx="1.5" fill={p.bone}/><line x1="50" y1="89" x2="62" y2="89" stroke={p.body2} strokeWidth="1.3"/><line x1="50" y1="93" x2="58" y2="93" stroke={p.body2} strokeWidth="1.3"/></g>
<g transform="rotate(9 52 124)"><rect x="42" y="116" width="18" height="13" rx="1.5" fill={p.bone2}/><text x="51" y="126" fontFamily="Georgia" fontSize="9" fontWeight="bold" fill={p.body2} textAnchor="middle">$</text></g>
    </g>
  );
}

function Shade({ p }) {
  return (
    <g>
<defs>
<linearGradient id="hhb" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={p.body1}/><stop offset="100%" stopColor={p.body3}/></linearGradient>
<radialGradient id="hheye" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor={p.glowA}/><stop offset="45%" stopColor={p.glowB}/><stop offset="100%" stopColor={p.glowC}/></radialGradient>
<radialGradient id="hhface" cx="50%" cy="45%" r="60%"><stop offset="0%" stopColor={p.fin}/><stop offset="100%" stopColor="#000"/></radialGradient>
</defs>
<ellipse cx="100" cy="176" rx="40" ry="7" fill="#000" opacity="0.4"/>
<path d="M 100 34 C 122 38 132 58 128 82 C 125 100 132 114 126 130 C 122 142 112 148 104 150 C 108 140 106 132 100 128 C 94 132 92 140 96 150 C 88 148 78 142 74 130 C 68 114 75 100 72 82 C 68 58 78 38 100 34 Z" fill="url(#hhb)"/>
<path d="M 100 34 C 78 38 68 58 72 82 C 75 100 68 114 74 130 C 78 142 88 148 96 150 C 92 140 94 132 100 128 L 100 34 Z" fill={p.dark} opacity="0.55"/>
<path d="M 88 152 C 84 160 86 168 92 172 C 90 164 92 158 96 154 Z" fill={p.fin} opacity="0.7"/>
<path d="M 112 152 C 116 160 114 168 108 172 C 110 164 108 158 104 154 Z" fill={p.fin} opacity="0.55"/>
<path d="M 100 156 C 100 164 102 170 100 178 C 98 170 100 164 100 156 Z" fill={p.fin} opacity="0.4"/>
<ellipse cx="100" cy="62" rx="15" ry="13" fill="url(#hhface)"/>
<ellipse cx="100" cy="60" rx="5.5" ry="6.5" fill="url(#hheye)" className="ba-glow" style={{filter:`drop-shadow(0 0 5px ${p.glow})`}}/>
<ellipse cx="100" cy="60" rx="2" ry="5" fill={p.dark}/>
<ellipse cx="98" cy="57" rx="1.4" ry="1.8" fill="#fff" opacity="0.5"/>
<g fill={p.fin}><path d="M 74 90 C 56 96 44 110 40 128 C 39 134 42 138 46 138 C 44 130 48 120 56 112 C 63 105 70 100 78 98 Z"/><path d="M 46 138 C 42 144 40 152 42 158 L 45 156 C 44 151 45 146 48 141 Z"/><path d="M 50 140 C 48 147 48 154 51 160 L 54 157 C 52 152 52 146 54 142 Z"/><path d="M 126 90 C 144 96 156 110 160 128 C 161 134 158 138 154 138 C 156 130 152 120 144 112 C 137 105 130 100 122 98 Z"/><path d="M 154 138 C 158 144 160 152 158 158 L 155 156 C 156 151 155 146 152 141 Z"/><path d="M 150 140 C 152 147 152 154 149 160 L 146 157 C 148 152 148 146 146 142 Z"/></g>
<g transform="rotate(-14 144 70)"><path d="M 134 62 L 154 62 L 154 78 L 148 76 L 144 80 L 140 76 L 134 78 Z" fill={p.bone}/><text x="144" y="73" fontFamily="Georgia" fontSize="8" fontWeight="bold" fill={p.body2} textAnchor="middle">IOU</text></g>
<g stroke={p.ash} strokeWidth="1.2" fill="none" opacity="0.5"><path d="M 62 54 q 6 -3 12 0"/><path d="M 56 64 q 5 -2 10 0"/></g>
    </g>
  );
}

function SlayerM({ p }) {
  return (
    <g>
<defs>
    <linearGradient id="smcloakM" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#3a2230"/><stop offset="100%" stopColor="#140a12"/>
    </linearGradient>
    <linearGradient id="smarmorM" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor={p.body1}/><stop offset="55%" stopColor={p.body2}/><stop offset="100%" stopColor="#22070b"/>
    </linearGradient>
    <linearGradient id="smsteelM" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#e8e2d4"/><stop offset="100%" stopColor="#8a8272"/>
    </linearGradient>
    <radialGradient id="smhoodShadowM" cx="50%" cy="45%" r="60%">
      <stop offset="0%" stopColor="#1a0e16"/><stop offset="100%" stopColor="#000"/>
    </radialGradient>
  </defs>

  
  <path d="M 62 76 C 48 108 46 144 54 176 L 68 164 L 76 178 L 86 166 L 86 92 Z" fill="url(#smcloakM)"/>
  <path d="M 138 76 C 152 108 154 144 146 176 L 132 164 L 124 178 L 114 166 L 114 92 Z" fill="url(#smcloakM)"/>
  <path d="M 62 76 C 52 104 50 140 56 172 C 60 150 62 120 70 96 Z" fill="#0e0610" opacity="0.6"/>

  
  <rect x="82" y="128" width="15" height="40" rx="4" fill="#2a0a10"/>
  <rect x="103" y="128" width="15" height="40" rx="4" fill="#2a0a10"/>
  <ellipse cx="89" cy="140" rx="8" ry="6" fill={p.body1}/>
  <ellipse cx="111" cy="140" rx="8" ry="6" fill={p.body1}/>
  <path d="M 80 162 L 99 162 L 99 174 L 76 174 Z" fill="#180408"/>
  <path d="M 101 162 L 120 162 L 124 174 L 101 174 Z" fill="#180408"/>

  
  <path d="M 76 78 C 88 74 112 74 124 78 L 120 118 C 116 128 112 132 100 132 C 88 132 84 128 80 118 Z" fill="url(#smarmorM)"/>
  
  <path d="M 100 80 L 100 130" stroke="#180408" strokeWidth="1.5" opacity="0.7"/>
  <path d="M 84 92 C 92 88 100 88 100 92 M 116 92 C 108 88 100 88 100 92" fill="none" stroke="#1a0509" strokeWidth="1.5" opacity="0.6"/>
  <path d="M 82 108 L 118 108" stroke="#180408" strokeWidth="1.4" opacity="0.6"/>
  
  <path d="M 80 84 C 86 80 92 80 94 82 L 90 104 C 86 100 82 92 80 84 Z" fill={p.hi} opacity="0.5"/>

  
  <rect x="80" y="120" width="40" height="9" rx="2" fill="#2a1a10"/>
  <rect x="95" y="119" width="10" height="11" rx="2" fill="#d4af37"/>
  <rect x="97" y="121" width="6" height="7" rx="1" fill={p.metalDark}/>

  
  <path d="M 62 76 C 60 64 74 58 86 64 L 84 82 C 74 84 64 82 62 76 Z" fill={p.hi}/>
  <path d="M 138 76 C 140 64 126 58 114 64 L 116 82 C 126 84 136 82 138 76 Z" fill={p.hi}/>
  <ellipse cx="73" cy="70" rx="9" ry="6" fill={p.hi2}/>
  <ellipse cx="127" cy="70" rx="9" ry="6" fill={p.hi2}/>
  <circle cx="73" cy="70" r="2" fill="#d4af37"/>
  <circle cx="127" cy="70" r="2" fill="#d4af37"/>

  
  <rect x="64" y="80" width="13" height="36" rx="6" fill="#2a0a10"/>
  <rect x="123" y="80" width="13" height="36" rx="6" fill="#2a0a10"/>
  <path d="M 62 108 L 78 108 L 76 124 L 64 124 Z" fill={p.body1}/>
  <path d="M 138 108 L 122 108 L 124 124 L 136 124 Z" fill={p.body1}/>

  
  <path d="M 100 26 C 118 26 128 40 126 56 C 125 67 114 74 100 74 C 86 74 75 67 74 56 C 72 40 82 26 100 26 Z" fill={p.horn}/>
  <path d="M 100 26 C 110 26 118 34 122 46 C 116 40 108 38 100 38 C 92 38 84 40 78 46 C 82 34 90 26 100 26 Z" fill="#3a2230"/>
  <path d="M 96 26 L 100 14 L 105 26 Z" fill={p.horn}/>
  
  <ellipse cx="100" cy="52" rx="15" ry="15" fill="url(#smhoodShadowM)"/>
  
  <ellipse cx="93" cy="50" rx="4" ry="2.6" fill={p.glowB} className="ba-glow" style={{filter:`drop-shadow(0 0 4px ${p.glow})`}}/>
  <ellipse cx="107" cy="50" rx="4" ry="2.6" fill={p.glowB} className="ba-glow" style={{filter:`drop-shadow(0 0 4px ${p.glow})`}}/>
  <ellipse cx="93" cy="50" rx="1.6" ry="2.2" fill="#fff" opacity="0.7"/>
  <ellipse cx="107" cy="50" rx="1.6" ry="2.2" fill="#fff" opacity="0.7"/>
    </g>
  );
}

function SlayerF({ p }) {
  return (
    <g>
<defs>
    <linearGradient id="sfcloakF" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#3a2230"/><stop offset="100%" stopColor="#140a12"/>
    </linearGradient>
    <linearGradient id="sfarmorF" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor={p.body1}/><stop offset="55%" stopColor={p.body2}/><stop offset="100%" stopColor="#22070b"/>
    </linearGradient>
    <radialGradient id="sfhoodShadowF" cx="50%" cy="45%" r="60%">
      <stop offset="0%" stopColor="#1a0e16"/><stop offset="100%" stopColor="#000"/>
    </radialGradient>
  </defs>

  <path d="M 66 78 C 52 108 50 144 58 176 L 72 164 L 80 178 L 88 166 L 88 94 Z" fill="url(#sfcloakF)"/>
  <path d="M 134 78 C 148 108 150 144 142 176 L 128 164 L 120 178 L 112 166 L 112 94 Z" fill="url(#sfcloakF)"/>
  <path d="M 66 78 C 56 106 54 142 60 174 C 64 152 66 122 74 98 Z" fill="#0e0610" opacity="0.6"/>

  
  <rect x="84" y="128" width="13" height="40" rx="4" fill="#2a0a10"/>
  <rect x="103" y="128" width="13" height="40" rx="4" fill="#2a0a10"/>
  <ellipse cx="90" cy="140" rx="7" ry="5.5" fill={p.body1}/>
  <ellipse cx="110" cy="140" rx="7" ry="5.5" fill={p.body1}/>
  <path d="M 82 162 L 99 162 L 99 174 L 78 174 Z" fill="#180408"/>
  <path d="M 101 162 L 118 162 L 122 174 L 101 174 Z" fill="#180408"/>

  
  <path d="M 78 80 C 88 75 112 75 122 80 L 116 104 L 119 126 C 114 132 106 134 100 134 C 94 134 86 132 81 126 L 84 104 Z" fill="url(#sfarmorF)"/>
  <path d="M 100 80 L 100 132" stroke="#180408" strokeWidth="1.4" opacity="0.6"/>
  <path d="M 86 100 C 94 96 100 98 100 100 M 114 100 C 106 96 100 98 100 100" fill="none" stroke="#1a0509" strokeWidth="1.3" opacity="0.6"/>
  <path d="M 84 116 L 116 116" stroke="#180408" strokeWidth="1.3" opacity="0.5"/>
  <path d="M 82 86 C 88 82 92 82 94 84 L 90 110 C 86 104 82 94 82 86 Z" fill={p.hi} opacity="0.5"/>

  
  <rect x="82" y="122" width="36" height="8" rx="2" fill="#2a1a10"/>
  <rect x="95" y="121" width="10" height="10" rx="2" fill="#d4af37"/>

  
  <path d="M 66 78 C 64 67 77 61 88 66 L 86 82 C 77 84 68 82 66 78 Z" fill={p.hi}/>
  <path d="M 134 78 C 136 67 123 61 112 66 L 114 82 C 123 84 132 82 134 78 Z" fill={p.hi}/>
  <ellipse cx="76" cy="72" rx="7.5" ry="5" fill={p.hi2}/>
  <ellipse cx="124" cy="72" rx="7.5" ry="5" fill={p.hi2}/>
  <circle cx="76" cy="72" r="1.8" fill="#d4af37"/>
  <circle cx="124" cy="72" r="1.8" fill="#d4af37"/>

  <rect x="68" y="80" width="12" height="34" rx="6" fill="#2a0a10"/>
  <rect x="120" y="80" width="12" height="34" rx="6" fill="#2a0a10"/>
  <path d="M 66 106 L 80 106 L 78 122 L 68 122 Z" fill={p.body1}/>
  <path d="M 134 106 L 120 106 L 122 122 L 132 122 Z" fill={p.body1}/>

  
  <path d="M 78 56 C 72 72 72 90 78 104 C 74 92 74 74 80 60 Z" fill={p.horn2}/>
  <path d="M 122 56 C 128 72 128 90 122 104 C 126 92 126 74 120 60 Z" fill={p.horn2}/>

  
  <path d="M 100 28 C 116 28 125 41 123 56 C 122 66 112 73 100 73 C 88 73 78 66 77 56 C 75 41 84 28 100 28 Z" fill={p.horn}/>
  <path d="M 100 28 C 109 28 117 35 121 46 C 115 40 108 38 100 38 C 92 38 85 40 79 46 C 83 35 91 28 100 28 Z" fill="#3a2230"/>
  <path d="M 96 28 L 100 17 L 104 28 Z" fill={p.horn}/>
  <ellipse cx="100" cy="52" rx="14" ry="14" fill="url(#sfhoodShadowF)"/>
  
  <ellipse cx="93.5" cy="50" rx="3.6" ry="2.3" fill={p.glowB} transform="rotate(-3 93.5 50)" className="ba-glow" style={{filter:`drop-shadow(0 0 4px ${p.glow})`}}/>
  <ellipse cx="106.5" cy="50" rx="3.6" ry="2.3" fill={p.glowB} transform="rotate(3 106.5 50)" className="ba-glow" style={{filter:`drop-shadow(0 0 4px ${p.glow})`}}/>
  <ellipse cx="93.5" cy="50" rx="1.4" ry="2" fill="#fff" opacity="0.7"/>
  <ellipse cx="106.5" cy="50" rx="1.4" ry="2" fill="#fff" opacity="0.7"/>
    </g>
  );
}

const MODELS = { credit: Usurer, student: Wraith, car: Steed, mortgage: Colossus, medical: Plague, personal: Shade };

export default function BossArt({ type, skin = "blood", size = 80, dead = false, className }) {
  const p = PALETTES[skin] || PALETTES.blood;
  const Model = MODELS[type] || Shade;
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={className}
      style={{ display: "block", filter: dead ? "grayscale(1) brightness(.6)" : "none", overflow: "visible" }}>
      <Model p={p} />
    </svg>
  );
}

export function SlayerAvatar({ gender = "male", skin = "blood", size = 80, className }) {
  const p = PALETTES[skin] || PALETTES.blood;
  const Model = gender === "female" ? SlayerF : SlayerM;
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={className} style={{ display: "block", overflow: "visible" }}>
      <Model p={p} />
    </svg>
  );
}

export const WEAPONS = {
  rusted:   { label: "Rusted Blade",      cost: 0,   free: true,  blade:"#7a6a55", edge:"#9a8a72", guard:"#3a2d1a", gem:"#5a4a32", aura:null,      desc:"Where every Slayer begins." },
  iron:     { label: "Iron Sword",        cost: 60,  free: true,  blade:"#c8c2b4", edge:"#e8e2d4", guard:"#5a5246", gem:"#8a8272", aura:null,      desc:"Honest steel. Reliable." },
  ember:    { label: "Emberbrand",        cost: 150, free: true,  blade:"#c83018", edge:"#ff8a3a", guard:"#6a3210", gem:"#ff6b35", aura:"#ff6b35", desc:"Strikes burn with ember." },
  frost:    { label: "Frostbite",         cost: 300, free: true,  blade:"#3a8ab0", edge:"#aeeaff", guard:"#1a4a6a", gem:"#5ec8e8", aura:"#aeeaff", desc:"Each blow bites like winter." },
  void:     { label: "Voidreaver",        cost: 600, free: false, blade:"#4a2a78", edge:"#d8b0ff", guard:"#2a1850", gem:"#b06aff", aura:"#b06aff", desc:"Slayer's Guild · drinks the dark." },
  gilded:   { label: "Gilded Greatsword", cost: 900, free: false, blade:"#d4af37", edge:"#fff0b8", guard:"#9a7d1e", gem:"#ffd966", aura:"#ffd966", desc:"Slayer's Guild · forged of pure gold." },
};

export function WeaponArt({ id = "rusted", size = 80 }) {
  const w = WEAPONS[id] || WEAPONS.rusted;
  return (
    <svg viewBox="0 0 40 80" width={size * 0.5} height={size} style={{ display: "block", overflow: "visible" }}>
      <g transform="translate(20 40)">
        <path d="M 0 -34 L -4 -26 L -4 8 L 4 8 L 4 -26 Z" fill={w.blade} />
        <path d="M 0 -34 L 0 8" stroke={w.edge} strokeWidth="1.6" />
        <rect x="-10" y="8" width="20" height="5" rx="2" fill={w.guard} />
        <rect x="-2.5" y="13" width="5" height="13" rx="2" fill="#241a14" />
        <circle cx="0" cy="28" r="3.4" fill={w.gem} />
        {w.aura && <g fill={w.aura} opacity="0.85"><circle cx="-6" cy="-16" r="1.3" className="ba-glow" /><circle cx="6" cy="-24" r="1.1" className="ba-glow" /></g>}
      </g>
    </svg>
  );
}
