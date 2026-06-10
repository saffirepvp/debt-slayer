import React from "react";

// ============================================================
// BOSS ART — six gritty dark-fantasy boss models, palette-driven.
// Skins: blood/ash/spectral are free; gilded/void are Slayer's Guild.
// ============================================================

export const PALETTES = {
  blood:    { label: "Blood",    free: true,  body1: "#5a1418", body2: "#3a0e11", body3: "#200709", fin: "#2a0a0c", finS: "#4a1216", dark: "#180406", glow: "#d8722e", bone: "#c8bfae", bone2: "#a8a08e", metal: "#a08030", metalDark: "#6a5210", scar: "#7a4a42", horn: "#241a14", horn2: "#1c130e", ash: "#8a7f72", pupil: "#120304" },
  ash:      { label: "Ash",      free: true,  body1: "#56524a", body2: "#3a3733", body3: "#232120", fin: "#2e2c28", finS: "#4a463e", dark: "#14130f", glow: "#c8c2b0", bone: "#d8d2c4", bone2: "#b8b2a4", metal: "#8a8272", metalDark: "#5a5448", scar: "#8a857a", horn: "#2a2620", horn2: "#201d18", ash: "#9a958a", pupil: "#0e0d0b" },
  spectral: { label: "Spectral", free: true,  body1: "#1a5a4e", body2: "#103a32", body3: "#08211c", fin: "#0c2c26", finS: "#1a4a40", dark: "#051410", glow: "#5ee8c0", bone: "#a8d8c8", bone2: "#88b8a8", metal: "#3a8a72", metalDark: "#20564a", scar: "#2a7a66", horn: "#0e2e26", horn2: "#0a2018", ash: "#6aa896", pupil: "#03100c" },
  gilded:   { label: "Gilded",   free: false, body1: "#8a6d1e", body2: "#5a460f", body3: "#32270a", fin: "#43340c", finS: "#6a5210", dark: "#1c1404", glow: "#ffd966", bone: "#f0e6c8", bone2: "#d0c6a8", metal: "#d4af37", metalDark: "#9a7d1e", scar: "#b89440", horn: "#43340c", horn2: "#32270a", ash: "#c8b276", pupil: "#140e02" },
  void:     { label: "Void",     free: false, body1: "#4a2a78", body2: "#301a52", body3: "#1a0e30", fin: "#241440", finS: "#3a2462", dark: "#0e0620", glow: "#b06aff", bone: "#cab8e8", bone2: "#a892c8", metal: "#7a52b8", metalDark: "#4e3280", scar: "#6a4aa0", horn: "#1c1034", horn2: "#140a26", ash: "#8a76b0", pupil: "#08041a" },
};

export const FREE_SKINS = Object.keys(PALETTES).filter((k) => PALETTES[k].free);

