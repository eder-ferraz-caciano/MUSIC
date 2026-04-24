// Compact chord dictionary — one playable shape per chord, sized for mini-diagram cards.
// Roles drive the dot color in ChordDiagram.vue.

export type NoteRole = 'root' | 'third' | 'fifth' | 'seventh' | 'tension' | 'ninth'

export interface Position {
    string: number   // 1 (high E) – 6 (low E)
    fret: number     // 0 = open, >=1 = fretted
    role: NoteRole
    finger?: number  // 1–4 (index–pinky), optional hint
}

export interface Barre {
    fret: number
    fromString: number  // higher-numbered string (e.g. 6)
    toString: number    // lower-numbered string (e.g. 1)
    role?: NoteRole
}

export type ChordCategory =
    | 'triad_open'
    | 'triad_barre'
    | 'slash'
    | 'power'
    | 'dom7'
    | 'maj7'
    | 'min7'
    | 'six'
    | 'sus'
    | 'add9'
    | 'dim'
    | 'aug'
    | 'half_dim'
    | 'extended'
    | 'altered'

export interface DictChord {
    id: string
    name: string              // short label: "C", "Am7", "C7#9"
    fullName: string          // "Dó Maior", "Sol Dominante 7"
    category: ChordCategory
    baseFret: number          // lowest fret shown on the diagram
    positions: Position[]     // fret=0 for open strings
    mutedStrings: number[]    // strings not played at all (X marker)
    barre?: Barre
    desc: string              // one-line character / function
    tip?: string              // fingering / practice hint
}

// Short position builder
const p = (string: number, fret: number, role: NoteRole, finger?: number): Position =>
    ({ string, fret, role, finger })

export const CATEGORY_META: Record<ChordCategory, { label: string; color: string; blurb: string }> = {
    triad_open:  { label: 'Tríades Abertas',     color: 'emerald', blurb: 'Cordas soltas e ressonância natural — a base de toda guitarra.' },
    triad_barre: { label: 'Tríades com Pestana', color: 'lime',    blurb: 'Shapes móveis que reutilizam a mesma forma ao longo do braço.' },
    slash:       { label: 'Inversões (slash)',   color: 'blue',    blurb: 'Acorde com uma nota específica no baixo — bordaduras e linhas de baixo.' },
    power:       { label: 'Power Chords (5)',    color: 'red',     blurb: 'Apenas fundamental e 5ª — a alma do rock e do metal.' },
    dom7:        { label: '7ª Dominante',        color: 'amber',   blurb: 'Tensão que pede resolução — o motor do blues e do funk.' },
    maj7:        { label: '7ª Maior',            color: 'sky',     blurb: 'Cor suave e sonhadora — pilar do jazz e bossa nova.' },
    min7:        { label: '7ª Menor',            color: 'indigo',  blurb: 'Melancólico e fluido — presente em soul, jazz e R&B.' },
    six:         { label: '6ª (add6)',           color: 'yellow',  blurb: '6ª maior no topo — cor vintage do jazz e da bossa dos anos 60.' },
    sus:         { label: 'Suspensos (sus2/4)',  color: 'teal',    blurb: 'Sem a terça — ambíguos, etéreos, com tensão não resolvida.' },
    add9:        { label: 'Add9',                color: 'cyan',    blurb: 'Maior com um brilho extra na 9ª — som moderno e arejado.' },
    dim:         { label: 'Diminutos',           color: 'rose',    blurb: 'Simétricos e instáveis — transições cromáticas e mistério.' },
    aug:         { label: 'Aumentados',          color: 'orange',  blurb: 'Quinta aumentada — suspense, cinema, inquietude.' },
    half_dim:    { label: 'Meio-diminuto (m7b5)',color: 'fuchsia', blurb: 'O ii° do menor — porta de entrada para progressões jazzísticas.' },
    extended:    { label: 'Tensões 9 / 11 / 13', color: 'violet',  blurb: 'Tensões coloridas empilhadas — linguagem jazz moderna.' },
    altered:     { label: 'Dissonantes / Alt',   color: 'pink',    blurb: 'Dominantes com notas alteradas — o som "fora" do jazz e do fusion.' },
}