function Usurer({ p }) {
  return (
    <g>
<g stroke={p.bone2} strokeWidth="2.4" strokeLinecap="round" opacity="0.75">
    <line x1="38" y1="166" x2="50" y2="162"/>
    <line x1="146" y1="170" x2="158" y2="168"/>
  </g>
  <circle cx="36" cy="166" r="2.6" fill={p.bone2} opacity="0.75"/>
  <circle cx="160" cy="168" r="2.4" fill={p.bone2} opacity="0.75"/>
  <path d="M 152 158 a 5 5 0 1 1 8 4 l -1 4 l -6 0 z" fill={p.bone2} opacity="0.8"/>
  <circle cx="154.5" cy="159.5" r="1.1" fill={p.pupil}/>
  <circle cx="158.5" cy="160" r="1.1" fill={p.pupil}/>

  
  <path d="M 122 64 C 148 76 156 100 146 120 C 136 140 108 144 90 134 C 72 124 58 130 52 144 C 47 156 56 168 72 168"
        fill="none" stroke={p.body2} strokeWidth="19" strokeLinecap="round"/>
  <path d="M 72 168 C 84 168 92 160 88 150" fill="none" stroke={p.body3} strokeWidth="10" strokeLinecap="round"/>

  
  <g stroke={p.dark} strokeWidth="1.6" strokeLinecap="round" opacity="0.9">
    <line x1="138" y1="92" x2="146" y2="100"/>
    <line x1="142" y1="90" x2="150" y2="98"/>
    <line x1="112" y1="134" x2="120" y2="126"/>
  </g>
  <g stroke={p.scar} strokeWidth="0.8" strokeLinecap="round" opacity="0.6">
    <line x1="139" y1="91" x2="147" y2="99"/>
    <line x1="113" y1="133" x2="121" y2="125"/>
  </g>

  
  <path d="M 134 72 L 150 58 L 146 72 L 162 66 L 154 82 L 168 82 L 156 94 L 166 102 L 152 104 L 158 116 L 144 112"
        fill={p.fin} stroke={p.finS} strokeWidth="1" opacity="0.95"/>

  
  <g>
    <path d="M 126 66 C 110 62 102 50 108 38 C 113 28 128 25 140 32 C 152 39 156 52 148 60 C 142 66 133 68 126 66 Z"
          fill={p.body2} stroke={p.dark} strokeWidth="1.5"/>
    
    <path d="M 116 40 C 124 36 134 36 142 42 C 134 40 124 40 116 44 Z" fill={p.dark}/>
    
    <path d="M 112 40 C 102 32 98 20 104 10 C 105 16 108 20 112 23 L 110 26 C 114 30 118 32 121 33 Z" fill={p.horn}/>
    <path d="M 132 32 C 130 22 134 12 142 6 C 140 14 144 20 147 25 L 142 26 C 144 30 146 32 147 33 Z" fill={p.horn2}/>
    
    <path d="M 144 58 C 154 60 162 58 168 51 C 167 63 154 70 143 65 Z" fill={p.dark}/>
    <path d="M 147 60 l 1.5 8 l 4 -7 z" fill={p.bone}/>
    <path d="M 156 58 l 0.5 6 l 3.5 -5 z" fill={p.bone2}/>
    <path d="M 151 66 l 3 5 l 1 -6 z" fill={p.bone2}/>
    
    <ellipse cx="129" cy="45" rx="5.6" ry="3.8" fill={p.glow} style={{filter:`drop-shadow(0 0 3px ${p.glow})`}}/>
    <ellipse cx="129" cy="45" rx="1.5" ry="3.2" fill={p.pupil}/>
    
    <ellipse cx="118" cy="48" rx="3" ry="2.4" fill={p.pupil}/>
  </g>

  
  <g>
    <circle cx="72" cy="148" r="15" fill={p.metal} stroke={p.metalDark} strokeWidth="2"/>
    <circle cx="72" cy="148" r="9.5" fill="none" stroke={p.metalDark} strokeWidth="1.3" opacity="0.8"/>
    <text x="72" y="153.5" fontFamily="Georgia, serif" fontSize="14" fontWeight="bold" fill={p.metalDark} textAnchor="middle">$</text>
    
    <path d="M 62 138 L 68 146 L 64 150 L 71 158" fill="none" stroke={p.metalDark} strokeWidth="1.4"/>
  </g>
  
  <path d="M 86 152 C 84 144 78 138 70 136 C 78 140 82 146 82 154 Z" fill={p.dark}/>

  
  <g fill={p.ash} opacity="0.5">
    <circle cx="44" cy="78" r="1.4"/>
    <circle cx="162" cy="142" r="1.1"/>
    <circle cx="98" cy="24" r="1.0"/>
    <circle cx="32" cy="118" r="0.9"/>
  </g>
  <circle cx="120" cy="36" r="1.2" fill={p.glow} opacity="0.6"/>
    </g>
  );
}

function Wraith({ p }) {
  return (
    <g>
<path d="M 100 38 C 124 40 134 60 132 86 C 131 108 138 128 132 148 L 124 140 L 120 156 L 110 144 L 104 162 L 96 146 L 88 158 L 82 142 L 72 152 C 64 128 70 108 68 86 C 66 60 76 40 100 38 Z"
        fill={p.body2}/>
  
  <path d="M 100 38 C 76 40 66 60 68 86 C 70 108 64 128 72 152 L 82 142 L 84 100 C 82 72 88 50 100 38 Z" fill={p.body3}/>
  
  <path d="M 100 30 C 122 30 132 46 130 62 C 122 56 112 54 100 54 C 88 54 78 56 70 62 C 68 46 78 30 100 30 Z" fill={p.fin}/>
  
  <ellipse cx="100" cy="52" rx="17" ry="14" fill={p.dark}/>
  
  <circle cx="93" cy="50" r="3" fill={p.glow} style={{filter:`drop-shadow(0 0 3px ${p.glow})`}}/>
  <circle cx="107" cy="50" r="3" fill={p.glow} style={{filter:`drop-shadow(0 0 3px ${p.glow})`}}/>
  
  <g transform="rotate(-8 100 30)">
    <path d="M 70 30 L 100 18 L 130 30 L 100 40 Z" fill={p.horn}/>
    <path d="M 124 28 l 6 2 l -7 3 z" fill={p.dark}/>
    <rect x="97" y="14" width="6" height="5" fill={p.horn}/>
    <line x1="128" y1="31" x2="136" y2="48" stroke={p.metalDark} strokeWidth="1.5"/>
    <circle cx="136" cy="50" r="2.5" fill={p.glow} style={{filter:`drop-shadow(0 0 2px ${p.glow})`}}/>
  </g>
  
  <g>
    <rect x="74" y="96" width="52" height="16" rx="3" fill={p.bone}/>
    <rect x="70" y="94" width="7" height="20" rx="3.5" fill={p.bone2}/>
    <rect x="123" y="94" width="7" height="20" rx="3.5" fill={p.bone2}/>
    
    <line x1="82" y1="101" x2="118" y2="101" stroke={p.glow} strokeWidth="1.6" opacity="0.85"/>
    <line x1="82" y1="106" x2="110" y2="106" stroke={p.glow} strokeWidth="1.6" opacity="0.6"/>
    
    <path d="M 76 96 C 75 102 76 108 79 112 L 82 110 C 80 106 79 100 80 96 Z" fill={p.bone}/>
    <path d="M 124 96 C 125 102 124 108 121 112 L 118 110 C 120 106 121 100 120 96 Z" fill={p.bone}/>
  </g>
  
  <g stroke={p.metalDark} strokeWidth="2" fill="none" opacity="0.9">
    <circle cx="128" cy="120" r="3.2"/>
    <circle cx="130" cy="128" r="3.2"/>
    <circle cx="133" cy="136" r="3.2"/>
  </g>
  
  <g fill={p.ash} opacity="0.5">
    <circle cx="48" cy="70" r="1.3"/><circle cx="156" cy="96" r="1.1"/><circle cx="60" cy="150" r="1.0"/>
  </g>
    </g>
  );
}

function Steed({ p }) {
  return (
    <g>
<g transform="translate(62 138) rotate(-12)">
    <circle r="30" fill="none" stroke={p.body3} strokeWidth="9"/>
    <circle r="30" fill="none" stroke={p.fin} strokeWidth="3"/>
    <g stroke={p.metalDark} strokeWidth="3">
      <line x1="0" y1="-26" x2="0" y2="26"/>
      <line x1="-26" y1="0" x2="26" y2="0"/>
      <line x1="-18" y1="-18" x2="18" y2="18"/>
    </g>
    <circle r="6.5" fill={p.metal}/>
    <circle r="2.5" fill={p.dark}/>
  </g>

  
  <path d="M 96 168 C 90 134 96 100 118 76 C 126 67 136 60 146 58 L 156 76 C 142 84 130 100 124 120 C 118 140 118 156 122 168 Z"
        fill={p.body2}/>
  <path d="M 96 168 C 92 138 98 106 114 82 C 106 104 102 138 106 168 Z" fill={p.body3}/>

  
  <g fill={p.fin} stroke={p.finS} strokeWidth="1">
    <path d="M 120 74 L 110 56 L 122 64 L 120 46 L 132 60 L 134 42 L 142 58 Z"/>
    <path d="M 104 102 L 92 92 L 106 94 Z"/>
    <path d="M 96 132 L 84 126 L 98 124 Z"/>
  </g>

  
  <g>
    <path d="M 146 58 C 158 52 168 56 172 64 C 176 72 180 84 186 94 C 190 100 188 106 182 106 C 174 106 166 100 160 92 C 152 94 144 90 140 80 C 136 70 138 62 146 58 Z"
          fill={p.body2}/>
    
    <path d="M 160 92 C 164 100 172 106 180 108 C 174 112 164 110 158 104 C 154 100 154 96 156 93 Z" fill={p.body3}/>
    
    <path d="M 154 60 C 164 62 172 72 180 88 L 176 90 C 168 76 161 67 152 64 Z" fill={p.bone} opacity="0.4"/>
    
    <ellipse cx="181" cy="96" rx="2.6" ry="1.8" fill={p.dark}/>
    
    <g fill={p.bone}>
      <path d="M 164 99 l 2 5 l 2.5 -4 z"/>
      <path d="M 171 102 l 1.5 5 l 2.5 -4 z"/>
    </g>
    
    <ellipse cx="153" cy="72" rx="5.4" ry="4.6" fill={p.dark}/>
    <ellipse cx="153" cy="72" rx="3.4" ry="2.8" fill={p.glow} style={{filter:`drop-shadow(0 0 3px ${p.glow})`}}/>
    
    <path d="M 148 56 L 142 40 L 154 50 Z" fill={p.horn}/>
    <path d="M 158 54 L 158 40 L 166 52 Z" fill={p.horn2}/>
  </g>

  
  <g transform="translate(118 152)">
    <g fill={p.metalDark}>
      <rect x="-3.5" y="-22" width="7" height="8"/>
      <rect x="-3.5" y="14" width="7" height="8"/>
      <rect x="-22" y="-3.5" width="8" height="7"/>
      <rect x="14" y="-3.5" width="8" height="7"/>
    </g>
    <circle r="16" fill={p.metalDark}/>
    <circle r="10.5" fill={p.metal}/>
    <circle r="4" fill={p.dark}/>
  </g>

  
  <rect x="134" y="120" width="6" height="15" rx="2" fill={p.horn} transform="rotate(22 137 127)"/>
  <circle cx="146" cy="114" r="3" fill={p.ash} opacity="0.4"/>
  <circle cx="152" cy="106" r="2.2" fill={p.ash} opacity="0.3"/>

  <g fill={p.ash} opacity="0.5">
    <circle cx="40" cy="84" r="1.2"/><circle cx="170" cy="140" r="1.1"/>
  </g>
    </g>
  );
}