export const chordDictionary: DictChord[] = [

    // ══════════════ TRÍADES ABERTAS ══════════════
    {
        id: 'C', name: 'C', fullName: 'Dó Maior', category: 'triad_open', baseFret: 1,
        desc: 'A tríade-rainha da música popular. Alegre, estável, fundamental.',
        tip: 'Dedo 1 na 1ª casa da 2ª corda, dedo 2 na 2ª da 4ª, dedo 3 na 3ª da 5ª.',
        mutedStrings: [6],
        positions: [
            p(5, 3, 'root', 3), p(4, 2, 'third', 2), p(3, 0, 'fifth'),
            p(2, 1, 'root', 1), p(1, 0, 'third'),
        ],
    },
    {
        id: 'D', name: 'D', fullName: 'Ré Maior', category: 'triad_open', baseFret: 1,
        desc: 'Compacto e brilhante — favorito do pop acústico.',
        tip: 'Forma de triângulo com os três dedos na casa 2 e 3.',
        mutedStrings: [6, 5],
        positions: [
            p(4, 0, 'root'), p(3, 2, 'fifth', 1),
            p(2, 3, 'root', 3), p(1, 2, 'third', 2),
        ],
    },
    {
        id: 'E', name: 'E', fullName: 'Mi Maior', category: 'triad_open', baseFret: 1,
        desc: 'O acorde mais poderoso: todas as 6 cordas ressoam livres.',
        mutedStrings: [],
        positions: [
            p(6, 0, 'root'), p(5, 2, 'fifth', 2), p(4, 2, 'root', 3),
            p(3, 1, 'third', 1), p(2, 0, 'fifth'), p(1, 0, 'root'),
        ],
    },
    {
        id: 'F', name: 'F', fullName: 'Fá Maior (pestana)', category: 'triad_open', baseFret: 1,
        desc: 'O "rito de passagem" — primeira pestana do iniciante.',
        tip: 'Indicador pressiona todas as cordas na casa 1; os demais dedos formam o E-shape.',
        mutedStrings: [],
        barre: { fret: 1, fromString: 6, toString: 1, role: 'root' },
        positions: [
            p(6, 1, 'root', 1), p(5, 3, 'fifth', 3), p(4, 3, 'root', 4),
            p(3, 2, 'third', 2), p(2, 1, 'fifth', 1), p(1, 1, 'root', 1),
        ],
    },
    {
        id: 'G', name: 'G', fullName: 'Sol Maior', category: 'triad_open', baseFret: 1,
        desc: 'Som aberto e cheio — as 6 cordas soam.',
        tip: 'Dedos 2, 1 e 3 formando um "X" — dedo 3 na 3ª casa da 1ª corda.',
        mutedStrings: [],
        positions: [
            p(6, 3, 'root', 2), p(5, 2, 'third', 1), p(4, 0, 'fifth'),
            p(3, 0, 'root'), p(2, 0, 'third'), p(1, 3, 'root', 3),
        ],
    },
    {
        id: 'A', name: 'A', fullName: 'Lá Maior', category: 'triad_open', baseFret: 1,
        desc: 'Três dedos em fila na mesma casa — simples e brilhante.',
        mutedStrings: [6],
        positions: [
            p(5, 0, 'root'), p(4, 2, 'fifth', 1), p(3, 2, 'root', 2),
            p(2, 2, 'third', 3), p(1, 0, 'fifth'),
        ],
    },
    {
        id: 'B', name: 'B', fullName: 'Si Maior (pestana)', category: 'triad_open', baseFret: 2,
        desc: 'A-shape deslocado para a casa 2. Base para todo acorde maior móvel.',
        mutedStrings: [6],
        barre: { fret: 2, fromString: 5, toString: 1, role: 'root' },
        positions: [
            p(5, 2, 'root', 1), p(4, 4, 'fifth', 2),
            p(3, 4, 'root', 3), p(2, 4, 'third', 4), p(1, 2, 'fifth', 1),
        ],
    },
    {
        id: 'Am', name: 'Am', fullName: 'Lá Menor', category: 'triad_open', baseFret: 1,
        desc: 'O acorde triste por excelência. Primeiro menor de quase todo iniciante.',
        mutedStrings: [6],
        positions: [
            p(5, 0, 'root'), p(4, 2, 'fifth', 2), p(3, 2, 'root', 3),
            p(2, 1, 'third', 1), p(1, 0, 'fifth'),
        ],
    },
    {
        id: 'Dm', name: 'Dm', fullName: 'Ré Menor', category: 'triad_open', baseFret: 1,
        desc: 'Melancolia compacta na região aguda.',
        mutedStrings: [6, 5],
        positions: [
            p(4, 0, 'root'), p(3, 2, 'fifth', 2),
            p(2, 3, 'root', 3), p(1, 1, 'third', 1),
        ],
    },
    {
        id: 'Em', name: 'Em', fullName: 'Mi Menor', category: 'triad_open', baseFret: 1,
        desc: 'O mais fácil de todos — apenas 2 dedos, 6 cordas soando.',
        mutedStrings: [],
        positions: [
            p(6, 0, 'root'), p(5, 2, 'fifth', 2), p(4, 2, 'root', 3),
            p(3, 0, 'third'), p(2, 0, 'fifth'), p(1, 0, 'root'),
        ],
    },

    // ══════════════ TRÍADES COM PESTANA ══════════════
    {
        id: 'Bb', name: 'B♭', fullName: 'Si Bemol Maior (pestana)', category: 'triad_barre', baseFret: 1,
        desc: 'A-shape barre na casa 1. Chave muito usada em jazz e sopros.',
        mutedStrings: [6],
        barre: { fret: 1, fromString: 5, toString: 1, role: 'root' },
        positions: [
            p(5, 1, 'root', 1), p(4, 3, 'fifth', 2),
            p(3, 3, 'root', 3), p(2, 3, 'third', 4), p(1, 1, 'fifth', 1),
        ],
    },
    {
        id: 'Fsm', name: 'F♯m', fullName: 'Fá Sustenido Menor (pestana)', category: 'triad_barre', baseFret: 2,
        desc: 'Em-shape menor na casa 2. Som escuro e profundo.',
        mutedStrings: [],
        barre: { fret: 2, fromString: 6, toString: 1, role: 'root' },
        positions: [
            p(6, 2, 'root', 1), p(5, 4, 'fifth', 3), p(4, 4, 'root', 4),
            p(3, 2, 'third', 1), p(2, 2, 'fifth', 1), p(1, 2, 'root', 1),
        ],
    },
    {
        id: 'Cm', name: 'Cm', fullName: 'Dó Menor (pestana)', category: 'triad_barre', baseFret: 3,
        desc: 'Am-shape na casa 3 — mesma forma do Am deslocada.',
        mutedStrings: [6],
        barre: { fret: 3, fromString: 5, toString: 1, role: 'root' },
        positions: [
            p(5, 3, 'root', 1), p(4, 5, 'fifth', 3), p(3, 5, 'root', 4),
            p(2, 4, 'third', 2), p(1, 3, 'fifth', 1),
        ],
    },
    {
        id: 'Bm', name: 'Bm', fullName: 'Si Menor (pestana)', category: 'triad_barre', baseFret: 2,
        desc: 'Am-shape na casa 2. Rock, pop, bossa — onipresente.',
        mutedStrings: [6],
        barre: { fret: 2, fromString: 5, toString: 1, role: 'root' },
        positions: [
            p(5, 2, 'root', 1), p(4, 4, 'fifth', 3), p(3, 4, 'root', 4),
            p(2, 3, 'third', 2), p(1, 2, 'fifth', 1),
        ],
    },
    {
        id: 'Gm', name: 'Gm', fullName: 'Sol Menor (pestana)', category: 'triad_barre', baseFret: 3,
        desc: 'Em-shape na casa 3. Muito comum em sambas e baladas.',
        mutedStrings: [],
        barre: { fret: 3, fromString: 6, toString: 1, role: 'root' },
        positions: [
            p(6, 3, 'root', 1), p(5, 5, 'fifth', 3), p(4, 5, 'root', 4),
            p(3, 3, 'third', 1), p(2, 3, 'fifth', 1), p(1, 3, 'root', 1),
        ],
    },
    {
        id: 'Csharp', name: 'C♯', fullName: 'Dó Sustenido Maior (pestana)', category: 'triad_barre', baseFret: 4,
        desc: 'A-shape barre na casa 4 — a mesma forma de B deslocada 2 casas.',
        mutedStrings: [6],
        barre: { fret: 4, fromString: 5, toString: 1, role: 'root' },
        positions: [
            p(5, 4, 'root', 1), p(4, 6, 'fifth', 2),
            p(3, 6, 'root', 3), p(2, 6, 'third', 4), p(1, 4, 'fifth', 1),
        ],
    },
    {
        id: 'Eb', name: 'E♭', fullName: 'Mi Bemol Maior (pestana)', category: 'triad_barre', baseFret: 6,
        desc: 'A-shape barre na casa 6 — tonalidade clássica do jazz.',
        mutedStrings: [6],
        barre: { fret: 6, fromString: 5, toString: 1, role: 'root' },
        positions: [
            p(5, 6, 'root', 1), p(4, 8, 'fifth', 2),
            p(3, 8, 'root', 3), p(2, 8, 'third', 4), p(1, 6, 'fifth', 1),
        ],
    },
    {
        id: 'Fs', name: 'F♯', fullName: 'Fá Sustenido Maior (pestana)', category: 'triad_barre', baseFret: 2,
        desc: 'E-shape barre na casa 2 — maior versão do F♯m, base do rock.',
        mutedStrings: [],
        barre: { fret: 2, fromString: 6, toString: 1, role: 'root' },
        positions: [
            p(6, 2, 'root', 1), p(5, 4, 'fifth', 3), p(4, 4, 'root', 4),
            p(3, 3, 'third', 2), p(2, 2, 'fifth', 1), p(1, 2, 'root', 1),
        ],
    },
    {
        id: 'Gs', name: 'G♯', fullName: 'Sol Sustenido Maior (pestana)', category: 'triad_barre', baseFret: 4,
        desc: 'E-shape barre na casa 4 — enharmônico a A♭.',
        mutedStrings: [],
        barre: { fret: 4, fromString: 6, toString: 1, role: 'root' },
        positions: [
            p(6, 4, 'root', 1), p(5, 6, 'fifth', 3), p(4, 6, 'root', 4),
            p(3, 5, 'third', 2), p(2, 4, 'fifth', 1), p(1, 4, 'root', 1),
        ],
    },

    // ══════════════ INVERSÕES / SLASH ══════════════
    {
        id: 'G_B', name: 'G/B', fullName: 'Sol com Si no baixo', category: 'slash', baseFret: 1,
        desc: 'G com a 3ª no baixo — ponte melódica clássica entre C e Am.',
        tip: 'Essencial em progressões como C–G/B–Am.',
        mutedStrings: [6],
        positions: [
            p(5, 2, 'third', 2), p(4, 0, 'fifth'), p(3, 0, 'root'),
            p(2, 3, 'fifth', 3), p(1, 3, 'root', 4),
        ],
    },
    {
        id: 'C_E', name: 'C/E', fullName: 'Dó com Mi no baixo', category: 'slash', baseFret: 1,
        desc: '1ª inversão do Dó — baixo descendente E–D–C suave.',
        mutedStrings: [],
        positions: [
            p(6, 0, 'third'), p(5, 3, 'root', 3), p(4, 2, 'third', 2),
            p(3, 0, 'fifth'), p(2, 1, 'root', 1), p(1, 0, 'third'),
        ],
    },
    {
        id: 'C_G', name: 'C/G', fullName: 'Dó com Sol no baixo', category: 'slash', baseFret: 1,
        desc: '2ª inversão do Dó — grave mais profundo, som de coral.',
        mutedStrings: [],
        positions: [
            p(6, 3, 'fifth', 3), p(5, 3, 'root', 4), p(4, 2, 'third', 2),
            p(3, 0, 'fifth'), p(2, 1, 'root', 1), p(1, 0, 'third'),
        ],
    },
    {
        id: 'D_Fs', name: 'D/F♯', fullName: 'Ré com Fá♯ no baixo', category: 'slash', baseFret: 1,
        desc: '1ª inversão do Ré — ponte cromática entre G e Em.',
        tip: 'Use o polegar na 6ª corda para pegar o F♯ grave.',
        mutedStrings: [],
        positions: [
            p(6, 2, 'third', 1), p(5, 0, 'fifth'), p(4, 0, 'root'),
            p(3, 2, 'fifth', 2), p(2, 3, 'root', 3), p(1, 2, 'third', 4),
        ],
    },
    {
        id: 'D_A', name: 'D/A', fullName: 'Ré com Lá no baixo', category: 'slash', baseFret: 1,
        desc: '2ª inversão do Ré — som mais compacto e "equilibrado".',
        mutedStrings: [6],
        positions: [
            p(5, 0, 'fifth'), p(4, 0, 'root'), p(3, 2, 'fifth', 1),
            p(2, 3, 'root', 3), p(1, 2, 'third', 2),
        ],
    },
    {
        id: 'F_A', name: 'F/A', fullName: 'Fá com Lá no baixo', category: 'slash', baseFret: 1,
        desc: '1ª inversão do Fá — alternativa ao F pestana com baixo na 3ª.',
        mutedStrings: [6],
        barre: { fret: 1, fromString: 2, toString: 1, role: 'root' },
        positions: [
            p(5, 0, 'third'), p(4, 3, 'root', 4), p(3, 2, 'fifth', 3),
            p(2, 1, 'third', 1), p(1, 1, 'root', 1),
        ],
    },
    {
        id: 'F_C', name: 'F/C', fullName: 'Fá com Dó no baixo', category: 'slash', baseFret: 1,
        desc: '2ª inversão do Fá — baixo de C pedal sustentado.',
        mutedStrings: [6],
        barre: { fret: 1, fromString: 2, toString: 1, role: 'root' },
        positions: [
            p(5, 3, 'fifth', 3), p(4, 3, 'root', 4), p(3, 2, 'third', 2),
            p(2, 1, 'fifth', 1), p(1, 1, 'root', 1),
        ],
    },
    {
        id: 'Am_E', name: 'Am/E', fullName: 'Lá Menor com Mi no baixo', category: 'slash', baseFret: 1,
        desc: '2ª inversão do Am — grave profundo, usado em Stairway to Heaven.',
        mutedStrings: [],
        positions: [
            p(6, 0, 'fifth'), p(5, 0, 'root'), p(4, 2, 'fifth', 2),
            p(3, 2, 'root', 3), p(2, 1, 'third', 1), p(1, 0, 'fifth'),
        ],
    },
    {
        id: 'Em_G', name: 'Em/G', fullName: 'Mi Menor com Sol no baixo', category: 'slash', baseFret: 1,
        desc: '1ª inversão do Em — terceiro menor no baixo, som tristonho.',
        mutedStrings: [5],
        positions: [
            p(6, 3, 'third', 3), p(4, 2, 'root', 2),
            p(3, 0, 'third'), p(2, 0, 'fifth'), p(1, 0, 'root'),
        ],
    },
    {
        id: 'G_D', name: 'G/D', fullName: 'Sol com Ré no baixo', category: 'slash', baseFret: 1,
        desc: '2ª inversão do Sol — pedal de Ré para transições suaves.',
        mutedStrings: [6, 5],
        positions: [
            p(4, 0, 'fifth'), p(3, 0, 'root'),
            p(2, 0, 'third'), p(1, 3, 'root', 3),
        ],
    },

    // ══════════════ POWER CHORDS (5) ══════════════
    {
        id: 'E5', name: 'E5', fullName: 'Mi Power (5)', category: 'power', baseFret: 1,
        desc: 'Sem 3ª — pura, neutra, esmagadora. Base do rock em E.',
        mutedStrings: [3, 2, 1],
        positions: [
            p(6, 0, 'root'), p(5, 2, 'fifth', 2), p(4, 2, 'root', 3),
        ],
    },
    {
        id: 'A5', name: 'A5', fullName: 'Lá Power (5)', category: 'power', baseFret: 1,
        desc: 'Power chord aberto em A — gatilho de punk e grunge.',
        mutedStrings: [6, 2, 1],
        positions: [
            p(5, 0, 'root'), p(4, 2, 'fifth', 2), p(3, 2, 'root', 3),
        ],
    },
    {
        id: 'D5', name: 'D5', fullName: 'Ré Power (5)', category: 'power', baseFret: 1,
        desc: 'Power chord compacto em D.',
        mutedStrings: [6, 5, 1],
        positions: [
            p(4, 0, 'root'), p(3, 2, 'fifth', 1), p(2, 3, 'root', 3),
        ],
    },
    {
        id: 'G5', name: 'G5', fullName: 'Sol Power (5)', category: 'power', baseFret: 3,
        desc: 'Shape móvel — a mesma forma serve para qualquer power chord grave.',
        mutedStrings: [3, 2, 1],
        positions: [
            p(6, 3, 'root', 1), p(5, 5, 'fifth', 3), p(4, 5, 'root', 4),
        ],
    },
    {
        id: 'C5', name: 'C5', fullName: 'Dó Power (5)', category: 'power', baseFret: 3,
        desc: 'Power chord em C — base de riffs pesados.',
        mutedStrings: [6, 2, 1],
        positions: [
            p(5, 3, 'root', 1), p(4, 5, 'fifth', 3), p(3, 5, 'root', 4),
        ],
    },
    {
        id: 'F5', name: 'F5', fullName: 'Fá Power (5)', category: 'power', baseFret: 1,
        desc: 'A ponte entre E5 e G5 — shape móvel sem pestana completa.',
        mutedStrings: [3, 2, 1],
        positions: [
            p(6, 1, 'root', 1), p(5, 3, 'fifth', 3), p(4, 3, 'root', 4),
        ],
    },
    {
        id: 'B5', name: 'B5', fullName: 'Si Power (5)', category: 'power', baseFret: 2,
        desc: 'Si sem peso harmônico — ótimo para riffs rápidos no registro médio.',
        mutedStrings: [6, 2, 1],
        positions: [
            p(5, 2, 'root', 1), p(4, 4, 'fifth', 3), p(3, 4, 'root', 4),
        ],
    },

    // ══════════════ 7ª DOMINANTE ══════════════
    {
        id: 'C7', name: 'C7', fullName: 'Dó Dominante 7', category: 'dom7', baseFret: 1,
        desc: 'Funky, bluesy, pede resolução em Fá. A 7ª menor muda tudo.',
        mutedStrings: [6],
        positions: [
            p(5, 3, 'root', 3), p(4, 2, 'third', 2), p(3, 3, 'seventh', 4),
            p(2, 1, 'root', 1), p(1, 0, 'third'),
        ],
    },
    {
        id: 'D7', name: 'D7', fullName: 'Ré Dominante 7', category: 'dom7', baseFret: 1,
        desc: 'Triângulo invertido — tensão compacta que resolve em Sol.',
        mutedStrings: [6, 5],
        positions: [
            p(4, 0, 'root'), p(3, 2, 'third', 2),
            p(2, 1, 'seventh', 1), p(1, 2, 'fifth', 3),
        ],
    },
    {
        id: 'E7', name: 'E7', fullName: 'Mi Dominante 7', category: 'dom7', baseFret: 1,
        desc: 'Base do blues em E. Apenas 2 dedos, som grave e pesado.',
        mutedStrings: [],
        positions: [
            p(6, 0, 'root'), p(5, 2, 'fifth', 2), p(4, 0, 'seventh'),
            p(3, 1, 'third', 1), p(2, 0, 'fifth'), p(1, 0, 'root'),
        ],
    },
    {
        id: 'F7', name: 'F7', fullName: 'Fá Dominante 7 (pestana)', category: 'dom7', baseFret: 1,
        desc: 'E-shape dom7 na casa 1 — dominante do Si bemol.',
        mutedStrings: [],
        barre: { fret: 1, fromString: 6, toString: 1, role: 'root' },
        positions: [
            p(6, 1, 'root', 1), p(5, 3, 'fifth', 3), p(4, 1, 'seventh', 1),
            p(3, 2, 'third', 2), p(2, 1, 'fifth', 1), p(1, 1, 'root', 1),
        ],
    },
    {
        id: 'G7', name: 'G7', fullName: 'Sol Dominante 7', category: 'dom7', baseFret: 1,
        desc: 'Clássico do country e do blues aberto em G.',
        mutedStrings: [],
        positions: [
            p(6, 3, 'root', 3), p(5, 2, 'third', 2), p(4, 0, 'fifth'),
            p(3, 0, 'root'), p(2, 0, 'third'), p(1, 1, 'seventh', 1),
        ],
    },
    {
        id: 'A7', name: 'A7', fullName: 'Lá Dominante 7', category: 'dom7', baseFret: 1,
        desc: 'Resolve em Ré — a V do blues em D.',
        mutedStrings: [6],
        positions: [
            p(5, 0, 'root'), p(4, 2, 'fifth', 2), p(3, 0, 'seventh'),
            p(2, 2, 'third', 3), p(1, 0, 'fifth'),
        ],
    },
    {
        id: 'B7', name: 'B7', fullName: 'Si Dominante 7', category: 'dom7', baseFret: 1,
        desc: 'Ponte para Mi — V-I em tonalidade de E.',
        mutedStrings: [6],
        positions: [
            p(5, 2, 'root', 2), p(4, 1, 'third', 1), p(3, 2, 'seventh', 3),
            p(2, 0, 'fifth'), p(1, 2, 'third', 4),
        ],
    },
    {
        id: 'Bb7', name: 'B♭7', fullName: 'Si Bemol Dominante 7 (pestana)', category: 'dom7', baseFret: 1,
        desc: 'A7-shape barre na casa 1. V de Mi♭ — tonalidade frequente de sopros.',
        mutedStrings: [6],
        barre: { fret: 1, fromString: 5, toString: 1, role: 'root' },
        positions: [
            p(5, 1, 'root', 1), p(4, 3, 'fifth', 3), p(3, 1, 'seventh', 1),
            p(2, 3, 'third', 4), p(1, 1, 'fifth', 1),
        ],
    },
    {
        id: 'Fs7', name: 'F♯7', fullName: 'Fá♯ Dominante 7 (pestana)', category: 'dom7', baseFret: 2,
        desc: 'E7-shape barre na casa 2 — V de Si.',
        mutedStrings: [],
        barre: { fret: 2, fromString: 6, toString: 1, role: 'root' },
        positions: [
            p(6, 2, 'root', 1), p(5, 4, 'fifth', 3), p(4, 2, 'seventh', 1),
            p(3, 3, 'third', 2), p(2, 2, 'fifth', 1), p(1, 2, 'root', 1),
        ],
    },
    {
        id: 'Cs7', name: 'C♯7', fullName: 'Dó♯ Dominante 7 (pestana)', category: 'dom7', baseFret: 4,
        desc: 'A7-shape barre na casa 4 — V de Fá♯.',
        mutedStrings: [6],
        barre: { fret: 4, fromString: 5, toString: 1, role: 'root' },
        positions: [
            p(5, 4, 'root', 1), p(4, 6, 'fifth', 3), p(3, 4, 'seventh', 1),
            p(2, 6, 'third', 4), p(1, 4, 'fifth', 1),
        ],
    },

    // ══════════════ 7ª MAIOR ══════════════
    {
        id: 'Cmaj7', name: 'Cmaj7', fullName: 'Dó com 7ª Maior', category: 'maj7', baseFret: 1,
        desc: 'Suavidade jazzística — a 7M brilha sobre o acorde maior.',
        mutedStrings: [6],
        positions: [
            p(5, 3, 'root', 3), p(4, 2, 'third', 2), p(3, 0, 'fifth'),
            p(2, 0, 'seventh'), p(1, 0, 'third'),
        ],
    },
    {
        id: 'Dmaj7', name: 'Dmaj7', fullName: 'Ré com 7ª Maior', category: 'maj7', baseFret: 1,
        desc: 'Cor luminosa típica da bossa.',
        mutedStrings: [6, 5],
        positions: [
            p(4, 0, 'root'), p(3, 2, 'fifth', 2),
            p(2, 2, 'seventh', 1), p(1, 2, 'third', 3),
        ],
    },
    {
        id: 'Fmaj7', name: 'Fmaj7', fullName: 'Fá com 7ª Maior', category: 'maj7', baseFret: 1,
        desc: 'A alternativa doce ao F com pestana — acessível e sofisticado.',
        mutedStrings: [6],
        positions: [
            p(5, 3, 'fifth', 3), p(4, 3, 'root', 4), p(3, 2, 'third', 2),
            p(2, 1, 'seventh', 1), p(1, 0, 'third'),
        ],
    },
    {
        id: 'Gmaj7', name: 'Gmaj7', fullName: 'Sol com 7ª Maior', category: 'maj7', baseFret: 1,
        desc: 'Abre harmonias "flutuantes" — muito usado em intros.',
        mutedStrings: [],
        positions: [
            p(6, 3, 'root', 3), p(5, 2, 'third', 2), p(4, 0, 'fifth'),
            p(3, 0, 'root'), p(2, 0, 'third'), p(1, 2, 'seventh', 4),
        ],
    },
    {
        id: 'Amaj7', name: 'Amaj7', fullName: 'Lá com 7ª Maior', category: 'maj7', baseFret: 1,
        desc: 'A cor de "Something" dos Beatles — sonhador e macio.',
        mutedStrings: [6],
        positions: [
            p(5, 0, 'root'), p(4, 2, 'fifth', 2), p(3, 1, 'seventh', 1),
            p(2, 2, 'third', 3), p(1, 0, 'fifth'),
        ],
    },
    {
        id: 'Ebmaj7', name: 'E♭maj7', fullName: 'Mi Bemol com 7ª Maior', category: 'maj7', baseFret: 6,
        desc: 'A-shape barre de maj7 — tonalidade frequente em jazz.',
        mutedStrings: [6],
        barre: { fret: 6, fromString: 5, toString: 1, role: 'root' },
        positions: [
            p(5, 6, 'root', 1), p(4, 8, 'fifth', 3),
            p(3, 7, 'seventh', 2), p(2, 8, 'third', 4), p(1, 6, 'fifth', 1),
        ],
    },
    {
        id: 'Emaj7', name: 'Emaj7', fullName: 'Mi com 7ª Maior', category: 'maj7', baseFret: 1,
        desc: 'O maj7 mais cheio do violão — 6 cordas soando, som de abertura.',
        mutedStrings: [],
        positions: [
            p(6, 0, 'root'), p(5, 2, 'fifth', 3), p(4, 1, 'seventh', 1),
            p(3, 1, 'third', 2), p(2, 0, 'fifth'), p(1, 0, 'root'),
        ],
    },
    {
        id: 'Bmaj7', name: 'Bmaj7', fullName: 'Si com 7ª Maior (pestana)', category: 'maj7', baseFret: 2,
        desc: 'A-maj7-shape barre na casa 2 — maj7 brilhante, cor de Beatles.',
        mutedStrings: [6],
        barre: { fret: 2, fromString: 5, toString: 1, role: 'root' },
        positions: [
            p(5, 2, 'root', 1), p(4, 4, 'fifth', 3),
            p(3, 3, 'seventh', 2), p(2, 4, 'third', 4), p(1, 2, 'fifth', 1),
        ],
    },
    {
        id: 'Bbmaj7', name: 'B♭maj7', fullName: 'Si Bemol com 7ª Maior (pestana)', category: 'maj7', baseFret: 1,
        desc: 'A-maj7-shape barre na casa 1 — Imaj7 em tonalidade de B♭.',
        mutedStrings: [6],
        barre: { fret: 1, fromString: 5, toString: 1, role: 'root' },
        positions: [
            p(5, 1, 'root', 1), p(4, 3, 'fifth', 3),
            p(3, 2, 'seventh', 2), p(2, 3, 'third', 4), p(1, 1, 'fifth', 1),
        ],
    },
    {
        id: 'Fsmaj7', name: 'F♯maj7', fullName: 'Fá♯ com 7ª Maior (pestana)', category: 'maj7', baseFret: 2,
        desc: 'E-maj7-shape barre na casa 2 — grave e ressonante.',
        mutedStrings: [],
        barre: { fret: 2, fromString: 6, toString: 1, role: 'root' },
        positions: [
            p(6, 2, 'root', 1), p(5, 4, 'fifth', 3), p(4, 3, 'seventh', 2),
            p(3, 3, 'third', 2), p(2, 2, 'fifth', 1), p(1, 2, 'root', 1),
        ],
    },

    // ══════════════ 7ª MENOR ══════════════
    {
        id: 'Am7', name: 'Am7', fullName: 'Lá Menor com 7ª', category: 'min7', baseFret: 1,
        desc: 'Fluido, jazzy, melancólico — uma cor mais "adulta" que Am.',
        mutedStrings: [6],
        positions: [
            p(5, 0, 'root'), p(4, 2, 'fifth', 2), p(3, 0, 'seventh'),
            p(2, 1, 'third', 1), p(1, 0, 'fifth'),
        ],
    },
    {
        id: 'Dm7', name: 'Dm7', fullName: 'Ré Menor com 7ª', category: 'min7', baseFret: 1,
        desc: 'O ii° universal em tonalidade de Dó — start de ii-V-I.',
        mutedStrings: [6, 5],
        positions: [
            p(4, 0, 'root'), p(3, 2, 'fifth', 2),
            p(2, 1, 'seventh', 1), p(1, 1, 'third', 1),
        ],
    },
    {
        id: 'Em7', name: 'Em7', fullName: 'Mi Menor com 7ª', category: 'min7', baseFret: 1,
        desc: '6 cordas soando — uma das texturas mais ricas da guitarra.',
        mutedStrings: [],
        positions: [
            p(6, 0, 'root'), p(5, 2, 'fifth', 2), p(4, 0, 'seventh'),
            p(3, 0, 'third'), p(2, 0, 'fifth'), p(1, 0, 'root'),
        ],
    },
    {
        id: 'Cm7', name: 'Cm7', fullName: 'Dó Menor com 7ª (pestana)', category: 'min7', baseFret: 3,
        desc: 'Am7-shape barre na casa 3 — mesma forma, outra tonalidade.',
        mutedStrings: [6],
        barre: { fret: 3, fromString: 5, toString: 1, role: 'root' },
        positions: [
            p(5, 3, 'root', 1), p(4, 5, 'fifth', 3), p(3, 3, 'seventh', 1),
            p(2, 4, 'third', 2), p(1, 3, 'fifth', 1),
        ],
    },
    {
        id: 'Gm7', name: 'Gm7', fullName: 'Sol Menor com 7ª (pestana)', category: 'min7', baseFret: 3,
        desc: 'Em7-shape barre na casa 3 — soa grave e encorpado.',
        mutedStrings: [],
        barre: { fret: 3, fromString: 6, toString: 1, role: 'root' },
        positions: [
            p(6, 3, 'root', 1), p(5, 5, 'fifth', 3), p(4, 3, 'seventh', 1),
            p(3, 3, 'third', 1), p(2, 3, 'fifth', 1), p(1, 3, 'root', 1),
        ],
    },
    {
        id: 'Bm7', name: 'Bm7', fullName: 'Si Menor com 7ª (pestana)', category: 'min7', baseFret: 2,
        desc: 'Am7-shape barre na casa 2 — leve e versátil.',
        mutedStrings: [6],
        barre: { fret: 2, fromString: 5, toString: 1, role: 'root' },
        positions: [
            p(5, 2, 'root', 1), p(4, 4, 'fifth', 3), p(3, 2, 'seventh', 1),
            p(2, 3, 'third', 2), p(1, 2, 'fifth', 1),
        ],
    },
    {
        id: 'Fm7', name: 'Fm7', fullName: 'Fá Menor com 7ª (pestana)', category: 'min7', baseFret: 1,
        desc: 'Em7-shape barre na casa 1 — escuro, brasileiro, bossa.',
        mutedStrings: [],
        barre: { fret: 1, fromString: 6, toString: 1, role: 'root' },
        positions: [
            p(6, 1, 'root', 1), p(5, 3, 'fifth', 3), p(4, 1, 'seventh', 1),
            p(3, 1, 'third', 1), p(2, 1, 'fifth', 1), p(1, 1, 'root', 1),
        ],
    },
    {
        id: 'Fsm7', name: 'F♯m7', fullName: 'Fá♯ Menor com 7ª (pestana)', category: 'min7', baseFret: 2,
        desc: 'Em7-shape barre na casa 2 — melancólico em tonalidade de Mi.',
        mutedStrings: [],
        barre: { fret: 2, fromString: 6, toString: 1, role: 'root' },
        positions: [
            p(6, 2, 'root', 1), p(5, 4, 'fifth', 3), p(4, 2, 'seventh', 1),
            p(3, 2, 'third', 1), p(2, 2, 'fifth', 1), p(1, 2, 'root', 1),
        ],
    },
    {
        id: 'Csm7', name: 'C♯m7', fullName: 'Dó♯ Menor com 7ª (pestana)', category: 'min7', baseFret: 4,
        desc: 'Am7-shape barre na casa 4 — ii° em tonalidade de Si.',
        mutedStrings: [6],
        barre: { fret: 4, fromString: 5, toString: 1, role: 'root' },
        positions: [
            p(5, 4, 'root', 1), p(4, 6, 'fifth', 3), p(3, 4, 'seventh', 1),
            p(2, 5, 'third', 2), p(1, 4, 'fifth', 1),
        ],
    },
    {
        id: 'Gsm7', name: 'G♯m7', fullName: 'Sol♯ Menor com 7ª (pestana)', category: 'min7', baseFret: 4,
        desc: 'Em7-shape barre na casa 4 — enharmônico a A♭m7.',
        mutedStrings: [],
        barre: { fret: 4, fromString: 6, toString: 1, role: 'root' },
        positions: [
            p(6, 4, 'root', 1), p(5, 6, 'fifth', 3), p(4, 4, 'seventh', 1),
            p(3, 4, 'third', 1), p(2, 4, 'fifth', 1), p(1, 4, 'root', 1),
        ],
    },

    // ══════════════ 6ª / ADD6 ══════════════
    {
        id: 'C6', name: 'C6', fullName: 'Dó com 6ª', category: 'six', baseFret: 1,
        desc: 'C com Lá adicionado — soft jazz, som de "fim de filme".',
        mutedStrings: [6],
        positions: [
            p(5, 3, 'root', 3), p(4, 2, 'third', 2), p(3, 2, 'tension', 4),
            p(2, 1, 'root', 1), p(1, 0, 'third'),
        ],
    },
    {
        id: 'G6', name: 'G6', fullName: 'Sol com 6ª', category: 'six', baseFret: 1,
        desc: 'G aberto com a 6ª (E) no topo — cor de Beatles.',
        tip: 'Basta tirar o dedo da 1ª corda de um G normal.',
        mutedStrings: [],
        positions: [
            p(6, 3, 'root', 2), p(5, 2, 'third', 1), p(4, 0, 'fifth'),
            p(3, 0, 'root'), p(2, 0, 'third'), p(1, 0, 'tension'),
        ],
    },
    {
        id: 'D6', name: 'D6', fullName: 'Ré com 6ª', category: 'six', baseFret: 1,
        desc: 'Ré com Si no topo — brilho e levitação.',
        mutedStrings: [6, 5],
        positions: [
            p(4, 0, 'root'), p(3, 2, 'fifth', 1),
            p(2, 0, 'tension'), p(1, 2, 'third', 2),
        ],
    },
    {
        id: 'A6', name: 'A6', fullName: 'Lá com 6ª', category: 'six', baseFret: 1,
        desc: 'A com F♯ adicionado — som de "doo-wop" dos anos 50.',
        mutedStrings: [6],
        barre: { fret: 2, fromString: 4, toString: 1, role: 'fifth' },
        positions: [
            p(5, 0, 'root'), p(4, 2, 'fifth', 1), p(3, 2, 'root', 1),
            p(2, 2, 'third', 1), p(1, 2, 'tension', 1),
        ],
    },
    {
        id: 'E6', name: 'E6', fullName: 'Mi com 6ª', category: 'six', baseFret: 1,
        desc: 'E com C♯ — cor aberta de blues antigo.',
        mutedStrings: [],
        positions: [
            p(6, 0, 'root'), p(5, 2, 'fifth', 2), p(4, 2, 'root', 3),
            p(3, 1, 'third', 1), p(2, 2, 'tension', 4), p(1, 0, 'root'),
        ],
    },
    {
        id: 'Am6', name: 'Am6', fullName: 'Lá Menor com 6ª', category: 'six', baseFret: 1,
        desc: 'Am com F♯ — ambíguo, encantador, "James Bond" em miniatura.',
        mutedStrings: [6],
        positions: [
            p(5, 0, 'root'), p(4, 2, 'fifth', 2), p(3, 2, 'root', 3),
            p(2, 1, 'third', 1), p(1, 2, 'tension', 4),
        ],
    },
    {
        id: 'Em6', name: 'Em6', fullName: 'Mi Menor com 6ª', category: 'six', baseFret: 1,
        desc: 'Em com C♯ — dor doce, muito usado em blues e tango.',
        mutedStrings: [],
        positions: [
            p(6, 0, 'root'), p(5, 2, 'fifth', 2), p(4, 2, 'root', 3),
            p(3, 0, 'third'), p(2, 2, 'tension', 4), p(1, 0, 'root'),
        ],
    },
    {
        id: 'Dm6', name: 'Dm6', fullName: 'Ré Menor com 6ª', category: 'six', baseFret: 1,
        desc: 'Dm com Si — cor agridoce, usada em standards jazz.',
        mutedStrings: [6, 5],
        positions: [
            p(4, 0, 'root'), p(3, 2, 'fifth', 2),
            p(2, 0, 'tension'), p(1, 1, 'third', 1),
        ],
    },

    // ══════════════ SUSPENSOS ══════════════
    {
        id: 'Csus2', name: 'Csus2', fullName: 'Dó Suspenso 2', category: 'sus', baseFret: 1,
        desc: 'Sem a terça — o Ré cria uma ambiguidade etérea.',
        mutedStrings: [6],
        positions: [
            p(5, 3, 'root', 3), p(4, 0, 'ninth'), p(3, 0, 'fifth'),
            p(2, 1, 'root', 1), p(1, 3, 'fifth', 4),
        ],
    },
    {
        id: 'Csus4', name: 'Csus4', fullName: 'Dó Suspenso 4', category: 'sus', baseFret: 1,
        desc: 'A quarta (Fá) pede resolução na terça — suspense clássico.',
        mutedStrings: [6],
        positions: [
            p(5, 3, 'root', 3), p(4, 3, 'tension', 4), p(3, 0, 'fifth'),
            p(2, 1, 'root', 1), p(1, 1, 'tension', 1),
        ],
    },
    {
        id: 'Dsus2', name: 'Dsus2', fullName: 'Ré Suspenso 2', category: 'sus', baseFret: 1,
        desc: 'Lindíssimo dedilhado — indie e folk adoram.',
        mutedStrings: [6, 5],
        positions: [
            p(4, 0, 'root'), p(3, 2, 'fifth', 1),
            p(2, 3, 'root', 3), p(1, 0, 'ninth'),
        ],
    },
    {
        id: 'Dsus4', name: 'Dsus4', fullName: 'Ré Suspenso 4', category: 'sus', baseFret: 1,
        desc: 'Com um dedo a mais no Dsus2 — a tensão fica explícita.',
        mutedStrings: [6, 5],
        positions: [
            p(4, 0, 'root'), p(3, 2, 'fifth', 1),
            p(2, 3, 'root', 2), p(1, 3, 'tension', 3),
        ],
    },
    {
        id: 'Asus2', name: 'Asus2', fullName: 'Lá Suspenso 2', category: 'sus', baseFret: 1,
        desc: 'Aberto e pingante — brilho de cordas soltas.',
        mutedStrings: [6],
        positions: [
            p(5, 0, 'root'), p(4, 2, 'fifth', 1), p(3, 2, 'root', 2),
            p(2, 0, 'ninth'), p(1, 0, 'fifth'),
        ],
    },
    {
        id: 'Asus4', name: 'Asus4', fullName: 'Lá Suspenso 4', category: 'sus', baseFret: 1,
        desc: 'Um dedo a mais no A — riff icônico do rock.',
        mutedStrings: [6],
        positions: [
            p(5, 0, 'root'), p(4, 2, 'fifth', 1), p(3, 2, 'root', 2),
            p(2, 3, 'tension', 3), p(1, 0, 'fifth'),
        ],
    },
    {
        id: 'Esus4', name: 'Esus4', fullName: 'Mi Suspenso 4', category: 'sus', baseFret: 1,
        desc: '6 cordas tocando com quarta suspensa — poderoso.',
        mutedStrings: [],
        positions: [
            p(6, 0, 'root'), p(5, 2, 'fifth', 1), p(4, 2, 'root', 2),
            p(3, 2, 'tension', 3), p(2, 0, 'fifth'), p(1, 0, 'root'),
        ],
    },
    {
        id: 'Gsus4', name: 'Gsus4', fullName: 'Sol Suspenso 4', category: 'sus', baseFret: 1,
        desc: 'Sol sem a 3ª, com Dó suspenso — uma pausa antes do G.',
        mutedStrings: [5],
        positions: [
            p(6, 3, 'root', 2), p(4, 0, 'fifth'), p(3, 0, 'root'),
            p(2, 1, 'tension', 1), p(1, 3, 'root', 4),
        ],
    },
    {
        id: 'Gsus2', name: 'Gsus2', fullName: 'Sol Suspenso 2', category: 'sus', baseFret: 1,
        desc: 'Sol com Lá no lugar da 3ª — textura leve e aberta.',
        mutedStrings: [5],
        positions: [
            p(6, 3, 'root', 2), p(4, 0, 'fifth'), p(3, 0, 'root'),
            p(2, 3, 'fifth', 3), p(1, 3, 'root', 4),
        ],
    },
    {
        id: 'Fsus2', name: 'Fsus2', fullName: 'Fá Suspenso 2', category: 'sus', baseFret: 1,
        desc: 'Fá com Sol no topo — cor ambígua, indie moderno.',
        mutedStrings: [6, 5],
        positions: [
            p(4, 3, 'root', 3), p(3, 0, 'fifth'),
            p(2, 1, 'fifth', 1), p(1, 3, 'ninth', 4),
        ],
    },
    {
        id: 'Bsus4', name: 'Bsus4', fullName: 'Si Suspenso 4 (pestana)', category: 'sus', baseFret: 2,
        desc: 'Si suspenso — tensão grande que resolve direto em B ou E.',
        mutedStrings: [6],
        barre: { fret: 2, fromString: 5, toString: 1, role: 'root' },
        positions: [
            p(5, 2, 'root', 1), p(4, 4, 'fifth', 3),
            p(3, 4, 'root', 4), p(2, 5, 'tension', 4), p(1, 2, 'fifth', 1),
        ],
    },
    {
        id: 'Esus2', name: 'Esus2', fullName: 'Mi Suspenso 2', category: 'sus', baseFret: 1,
        desc: 'E com F♯ no lugar da 3ª — cor etérea e cristalina.',
        mutedStrings: [],
        positions: [
            p(6, 0, 'root'), p(5, 2, 'fifth', 1), p(4, 4, 'ninth', 3),
            p(3, 4, 'fifth', 4), p(2, 0, 'fifth'), p(1, 0, 'root'),
        ],
    },

    // ══════════════ ADD9 ══════════════
    {
        id: 'Cadd9', name: 'Cadd9', fullName: 'Dó com 9', category: 'add9', baseFret: 1,
        desc: 'C normal com um Ré brilhando em cima — pop/indie moderno.',
        mutedStrings: [6],
        positions: [
            p(5, 3, 'root', 2), p(4, 2, 'third', 1), p(3, 0, 'fifth'),
            p(2, 3, 'ninth', 3), p(1, 0, 'third'),
        ],
    },
    {
        id: 'Gadd9', name: 'Gadd9', fullName: 'Sol com 9', category: 'add9', baseFret: 1,
        desc: 'G limpo com Lá adicionado — arejado e moderno.',
        mutedStrings: [5],
        positions: [
            p(6, 3, 'root', 2), p(4, 0, 'fifth'), p(3, 2, 'ninth', 1),
            p(2, 0, 'third'), p(1, 3, 'root', 3),
        ],
    },
    {
        id: 'Eadd9', name: 'Eadd9', fullName: 'Mi com 9', category: 'add9', baseFret: 1,
        desc: 'Mi maior com Fá# no topo — brilho etéreo.',
        mutedStrings: [],
        positions: [
            p(6, 0, 'root'), p(5, 2, 'fifth', 2), p(4, 2, 'root', 3),
            p(3, 1, 'third', 1), p(2, 0, 'fifth'), p(1, 2, 'ninth', 4),
        ],
    },
    {
        id: 'Aadd9', name: 'Aadd9', fullName: 'Lá com 9', category: 'add9', baseFret: 1,
        desc: 'Lá com Si adicionado — cor aberta e flutuante.',
        mutedStrings: [6],
        positions: [
            p(5, 0, 'root'), p(4, 2, 'fifth', 1), p(3, 4, 'ninth', 3),
            p(2, 2, 'third', 2), p(1, 0, 'fifth'),
        ],
    },
    {
        id: 'Dadd9', name: 'Dadd9', fullName: 'Ré com 9', category: 'add9', baseFret: 1,
        desc: 'Ré com Mi suspenso — usado muito em folk e pop acústico.',
        tip: 'Shape enxuto sem 3ª — soa como Dsus2 em alguns contextos.',
        mutedStrings: [6, 5],
        positions: [
            p(4, 0, 'root'), p(3, 2, 'fifth', 1),
            p(2, 3, 'root', 3), p(1, 0, 'ninth'),
        ],
    },
    {
        id: 'Fadd9', name: 'Fadd9', fullName: 'Fá com 9', category: 'add9', baseFret: 1,
        desc: 'Fá com Sol no topo — versão arejada do Fá pestana.',
        mutedStrings: [6, 5],
        positions: [
            p(4, 3, 'root', 2), p(3, 2, 'third', 1),
            p(2, 1, 'fifth', 1), p(1, 3, 'ninth', 3),
        ],
    },
    {
        id: 'Emaj9', name: 'Emaj9', fullName: 'Mi com 9 e 7ª Maior', category: 'add9', baseFret: 1,
        desc: 'Emaj7 + F♯ — luminosidade total, muito usado em chill pop.',
        mutedStrings: [],
        positions: [
            p(6, 0, 'root'), p(5, 2, 'fifth', 3), p(4, 1, 'seventh', 1),
            p(3, 1, 'third', 2), p(2, 0, 'fifth'), p(1, 2, 'ninth', 4),
        ],
    },

    // ══════════════ DIMINUTOS ══════════════
    {
        id: 'Bdim', name: 'Bdim', fullName: 'Si Diminuto (tríade)', category: 'dim', baseFret: 1,
        desc: 'O vii° da tonalidade de Dó — tríade B D F.',
        mutedStrings: [6, 1],
        positions: [
            p(5, 2, 'root', 1), p(4, 3, 'fifth', 2),
            p(3, 4, 'root', 4), p(2, 3, 'third', 3),
        ],
    },
    {
        id: 'Bdim7', name: 'B°7', fullName: 'Si Diminuto 7', category: 'dim', baseFret: 1,
        desc: 'Todas as 4 tensões: B D F A♭ — resolve cromaticamente em qualquer direção.',
        mutedStrings: [6],
        positions: [
            p(5, 2, 'root', 2), p(4, 3, 'fifth', 3), p(3, 1, 'seventh', 1),
            p(2, 3, 'third', 4), p(1, 1, 'fifth', 1),
        ],
        tip: 'Dedo 1 faz mini-pestana nas cordas 3 e 1 na casa 1.',
    },
    {
        id: 'Cdim7', name: 'C°7', fullName: 'Dó Diminuto 7', category: 'dim', baseFret: 1,
        desc: 'Simétrico — a mesma forma repete a cada 3 casas (3, 6, 9…).',
        mutedStrings: [6],
        positions: [
            p(5, 3, 'root', 3), p(4, 4, 'fifth', 4), p(3, 2, 'seventh', 1),
            p(2, 4, 'third', 2), p(1, 2, 'fifth', 1),
        ],
        tip: 'Desliza 3 casas para cima e você tem a mesma harmonia noutra inversão.',
    },
    {
        id: 'Ddim7', name: 'D°7', fullName: 'Ré Diminuto 7', category: 'dim', baseFret: 1,
        desc: 'Shape fácil e compacto nas 4 cordas agudas.',
        mutedStrings: [6, 5],
        positions: [
            p(4, 0, 'root'), p(3, 1, 'fifth', 1),
            p(2, 0, 'seventh'), p(1, 1, 'third', 2),
        ],
    },
    {
        id: 'Edim7', name: 'E°7', fullName: 'Mi Diminuto 7', category: 'dim', baseFret: 1,
        desc: 'Cor cinematográfica — terror, mistério, suspense.',
        mutedStrings: [],
        positions: [
            p(6, 0, 'root'), p(5, 1, 'third', 1), p(4, 2, 'fifth', 2),
            p(3, 0, 'seventh'), p(2, 2, 'third', 3), p(1, 0, 'root'),
        ],
    },
    {
        id: 'Fsdim7', name: 'F♯°7', fullName: 'Fá♯ Diminuto 7', category: 'dim', baseFret: 1,
        desc: 'V7♭9 de Sol — ponte cromática muito usada em passagens.',
        mutedStrings: [6, 5],
        positions: [
            p(4, 1, 'seventh', 1), p(3, 2, 'third', 2),
            p(2, 1, 'fifth', 1), p(1, 2, 'root', 3),
        ],
    },
    {
        id: 'Adim7', name: 'A°7', fullName: 'Lá Diminuto 7', category: 'dim', baseFret: 1,
        desc: 'Cinco notas no compacto — todas as 4 tensões presentes.',
        mutedStrings: [6],
        positions: [
            p(5, 0, 'root'), p(4, 1, 'fifth', 1), p(3, 2, 'root', 3),
            p(2, 1, 'third', 1), p(1, 2, 'seventh', 4),
        ],
        tip: 'Dedo 1 faz mini-pestana pulando a 3ª corda (que recebe o dedo 3).',
    },

    // ══════════════ AUMENTADOS ══════════════
    {
        id: 'Caug', name: 'C+', fullName: 'Dó Aumentado', category: 'aug', baseFret: 1,
        desc: 'Quinta aumentada — som "suspenso no ar", usado em intros cinematográficas.',
        mutedStrings: [6],
        positions: [
            p(5, 3, 'root', 4), p(4, 2, 'third', 3), p(3, 1, 'tension', 1),
            p(2, 1, 'root', 2), p(1, 0, 'third'),
        ],
    },
    {
        id: 'Daug', name: 'D+', fullName: 'Ré Aumentado', category: 'aug', baseFret: 1,
        desc: 'Dominante aumentado de Sol — tensão que pede resolução em G.',
        mutedStrings: [6, 5],
        positions: [
            p(4, 0, 'root'), p(3, 3, 'tension', 3),
            p(2, 3, 'root', 4), p(1, 2, 'third', 1),
        ],
    },
    {
        id: 'Eaug', name: 'E+', fullName: 'Mi Aumentado', category: 'aug', baseFret: 1,
        desc: 'Mesma simetria por terças maiores — sobe 4 casas, o acorde se repete.',
        mutedStrings: [],
        positions: [
            p(6, 0, 'root'), p(5, 3, 'tension', 4), p(4, 2, 'root', 3),
            p(3, 1, 'third', 2), p(2, 1, 'tension', 1), p(1, 0, 'root'),
        ],
    },
    {
        id: 'Gaug', name: 'G+', fullName: 'Sol Aumentado', category: 'aug', baseFret: 1,
        desc: 'Dominante aumentado de Dó — típico em progressões de piano-jazz.',
        mutedStrings: [],
        positions: [
            p(6, 3, 'root', 2), p(5, 2, 'third', 1), p(4, 1, 'tension', 1),
            p(3, 0, 'root'), p(2, 0, 'third'), p(1, 3, 'root', 3),
        ],
    },

    // ══════════════ MEIO-DIMINUTO ══════════════
    {
        id: 'Bm7b5', name: 'Bm7♭5', fullName: 'Si Meio-Diminuto', category: 'half_dim', baseFret: 1,
        desc: 'O ii° em tonalidade menor — porta de entrada para ii°-V7-i.',
        mutedStrings: [6, 1],
        positions: [
            p(5, 2, 'root', 2), p(4, 3, 'fifth', 3),
            p(3, 2, 'seventh', 1), p(2, 3, 'third', 4),
        ],
    },
    {
        id: 'Am7b5', name: 'Am7♭5', fullName: 'Lá Meio-Diminuto', category: 'half_dim', baseFret: 5,
        desc: 'Shape móvel m7♭5 — desliza para qualquer tonalidade.',
        mutedStrings: [6, 5],
        positions: [
            p(4, 5, 'root', 1), p(3, 5, 'third', 1),
            p(2, 5, 'seventh', 1), p(1, 6, 'fifth', 2),
        ],
    },
    {
        id: 'Fsm7b5', name: 'F♯m7♭5', fullName: 'Fá♯ Meio-Diminuto', category: 'half_dim', baseFret: 2,
        desc: 'O ii° em tonalidade de Mi menor — clássico do jazz.',
        mutedStrings: [6, 1],
        positions: [
            p(5, 9, 'root', 2), p(4, 10, 'fifth', 3),
            p(3, 9, 'seventh', 1), p(2, 10, 'third', 4),
        ],
    },
    {
        id: 'Em7b5', name: 'Em7♭5', fullName: 'Mi Meio-Diminuto', category: 'half_dim', baseFret: 1,
        desc: 'ii° em Ré menor — som nostálgico e jazzístico com todas as 4 tensões.',
        mutedStrings: [],
        positions: [
            p(6, 0, 'root'), p(5, 1, 'fifth', 1), p(4, 0, 'seventh'),
            p(3, 0, 'third'), p(2, 3, 'seventh', 3), p(1, 0, 'root'),
        ],
    },
    {
        id: 'Dm7b5', name: 'Dm7♭5', fullName: 'Ré Meio-Diminuto', category: 'half_dim', baseFret: 1,
        desc: 'ii° em Dó menor — shape enxuto, 4 notas todas diferentes.',
        mutedStrings: [6, 5],
        barre: { fret: 1, fromString: 3, toString: 1, role: 'fifth' },
        positions: [
            p(4, 0, 'root'), p(3, 1, 'fifth', 1),
            p(2, 1, 'seventh', 1), p(1, 1, 'third', 1),
        ],
    },
    {
        id: 'Cm7b5', name: 'Cm7♭5', fullName: 'Dó Meio-Diminuto (pestana)', category: 'half_dim', baseFret: 3,
        desc: 'A-shape m7♭5 barre na casa 3 — ii° em tonalidade de Si♭ menor.',
        mutedStrings: [6, 1],
        positions: [
            p(5, 3, 'root', 2), p(4, 4, 'fifth', 3),
            p(3, 3, 'seventh', 1), p(2, 4, 'third', 4),
        ],
    },
    {
        id: 'Gm7b5', name: 'Gm7♭5', fullName: 'Sol Meio-Diminuto', category: 'half_dim', baseFret: 4,
        desc: 'ii° em Fá menor — shape móvel nas 4 cordas agudas.',
        mutedStrings: [6, 5],
        barre: { fret: 6, fromString: 3, toString: 1, role: 'fifth' },
        positions: [
            p(4, 5, 'root', 1), p(3, 6, 'fifth', 2),
            p(2, 6, 'seventh', 3), p(1, 6, 'third', 4),
        ],
    },

    // ══════════════ TENSÕES 9 / 11 / 13 ══════════════
    {
        id: 'Cmaj9', name: 'Cmaj9', fullName: 'Dó com 9 e 7ª Maior', category: 'extended', baseFret: 1,
        desc: 'Pilha de terças até a 9 — cor expansiva e jazz refinado.',
        mutedStrings: [6],
        positions: [
            p(5, 3, 'root', 3), p(4, 2, 'third', 1), p(3, 4, 'seventh', 4),
            p(2, 3, 'ninth', 2), p(1, 0, 'third'),
        ],
    },
    {
        id: 'Am9', name: 'Am9', fullName: 'Lá Menor com 9', category: 'extended', baseFret: 1,
        desc: 'Mistério em cor fria — Am7 + nona. Som soul/neo-soul.',
        mutedStrings: [6],
        positions: [
            p(5, 0, 'root'), p(4, 2, 'fifth', 1), p(3, 4, 'ninth', 4),
            p(2, 1, 'third', 2), p(1, 3, 'seventh', 3),
        ],
    },
    {
        id: 'C9', name: 'C9', fullName: 'Dó Dominante 9', category: 'extended', baseFret: 1,
        desc: 'Acorde de "James Brown" — funk, soul, R&B.',
        mutedStrings: [6],
        barre: { fret: 3, fromString: 3, toString: 1, role: 'seventh' },
        positions: [
            p(5, 3, 'root', 2), p(4, 2, 'third', 1),
            p(3, 3, 'seventh', 3), p(2, 3, 'ninth', 3), p(1, 3, 'fifth', 3),
        ],
    },
    {
        id: 'D9', name: 'D9', fullName: 'Ré Dominante 9', category: 'extended', baseFret: 4,
        desc: 'D7 com sabor — comum em blues e funk mais sofisticado.',
        mutedStrings: [6, 1],
        positions: [
            p(5, 5, 'root', 1), p(4, 4, 'third', 2),
            p(3, 5, 'seventh', 3), p(2, 5, 'ninth', 4),
        ],
    },
    {
        id: 'G13', name: 'G13', fullName: 'Sol Dominante 13', category: 'extended', baseFret: 3,
        desc: '6ª/13ª no topo — cor rica, típica de balada jazz.',
        mutedStrings: [5, 1],
        positions: [
            p(6, 3, 'root', 1), p(4, 3, 'seventh', 2),
            p(3, 4, 'third', 3), p(2, 5, 'tension', 4),
        ],
    },
    {
        id: 'Gmaj9', name: 'Gmaj9', fullName: 'Sol com 9 e 7ª Maior', category: 'extended', baseFret: 1,
        desc: 'Gmaj7 + Lá — cor "cinematográfica" aberta, Steely Dan.',
        mutedStrings: [],
        positions: [
            p(6, 3, 'root', 3), p(5, 2, 'third', 2), p(4, 0, 'fifth'),
            p(3, 2, 'ninth', 4), p(2, 0, 'third'), p(1, 2, 'seventh', 1),
        ],
    },
    {
        id: 'Fmaj9', name: 'Fmaj9', fullName: 'Fá com 9 e 7ª Maior', category: 'extended', baseFret: 1,
        desc: 'Fmaj7 + Sol — cor luminosa, pilar da bossa e do smooth jazz.',
        mutedStrings: [6, 5],
        positions: [
            p(4, 3, 'root', 3), p(3, 2, 'third', 2),
            p(2, 0, 'seventh'), p(1, 3, 'ninth', 4),
        ],
    },
    {
        id: 'Em9', name: 'Em9', fullName: 'Mi Menor com 9', category: 'extended', baseFret: 1,
        desc: 'Em7 + F♯ — 6 cordas de pura melancolia etérea.',
        mutedStrings: [],
        positions: [
            p(6, 0, 'root'), p(5, 2, 'fifth', 2), p(4, 0, 'seventh'),
            p(3, 0, 'third'), p(2, 0, 'fifth'), p(1, 2, 'ninth', 3),
        ],
    },
    {
        id: 'E9', name: 'E9', fullName: 'Mi Dominante 9', category: 'extended', baseFret: 1,
        desc: 'E7 + F♯ — o som de blues/funk mais "redondo".',
        mutedStrings: [],
        positions: [
            p(6, 0, 'root'), p(5, 2, 'fifth', 2), p(4, 0, 'seventh'),
            p(3, 1, 'third', 1), p(2, 3, 'seventh', 4), p(1, 2, 'ninth', 3),
        ],
    },
    {
        id: 'A9', name: 'A9', fullName: 'Lá Dominante 9', category: 'extended', baseFret: 1,
        desc: 'A7 + Si — clássico "funky seventh" da soul music.',
        mutedStrings: [6, 1],
        positions: [
            p(5, 0, 'root'), p(4, 2, 'third', 2),
            p(3, 0, 'seventh'), p(2, 2, 'ninth', 3),
        ],
    },
    {
        id: 'Am11', name: 'Am11', fullName: 'Lá Menor com 11', category: 'extended', baseFret: 1,
        desc: 'Am7 + Ré — cor suspensa aberta, "sopro de ar fresco".',
        mutedStrings: [6],
        positions: [
            p(5, 0, 'root'), p(4, 0, 'tension'), p(3, 0, 'seventh'),
            p(2, 1, 'third', 1), p(1, 3, 'seventh', 3),
        ],
    },
    {
        id: 'F13', name: 'F13', fullName: 'Fá Dominante 13 (pestana)', category: 'extended', baseFret: 1,
        desc: 'F7 + Ré no topo — cor rica para dominantes na tonalidade de Si♭.',
        mutedStrings: [1],
        barre: { fret: 1, fromString: 6, toString: 1, role: 'root' },
        positions: [
            p(6, 1, 'root', 1), p(5, 3, 'fifth', 3), p(4, 1, 'seventh', 1),
            p(3, 2, 'third', 2), p(2, 3, 'tension', 4),
        ],
    },
    {
        id: 'Dm9', name: 'Dm9', fullName: 'Ré Menor com 9', category: 'extended', baseFret: 4,
        desc: 'Dm7 + Mi — cor macia, porta de entrada do ii-V-I em Dó.',
        tip: 'Pestana na casa 5 cobrindo as 3 cordas agudas.',
        mutedStrings: [6],
        barre: { fret: 5, fromString: 3, toString: 1, role: 'third' },
        positions: [
            p(5, 5, 'root', 3), p(4, 3, 'third', 1), p(3, 5, 'seventh', 1),
            p(2, 5, 'ninth', 1), p(1, 5, 'fifth', 1),
        ],
    },

    // ══════════════ DISSONANTES / ALTERADOS ══════════════
    {
        id: 'C7sharp9', name: 'C7♯9', fullName: 'Dó Dominante com 9 Aumentada (Hendrix)', category: 'altered', baseFret: 1,
        desc: 'O acorde de "Purple Haze" — agressivo, bluesy, icônico.',
        mutedStrings: [6, 1],
        positions: [
            p(5, 3, 'root', 2), p(4, 2, 'third', 1),
            p(3, 3, 'seventh', 3), p(2, 4, 'tension', 4),
        ],
    },
    {
        id: 'C7flat9', name: 'C7♭9', fullName: 'Dó Dominante com 9 Menor', category: 'altered', baseFret: 1,
        desc: 'A 9♭ sobre dominante = tensão máxima que resolve em Fm.',
        mutedStrings: [6],
        positions: [
            p(5, 3, 'root', 2), p(4, 2, 'third', 1), p(3, 3, 'seventh', 3),
            p(2, 2, 'tension', 1), p(1, 3, 'fifth', 4),
        ],
    },
    {
        id: 'G7sharp5', name: 'G7♯5', fullName: 'Sol Dominante com 5 Aumentada', category: 'altered', baseFret: 3,
        desc: 'Dominante com quinta aumentada — instabilidade controlada.',
        mutedStrings: [5, 1],
        positions: [
            p(6, 3, 'root', 1), p(4, 3, 'seventh', 2),
            p(3, 4, 'third', 3), p(2, 4, 'tension', 4),
        ],
    },
    {
        id: 'Fsharp7sharp11', name: 'F♯7♯11', fullName: 'Fá♯ Dominante com 11 Aumentada', category: 'altered', baseFret: 2,
        desc: 'O som "lídio dominante" — jazz fusion e bossa moderna.',
        mutedStrings: [5, 1],
        positions: [
            p(6, 2, 'root', 1), p(4, 4, 'third', 3),
            p(3, 2, 'seventh', 1), p(2, 2, 'tension', 1),
        ],
    },
    {
        id: 'E7sharp9', name: 'E7♯9', fullName: 'Mi Dominante com 9 Aumentada (Hendrix)', category: 'altered', baseFret: 1,
        desc: 'O próprio "Purple Haze" — blues-rock com atitude máxima.',
        mutedStrings: [5],
        positions: [
            p(6, 0, 'root'), p(4, 0, 'seventh'), p(3, 1, 'third', 1),
            p(2, 3, 'seventh', 2), p(1, 3, 'tension', 3),
        ],
    },
    {
        id: 'A7b9', name: 'A7♭9', fullName: 'Lá Dominante com 9 Menor', category: 'altered', baseFret: 1,
        desc: 'A7 com B♭ — tensão agressiva que resolve em Dm.',
        mutedStrings: [6],
        positions: [
            p(5, 0, 'root'), p(4, 2, 'fifth', 2), p(3, 3, 'tension', 3),
            p(2, 2, 'third', 1), p(1, 3, 'seventh', 4),
        ],
    },
    {
        id: 'D7b9', name: 'D7♭9', fullName: 'Ré Dominante com 9 Menor', category: 'altered', baseFret: 4,
        desc: 'Shape de "dim7 disfarçado" — qualquer dim7 também funciona como V7♭9.',
        mutedStrings: [6, 1],
        positions: [
            p(5, 5, 'root', 2), p(4, 4, 'third', 1),
            p(3, 5, 'seventh', 3), p(2, 4, 'tension', 1),
        ],
    },
    {
        id: 'G7b13', name: 'G7♭13', fullName: 'Sol Dominante com 13 Menor', category: 'altered', baseFret: 3,
        desc: 'G7 + E♭ — cor sombria de dominante alterado.',
        mutedStrings: [5, 1],
        positions: [
            p(6, 3, 'root', 2), p(4, 3, 'seventh', 3),
            p(3, 4, 'third', 4), p(2, 4, 'tension', 4),
        ],
    },
    {
        id: 'B7b9', name: 'B7♭9', fullName: 'Si Dominante com 9 Menor', category: 'altered', baseFret: 1,
        desc: 'V7♭9 de Mi menor — ponto culminante de muitas cadências jazz.',
        mutedStrings: [6, 1],
        positions: [
            p(5, 2, 'root', 2), p(4, 1, 'third', 1),
            p(3, 2, 'seventh', 3), p(2, 2, 'tension', 4),
        ],
    },
    {
        id: 'Ebdim7', name: 'E♭°7', fullName: 'Mi Bemol Diminuto (= V7♭9 de Dó)', category: 'altered', baseFret: 1,
        desc: 'Dim7 simétrico que serve como V7♭9 em 4 tonalidades ao mesmo tempo.',
        tip: 'Deslize 3 casas para cima — mesmo acorde, outro nome.',
        mutedStrings: [6],
        positions: [
            p(5, 6, 'root', 3), p(4, 7, 'fifth', 4), p(3, 5, 'seventh', 1),
            p(2, 7, 'third', 2), p(1, 5, 'fifth', 1),
        ],
    },

    // ══════════════ TONALIDADES BEMOL — completando o círculo ══════════════
    {
        id: 'Gsm', name: 'G♯m', fullName: 'Sol Sustenido Menor (pestana)', category: 'triad_barre', baseFret: 4,
        desc: 'Em-shape na casa 4 — o iii de Mi maior.',
        mutedStrings: [],
        barre: { fret: 4, fromString: 6, toString: 1, role: 'root' },
        positions: [
            p(6, 4, 'root', 1), p(5, 6, 'fifth', 3), p(4, 6, 'root', 4),
            p(3, 4, 'third', 1), p(2, 4, 'fifth', 1), p(1, 4, 'root', 1),
        ],
    },
    {
        id: 'Abm', name: 'A♭m', fullName: 'Lá Bemol Menor (pestana)', category: 'triad_barre', baseFret: 4,
        desc: 'Em-shape na casa 4 — enharmônico a G♯m.',
        mutedStrings: [],
        barre: { fret: 4, fromString: 6, toString: 1, role: 'root' },
        positions: [
            p(6, 4, 'root', 1), p(5, 6, 'fifth', 3), p(4, 6, 'root', 4),
            p(3, 4, 'third', 1), p(2, 4, 'fifth', 1), p(1, 4, 'root', 1),
        ],
    },
    {
        id: 'Ebm', name: 'E♭m', fullName: 'Mi Bemol Menor (pestana)', category: 'triad_barre', baseFret: 6,
        desc: 'Am-shape na casa 6 — tonalidade lírica do jazz menor.',
        mutedStrings: [6],
        barre: { fret: 6, fromString: 5, toString: 1, role: 'root' },
        positions: [
            p(5, 6, 'root', 1), p(4, 8, 'fifth', 3), p(3, 8, 'root', 4),
            p(2, 7, 'third', 2), p(1, 6, 'fifth', 1),
        ],
    },
    {
        id: 'Bbm', name: 'B♭m', fullName: 'Si Bemol Menor (pestana)', category: 'triad_barre', baseFret: 1,
        desc: 'Am-shape na casa 1 — dedilhado intenso, muito usado no choro.',
        mutedStrings: [6],
        barre: { fret: 1, fromString: 5, toString: 1, role: 'root' },
        positions: [
            p(5, 1, 'root', 1), p(4, 3, 'fifth', 3), p(3, 3, 'root', 4),
            p(2, 2, 'third', 2), p(1, 1, 'fifth', 1),
        ],
    },
    {
        id: 'Csm', name: 'C♯m', fullName: 'Dó Sustenido Menor (pestana)', category: 'triad_barre', baseFret: 4,
        desc: 'Am-shape na casa 4 — enharmônico a D♭m.',
        mutedStrings: [6],
        barre: { fret: 4, fromString: 5, toString: 1, role: 'root' },
        positions: [
            p(5, 4, 'root', 1), p(4, 6, 'fifth', 3), p(3, 6, 'root', 4),
            p(2, 5, 'third', 2), p(1, 4, 'fifth', 1),
        ],
    },

    // dom7 faltantes
    {
        id: 'Eb7', name: 'E♭7', fullName: 'Mi Bemol Dominante 7 (pestana)', category: 'dom7', baseFret: 6,
        desc: 'A7-shape na casa 6 — a dominante do blues em Lá bemol.',
        mutedStrings: [6],
        barre: { fret: 6, fromString: 5, toString: 1, role: 'root' },
        positions: [
            p(5, 6, 'root', 1), p(4, 8, 'fifth', 3), p(3, 6, 'seventh', 1),
            p(2, 8, 'third', 4), p(1, 6, 'root', 1),
        ],
    },
    {
        id: 'Ab7', name: 'A♭7', fullName: 'Lá Bemol Dominante 7 (pestana)', category: 'dom7', baseFret: 4,
        desc: 'E7-shape na casa 4 — enharmônico a G♯7.',
        mutedStrings: [],
        barre: { fret: 4, fromString: 6, toString: 1, role: 'root' },
        positions: [
            p(6, 4, 'root', 1), p(5, 6, 'fifth', 3), p(4, 4, 'seventh', 1),
            p(3, 5, 'third', 2), p(2, 4, 'fifth', 1), p(1, 4, 'root', 1),
        ],
    },
    {
        id: 'Db7', name: 'D♭7', fullName: 'Ré Bemol Dominante 7 (pestana)', category: 'dom7', baseFret: 4,
        desc: 'A7-shape na casa 4 — dominante de G♭ / F♯.',
        mutedStrings: [6],
        barre: { fret: 4, fromString: 5, toString: 1, role: 'root' },
        positions: [
            p(5, 4, 'root', 1), p(4, 6, 'fifth', 3), p(3, 4, 'seventh', 1),
            p(2, 6, 'third', 4), p(1, 4, 'root', 1),
        ],
    },

    // min7 faltantes
    {
        id: 'Ebm7', name: 'E♭m7', fullName: 'Mi Bemol Menor com 7ª (pestana)', category: 'min7', baseFret: 6,
        desc: 'Am7-shape na casa 6 — tonalidade jazzística do "So What".',
        mutedStrings: [6],
        barre: { fret: 6, fromString: 5, toString: 1, role: 'root' },
        positions: [
            p(5, 6, 'root', 1), p(4, 8, 'fifth', 3), p(3, 6, 'seventh', 1),
            p(2, 7, 'third', 2), p(1, 6, 'fifth', 1),
        ],
    },
    {
        id: 'Abm7', name: 'A♭m7', fullName: 'Lá Bemol Menor com 7ª (pestana)', category: 'min7', baseFret: 4,
        desc: 'Em7-shape na casa 4 — cor noturna, muito usada no R&B.',
        mutedStrings: [],
        barre: { fret: 4, fromString: 6, toString: 1, role: 'root' },
        positions: [
            p(6, 4, 'root', 1), p(5, 6, 'fifth', 3), p(4, 4, 'seventh', 1),
            p(3, 4, 'third', 1), p(2, 4, 'fifth', 1), p(1, 4, 'root', 1),
        ],
    },
    {
        id: 'Bbm7', name: 'B♭m7', fullName: 'Si Bemol Menor com 7ª (pestana)', category: 'min7', baseFret: 1,
        desc: 'Am7-shape na casa 1 — clássico do jazz em tonalidades de sopro.',
        mutedStrings: [6],
        barre: { fret: 1, fromString: 5, toString: 1, role: 'root' },
        positions: [
            p(5, 1, 'root', 1), p(4, 3, 'fifth', 3), p(3, 1, 'seventh', 1),
            p(2, 2, 'third', 2), p(1, 1, 'fifth', 1),
        ],
    },

    // maj7 faltantes
    {
        id: 'Abmaj7', name: 'A♭maj7', fullName: 'Lá Bemol com 7ª Maior (pestana)', category: 'maj7', baseFret: 4,
        desc: 'Emaj7-shape na casa 4 — a tonalidade do standard "Misty".',
        mutedStrings: [],
        barre: { fret: 4, fromString: 6, toString: 1, role: 'root' },
        positions: [
            p(6, 4, 'root', 1), p(5, 6, 'fifth', 3), p(4, 5, 'seventh', 2),
            p(3, 5, 'third', 4), p(2, 4, 'fifth', 1), p(1, 4, 'root', 1),
        ],
    },
    {
        id: 'Dbmaj7', name: 'D♭maj7', fullName: 'Ré Bemol com 7ª Maior (pestana)', category: 'maj7', baseFret: 4,
        desc: 'Amaj7-shape na casa 4 — cor sonhadora, muito usada em bossa.',
        mutedStrings: [6],
        barre: { fret: 4, fromString: 5, toString: 1, role: 'root' },
        positions: [
            p(5, 4, 'root', 1), p(4, 6, 'fifth', 3), p(3, 5, 'seventh', 2),
            p(2, 6, 'third', 4), p(1, 4, 'root', 1),
        ],
    },

    // Diminutos faltantes (dim7 se repete a cada 3 trastes)
    {
        id: 'Gdim7', name: 'G°7', fullName: 'Sol Diminuto 7', category: 'dim', baseFret: 1,
        desc: 'Enharmônico a B♭°7 / D♭°7 / E°7 — mesmo acorde, 4 nomes.',
        mutedStrings: [6, 5],
        positions: [
            p(4, 2, 'fifth', 2), p(3, 3, 'seventh', 3),
            p(2, 2, 'third', 1), p(1, 3, 'root', 4),
        ],
    },
    {
        id: 'Bbdim7', name: 'B♭°7', fullName: 'Si Bemol Diminuto 7', category: 'dim', baseFret: 1,
        desc: 'Enharmônico a D♭°7 / E°7 / G°7 — o mesmo acorde simétrico.',
        mutedStrings: [6],
        positions: [
            p(5, 1, 'root', 1), p(4, 2, 'fifth', 2), p(3, 0, 'seventh'),
            p(2, 2, 'third', 3),
        ],
    },

    // Power chords completando o círculo cromático
    {
        id: 'Bb5', name: 'B♭5', fullName: 'Si Bemol Power (5)', category: 'power', baseFret: 1,
        desc: 'Root na 5ª corda, casa 1.',
        mutedStrings: [6, 2, 1],
        positions: [ p(5, 1, 'root', 1), p(4, 3, 'fifth', 3), p(3, 3, 'root', 4) ],
    },
    {
        id: 'Fs5', name: 'F♯5', fullName: 'Fá Sustenido Power (5)', category: 'power', baseFret: 1,
        desc: 'Root na 6ª corda, casa 2 — forma móvel típica do rock.',
        mutedStrings: [3, 2, 1],
        positions: [ p(6, 2, 'root', 1), p(5, 4, 'fifth', 3), p(4, 4, 'root', 4) ],
    },
    {
        id: 'Cs5', name: 'C♯5', fullName: 'Dó Sustenido Power (5)', category: 'power', baseFret: 4,
        desc: 'Root na 5ª corda, casa 4 — enharmônico a D♭5.',
        mutedStrings: [6, 2, 1],
        positions: [ p(5, 4, 'root', 1), p(4, 6, 'fifth', 3), p(3, 6, 'root', 4) ],
    },
    {
        id: 'Eb5', name: 'E♭5', fullName: 'Mi Bemol Power (5)', category: 'power', baseFret: 6,
        desc: 'Root na 5ª corda, casa 6 — enharmônico a D♯5.',
        mutedStrings: [6, 2, 1],
        positions: [ p(5, 6, 'root', 1), p(4, 8, 'fifth', 3), p(3, 8, 'root', 4) ],
    },
    {
        id: 'Ab5', name: 'A♭5', fullName: 'Lá Bemol Power (5)', category: 'power', baseFret: 4,
        desc: 'Root na 6ª corda, casa 4 — enharmônico a G♯5.',
        mutedStrings: [3, 2, 1],
        positions: [ p(6, 4, 'root', 1), p(5, 6, 'fifth', 3), p(4, 6, 'root', 4) ],
    },

    // ══════════════ VOICINGS JAZZ / EXTENSÕES ══════════════
    {
        id: 'Dm11_quartal', name: 'Dm11', fullName: 'Ré Menor 11 — voicing "So What"', category: 'extended', baseFret: 5,
        desc: 'Empilhamento de quartas (D-G-C-F-A) — o voicing modal de Miles Davis.',
        tip: 'Use um arpejo lento: bordão A solto, depois os 4 dedos na casa 5.',
        mutedStrings: [6],
        barre: { fret: 5, fromString: 4, toString: 2, role: 'tension' },
        positions: [
            p(5, 0, 'fifth'), p(4, 5, 'root', 1),
            p(3, 5, 'tension', 2), p(2, 5, 'seventh', 3), p(1, 7, 'third', 4),
        ],
    },
    {
        id: 'Cmaj13', name: 'Cmaj13', fullName: 'Dó com 13 e 7ª Maior', category: 'extended', baseFret: 3,
        desc: 'Acorde luminoso empilhando 3ª, 7M, 9 e 13 — pilar do jazz contemporâneo.',
        mutedStrings: [6, 5],
        positions: [
            p(4, 5, 'ninth', 4), p(3, 4, 'seventh', 3),
            p(2, 3, 'third', 1), p(1, 5, 'tension', 2),
        ],
    },
    {
        id: 'F7sharp11', name: 'F7♯11', fullName: 'Fá Dominante com 11 Aumentada (Lídio-dominante)', category: 'altered', baseFret: 1,
        desc: 'Trítono na 11 cria o som "Lídio-dominante" — cor favorita do jazz moderno.',
        mutedStrings: [5],
        positions: [
            p(6, 1, 'root', 1), p(4, 3, 'seventh', 3), p(3, 2, 'third', 2),
            p(2, 0, 'tension'),
        ],
    },
    {
        id: 'G13_shell', name: 'G13 (shell)', fullName: 'Sol Dominante 13 (shell)', category: 'extended', baseFret: 3,
        desc: 'Voicing shell com 3ª, 7♭ e 13 — a cor clássica do jazz dominante.',
        mutedStrings: [5, 2],
        positions: [
            p(6, 3, 'root', 2), p(4, 3, 'seventh', 3), p(3, 4, 'third', 4),
            p(1, 5, 'tension', 1),
        ],
    },

    // ══════════════ SUS e ADD9 adicionais ══════════════
    {
        id: 'Fsus4', name: 'Fsus4', fullName: 'Fá Suspenso 4 (pestana)', category: 'sus', baseFret: 1,
        desc: 'E-shape sus4 na casa 1 — tensão pedindo resolução pra F.',
        mutedStrings: [],
        barre: { fret: 1, fromString: 6, toString: 1, role: 'root' },
        positions: [
            p(6, 1, 'root', 1), p(5, 3, 'fifth', 3), p(4, 3, 'root', 4),
            p(3, 3, 'tension', 2), p(2, 1, 'fifth', 1), p(1, 1, 'root', 1),
        ],
    },
    {
        id: 'Bsus2', name: 'Bsus2', fullName: 'Si Suspenso 2 (pestana)', category: 'sus', baseFret: 2,
        desc: 'A-sus2 na casa 2 — som arejado, típico de U2 e coldplay.',
        mutedStrings: [6],
        barre: { fret: 2, fromString: 5, toString: 1, role: 'root' },
        positions: [
            p(5, 2, 'root', 1), p(4, 4, 'fifth', 3), p(3, 4, 'root', 4),
            p(2, 2, 'ninth', 1), p(1, 2, 'fifth', 1),
        ],
    },
    {
        id: 'Badd9', name: 'Badd9', fullName: 'Si com 9 (pestana)', category: 'add9', baseFret: 2,
        desc: 'B-maior com a 9ª adicionada — cor moderna, muito usada em pop.',
        mutedStrings: [6],
        barre: { fret: 2, fromString: 5, toString: 1, role: 'root' },
        positions: [
            p(5, 2, 'root', 1), p(4, 4, 'fifth', 3), p(3, 4, 'root', 4),
            p(2, 4, 'third', 2), p(1, 2, 'ninth', 1),
        ],
    },
    {
        id: 'Fmaj9_shell', name: 'Fmaj9 (shell)', fullName: 'Fá com 9 e 7ª Maior (voicing shell)', category: 'extended', baseFret: 1,
        desc: 'Shell voicing sem a 5ª — cor etérea do jazz moderno.',
        mutedStrings: [6, 5],
        positions: [
            p(4, 3, 'root', 3), p(3, 2, 'third', 2),
            p(2, 1, 'seventh', 1), p(1, 0, 'ninth'),
        ],
    },

    // ══════════════ INVERSÕES (slash) adicionais ══════════════
    {
        id: 'Cmaj7_G', name: 'Cmaj7/G', fullName: 'Dó maior 7 com Sol no baixo', category: 'slash', baseFret: 1,
        desc: '2ª inversão de Cmaj7 — baixo pedal em Sol, som de coral.',
        mutedStrings: [],
        positions: [
            p(6, 3, 'fifth', 3), p(5, 3, 'root', 4), p(4, 2, 'third', 2),
            p(3, 0, 'seventh'), p(2, 0, 'third'), p(1, 0, 'fifth'),
        ],
    },
    {
        id: 'G_Fs', name: 'G/F♯', fullName: 'Sol com Fá Sustenido no baixo', category: 'slash', baseFret: 1,
        desc: 'Baixo descendente G→F♯→Em — bordadura onipresente no pop.',
        mutedStrings: [],
        positions: [
            p(6, 2, 'seventh', 2), p(5, 2, 'ninth', 1), p(4, 0, 'fifth'),
            p(3, 0, 'root'), p(2, 0, 'third'), p(1, 3, 'root', 4),
        ],
    },
    {
        id: 'Am_C', name: 'Am/C', fullName: 'Lá Menor com Dó no baixo', category: 'slash', baseFret: 1,
        desc: '1ª inversão de Am — baixo ascendente C→D→E muito usado em intros.',
        mutedStrings: [6],
        positions: [
            p(5, 3, 'third', 3), p(4, 2, 'fifth', 2), p(3, 2, 'root', 1),
            p(2, 1, 'third', 1), p(1, 0, 'fifth'),
        ],
    },
    {
        id: 'D_A_bass', name: 'D/A', fullName: 'Ré com Lá no baixo (variante)', category: 'slash', baseFret: 1,
        desc: 'Variação com baixo pedal — se confunde com Dsus muito usado no folk.',
        mutedStrings: [6],
        positions: [
            p(5, 0, 'fifth'), p(4, 0, 'root'), p(3, 2, 'fifth', 1),
            p(2, 3, 'root', 3), p(1, 2, 'third', 2),
        ],
    },
]

// Export by category for UI grouping
export const chordsByCategory = (): Record<ChordCategory, DictChord[]> => {
    const out = {} as Record<ChordCategory, DictChord[]>
    for (const c of Object.keys(CATEGORY_META) as ChordCategory[]) out[c] = []
    for (const ch of chordDictionary) out[ch.category].push(ch)
    return out
}

// Fast lookup by id (used by progressions.ts)
export const chordById: Record<string, DictChord> = Object.fromEntries(
    chordDictionary.map(c => [c.id, c])
)