function Colossus({ p }) {
  return (
    <g>
<path d="M 38 90 C 26 96 20 112 24 132 C 27 146 36 156 48 158 L 54 142 C 46 138 42 128 44 116 C 45 106 50 98 56 94 Z" fill={p.body3}/>
  <path d="M 162 90 C 174 96 180 112 176 132 C 173 146 164 156 152 158 L 146 142 C 154 138 158 128 156 116 C 155 106 150 98 144 94 Z" fill={p.body3}/>
  
  <path d="M 56 84 L 144 84 L 150 122 L 142 160 L 58 160 L 50 122 Z" fill={p.body2}/>
  <path d="M 56 84 L 100 84 L 100 160 L 58 160 L 50 122 Z" fill={p.fin}/>
  
  <g stroke={p.dark} strokeWidth="2">
    <line x1="52" y1="110" x2="148" y2="110"/>
    <line x1="54" y1="136" x2="146" y2="136"/>
    <line x1="84" y1="84" x2="82" y2="110"/>
    <line x1="118" y1="110" x2="120" y2="136"/>
    <line x1="96" y1="136" x2="94" y2="160"/>
  </g>
  
  <path d="M 64 92 L 70 102 L 66 112" fill="none" stroke={p.dark} strokeWidth="1.6"/>
  <path d="M 134 142 L 128 150 L 132 158" fill="none" stroke={p.dark} strokeWidth="1.6"/>
  
  <path d="M 74 30 L 74 84 L 126 84 L 126 30 L 116 30 L 116 38 L 108 38 L 108 30 L 92 30 L 92 38 L 84 38 L 84 30 Z"
        fill={p.body2}/>
  <path d="M 74 30 L 74 84 L 96 84 L 96 38 L 92 38 L 92 30 L 84 30 L 84 38 L 74 38 Z" fill={p.fin}/>
  
  <g stroke={p.dark} strokeWidth="1.4">
    <line x1="74" y1="52" x2="126" y2="52"/>
    <line x1="74" y1="68" x2="126" y2="68"/>
    <line x1="96" y1="38" x2="96" y2="52"/>
    <line x1="110" y1="52" x2="110" y2="68"/>
  </g>
  
  <path d="M 86 56 a 4 5 0 0 1 8 0 l 0 6 l -8 0 Z" fill={p.glow} style={{filter:`drop-shadow(0 0 3px ${p.glow})`}}/>
  <path d="M 106 56 a 4 5 0 0 1 8 0 l 0 6 l -8 0 Z" fill={p.glow} style={{filter:`drop-shadow(0 0 3px ${p.glow})`}}/>
  
  <path d="M 92 84 a 8 9 0 0 1 16 0 l 0 0 l -16 0 Z" fill={p.dark}/>
  <g stroke={p.metalDark} strokeWidth="1.6">
    <line x1="96" y1="78" x2="96" y2="84"/>
    <line x1="100" y1="76" x2="100" y2="84"/>
    <line x1="104" y1="78" x2="104" y2="84"/>
  </g>
  
  <g stroke={p.metalDark} strokeWidth="2.2" fill="none" opacity="0.9">
    <circle cx="66" cy="120" r="3.4"/><circle cx="78" cy="124" r="3.4"/><circle cx="90" cy="127" r="3.4"/>
    <circle cx="102" cy="128" r="3.4"/><circle cx="114" cy="127" r="3.4"/><circle cx="126" cy="124" r="3.4"/><circle cx="138" cy="120" r="3.4"/>
  </g>
  
  <rect x="34" y="152" width="26" height="20" rx="5" fill={p.fin}/>
  <rect x="140" y="152" width="26" height="20" rx="5" fill={p.fin}/>
  <g fill={p.ash} opacity="0.5">
    <circle cx="40" cy="56" r="1.2"/><circle cx="164" cy="64" r="1.1"/>
  </g>
    </g>
  );
}

function Plague({ p }) {
  return (
    <g>
<path d="M 100 60 C 130 62 144 84 142 112 C 141 132 148 148 140 164 L 130 154 L 126 168 L 114 156 L 108 170 L 98 156 L 90 168 L 82 154 L 72 164 C 64 148 71 132 70 112 C 68 84 74 62 100 60 Z"
        fill={p.body2}/>
  <path d="M 100 60 C 74 62 68 84 70 112 C 71 132 64 148 72 164 L 82 154 L 84 112 C 83 88 88 70 100 60 Z" fill={p.body3}/>
  
  <path d="M 80 66 L 100 78 L 120 66 L 114 58 L 86 58 Z" fill={p.fin}/>
  
  <ellipse cx="100" cy="38" rx="34" ry="8" fill={p.horn}/>
  <path d="M 82 38 C 82 24 90 16 100 16 C 110 16 118 24 118 38 Z" fill={p.fin}/>
  <path d="M 82 38 C 82 24 90 16 100 16 C 94 22 90 30 90 38 Z" fill={p.horn}/>
  
  <path d="M 84 44 C 84 38 92 34 100 34 C 108 34 116 38 116 44 C 116 52 110 56 104 56 L 96 56 C 90 56 84 52 84 44 Z" fill={p.dark}/>
  <path d="M 98 48 C 106 46 118 50 126 60 C 118 60 110 58 104 56 C 100 54 97 51 98 48 Z" fill={p.bone}/>
  <path d="M 98 48 C 104 47 112 50 120 56 C 112 55 105 53 101 51 Z" fill={p.bone2}/>
  
  <circle cx="95" cy="46" r="4.6" fill={p.dark} stroke={p.metalDark} strokeWidth="1.4"/>
  <circle cx="95" cy="46" r="2.2" fill={p.glow} style={{filter:`drop-shadow(0 0 3px ${p.glow})`}}/>
  
  <line x1="142" y1="70" x2="134" y2="166" stroke={p.horn} strokeWidth="4.5" strokeLinecap="round"/>
  <path d="M 142 70 C 136 60 140 50 150 48 C 144 54 144 62 148 68 Z" fill={p.horn}/>
  <circle cx="149" cy="50" r="3.4" fill={p.glow} style={{filter:`drop-shadow(0 0 3px ${p.glow})`}}/>
  
  <g fill={p.bone}>
    <rect x="134" y="96" width="12" height="5" rx="2.5"/>
    <rect x="134" y="102" width="12" height="5" rx="2.5"/>
  </g>
  
  <g transform="rotate(-12 56 92)">
    <rect x="46" y="84" width="20" height="14" rx="1.5" fill={p.bone}/>
    <line x1="50" y1="89" x2="62" y2="89" stroke={p.body2} strokeWidth="1.3"/>
    <line x1="50" y1="93" x2="58" y2="93" stroke={p.body2} strokeWidth="1.3"/>
  </g>
  <g transform="rotate(9 52 124)">
    <rect x="42" y="116" width="18" height="13" rx="1.5" fill={p.bone2}/>
    <text x="51" y="126" fontFamily="Georgia, serif" fontSize="9" fontWeight="bold" fill={p.body2} textAnchor="middle">$</text>
  </g>
  <g fill={p.ash} opacity="0.5">
    <circle cx="160" cy="120" r="1.2"/><circle cx="44" cy="60" r="1.1"/>
  </g>
    </g>
  );
}

function Shade({ p }) {
  return (
    <g>
<path d="M 100 34 C 122 38 132 58 128 82 C 125 100 132 114 126 130 C 122 142 112 148 104 150 C 108 140 106 132 100 128 C 94 132 92 140 96 150 C 88 148 78 142 74 130 C 68 114 75 100 72 82 C 68 58 78 38 100 34 Z"
        fill={p.body2} opacity="0.95"/>
  <path d="M 100 34 C 78 38 68 58 72 82 C 75 100 68 114 74 130 C 78 142 88 148 96 150 C 92 140 94 132 100 128 L 100 34 Z" fill={p.body3} opacity="0.95"/>
  
  <path d="M 88 152 C 84 160 86 168 92 172 C 90 164 92 158 96 154 Z" fill={p.fin} opacity="0.7"/>
  <path d="M 112 152 C 116 160 114 168 108 172 C 110 164 108 158 104 154 Z" fill={p.fin} opacity="0.55"/>
  <path d="M 100 156 C 100 164 102 170 100 178 C 98 170 100 164 100 156 Z" fill={p.fin} opacity="0.4"/>
  
  <ellipse cx="100" cy="62" rx="15" ry="13" fill={p.dark}/>
  <ellipse cx="100" cy="60" rx="5.5" ry="6.5" fill={p.glow} style={{filter:`drop-shadow(0 0 4px ${p.glow})`}}/>
  <ellipse cx="100" cy="60" rx="2" ry="5" fill={p.pupil}/>
  
  <g fill={p.fin}>
    <path d="M 74 90 C 56 96 44 110 40 128 C 39 134 42 138 46 138 C 44 130 48 120 56 112 C 63 105 70 100 78 98 Z"/>
    <path d="M 46 138 C 42 144 40 152 42 158 L 45 156 C 44 151 45 146 48 141 Z"/>
    <path d="M 50 140 C 48 147 48 154 51 160 L 54 157 C 52 152 52 146 54 142 Z"/>
    <path d="M 126 90 C 144 96 156 110 160 128 C 161 134 158 138 154 138 C 156 130 152 120 144 112 C 137 105 130 100 122 98 Z"/>
    <path d="M 154 138 C 158 144 160 152 158 158 L 155 156 C 156 151 155 146 152 141 Z"/>
    <path d="M 150 140 C 152 147 152 154 149 160 L 146 157 C 148 152 148 146 146 142 Z"/>
  </g>
  
  <g transform="rotate(-14 144 70)">
    <path d="M 134 62 L 154 62 L 154 78 L 148 76 L 144 80 L 140 76 L 134 78 Z" fill={p.bone}/>
    <text x="144" y="73" fontFamily="Georgia, serif" fontSize="8" fontWeight="bold" fill={p.body2} textAnchor="middle">IOU</text>
  </g>
  
  <g stroke={p.ash} strokeWidth="1.2" fill="none" opacity="0.5">
    <path d="M 62 54 q 6 -3 12 0"/>
    <path d="M 56 64 q 5 -2 10 0"/>
  </g>
  <g fill={p.ash} opacity="0.5">
    <circle cx="160" cy="100" r="1.2"/><circle cx="40" cy="80" r="1.0"/>
  </g>
    </g>
  );
}

const MODELS = {
  credit: Usurer,
  student: Wraith,
  car: Steed,
  mortgage: Colossus,
  medical: Plague,
  personal: Shade,
};

export default function BossArt({ type, skin = "blood", size = 80, dead = false, className }) {
  const p = PALETTES[skin] || PALETTES.blood;
  const Model = MODELS[type] || Shade;
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      style={{ display: "block", filter: dead ? "grayscale(1) brightness(.65)" : "none", overflow: "visible" }}
    >
      <Model p={p} />
    </svg>
  );
}
