// Chromatic note names
const N = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
// Open string chromatic values: strings 6→1 = E A D G B E
const OPEN = [4, 9, 2, 7, 11, 4]

export interface ChordNote { string: number; fret: number; label: string; color: string }
export interface ChordShape { name: string; desc: string; notes: ChordNote[] }
export interface ChordDef {
    name: string
    desc: string
    shapes: ChordShape[]
}

function gen(
    root: number,
    intervals: number[],
    range: [number, number],
    rootClr: string,
    thirdClr: string,
    noteClr: string,
    specials?: { interval: number; color: string }[]
): ChordNote[] {
    const res: ChordNote[] = []
    const chordChrom = intervals.map(i => (root + i) % 12)
    for (let si = 0; si < 6; si++) {
        const str = 6 - si
        for (let f = range[0]; f <= range[1]; f++) {
            const nc = (OPEN[si]! + f) % 12
            const idx = chordChrom.indexOf(nc)
            if (idx !== -1) {
                const sp = specials?.find(s => s.interval === intervals[idx])
                const isRoot = intervals[idx] === 0
                const isThird = intervals[idx] === 3 || intervals[idx] === 4
                res.push({ string: str, fret: f, label: N[nc]!, color: sp ? sp.color : (isRoot ? rootClr : isThird ? thirdClr : noteClr) })
            }
        }
    }
    return res
}

// ── Chromatic roots ──────────────────────────────────────
const C = 0, D = 2, E = 4, F = 5, G = 7, A = 9, B = 11

// ── Intervals ────────────────────────────────────────────
const MAJ = [0, 4, 7]        // 1 3 5
const MIN = [0, 3, 7]        // 1 b3 5
const MAJ7 = [0, 4, 7, 11]    // 1 3 5 7
const MIN7 = [0, 3, 7, 10]    // 1 b3 5 b7
const DOM7 = [0, 4, 7, 10]    // 1 3 5 b7

// ── Color tokens ─────────────────────────────────────────
const R = 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
const T3 = 'bg-sky-400 text-white'
const N5 = 'bg-zinc-600 text-white'
const S7 = 'bg-amber-400 text-black font-bold ring-2 ring-amber-300'

// CAGED shape ranges for each root:
// The idea: for a given root, each CAGED shape occupies a region of frets.
// We generate chord tones within that region across all 6 strings.
function cagedShapes(root: number, intervals: number[], rootClr: string, thirdClr: string, noteClr: string, specials?: { interval: number; color: string }[]): ChordShape[] {
    // Find root positions on 6th string
    const rootFret6 = root >= 4 ? root - 4 : root - 4 + 12
    // CAGED positions: E shape (root on 6th), A shape (root on 5th), C shape, D shape, G shape
    const rootFret5 = root >= 9 ? root - 9 : root - 9 + 12

    const shapes: { name: string; range: [number, number]; desc: string }[] = [
        { name: `Shape E (Casa ${rootFret6})`, range: [Math.max(0, rootFret6 - 1), rootFret6 + 3], desc: `Pestana com formato de Mi na casa ${rootFret6}.` },
        { name: `Shape A (Casa ${rootFret5})`, range: [Math.max(0, rootFret5 - 1), rootFret5 + 3], desc: `Formato de Lá com raiz na 5ª corda, casa ${rootFret5}.` },
        { name: `Shape C (Casa ${(rootFret5 + 3) % 15})`, range: [(rootFret5 + 2) % 15, (rootFret5 + 6) % 15], desc: `Formato de Dó, posição intermediária.` },
        { name: `Shape D (Casa ${(rootFret6 + 5) % 15})`, range: [(rootFret6 + 4) % 15, (rootFret6 + 8) % 15], desc: `Formato de Ré, notas agudas.` },
        { name: `Shape G (Casa ${(rootFret6 + 7) % 15})`, range: [(rootFret6 + 6) % 15, (rootFret6 + 10) % 15], desc: `Formato de Sol, posição ampla.` },
    ]

    return shapes.map(s => {
        // Handle wrap-around (e.g., range[0] > range[1])
        const r: [number, number] = s.range[0] <= s.range[1] ? s.range : [s.range[0], s.range[1] + 12]
        return {
            name: s.name,
            desc: s.desc,
            notes: gen(root, intervals, r, rootClr, thirdClr, noteClr, specials)
        }
    }).filter(s => s.notes.length >= 3) // Only include shapes with at least 3 notes
}

// ── Open Chord Definitions (hardcoded fingerings) ────────
// Notes: {string, fret} where fret=0 means open string, fret=-1 means muted (not shown)
export interface OpenChordDef {
    name: string
    desc: string
    tip: string
    notes: ChordNote[]
}

export const openChordDefinitions: Record<string, OpenChordDef> = {
    E_open: {
        name: 'Mi Maior (E) — Aberto',
        desc: 'Um dos primeiros acordes de todo guitarrista. Tônica na 6ª corda, todas as cordas soam.',
        tip: 'Dedo 1 na 1ª casa da 3ª corda (G#), dedo 2 na 2ª casa da 5ª corda (B), dedo 3 na 2ª casa da 4ª corda (E). Todas as 6 cordas soam!',
        notes: [
            { string: 6, fret: 0, label: 'E', color: R },
            { string: 5, fret: 2, label: 'B', color: N5 },
            { string: 4, fret: 2, label: 'E', color: R },
            { string: 3, fret: 1, label: 'G#', color: T3 },
            { string: 2, fret: 0, label: 'B', color: N5 },
            { string: 1, fret: 0, label: 'E', color: R },
        ]
    },
    Em_open: {
        name: 'Mi Menor (Em) — Aberto',
        desc: 'O mais fácil de todos — apenas 2 dedos. Som melancólico e rico.',
        tip: 'Dedo 1 na 2ª casa da 5ª corda (B), dedo 2 na 2ª casa da 4ª corda (E). Simples assim!',
        notes: [
            { string: 6, fret: 0, label: 'E', color: R },
            { string: 5, fret: 2, label: 'B', color: N5 },
            { string: 4, fret: 2, label: 'E', color: R },
            { string: 3, fret: 0, label: 'G', color: T3 },
            { string: 2, fret: 0, label: 'B', color: N5 },
            { string: 1, fret: 0, label: 'E', color: R },
        ]
    },
    Am_open: {
        name: 'Lá Menor (Am) — Aberto',
        desc: 'O acorde triste por excelência. Tônica na 5ª corda, 5 cordas soam.',
        tip: 'Dedo 1 na 1ª casa da 2ª corda (C), dedo 2 na 2ª casa da 4ª corda (E), dedo 3 na 2ª casa da 3ª corda (A). Corde 6ª (E grave) não toca.',
        notes: [
            { string: 5, fret: 0, label: 'A', color: R },
            { string: 4, fret: 2, label: 'E', color: N5 },
            { string: 3, fret: 2, label: 'A', color: R },
            { string: 2, fret: 1, label: 'C', color: T3 },
            { string: 1, fret: 0, label: 'E', color: N5 },
        ]
    },
    C_open: {
        name: 'Dó Maior (C) — Aberto',
        desc: 'Um dos acordes mais usados em toda música popular. Base do sistema CAGED.',
        tip: 'Dedo 1 na 1ª casa da 2ª corda (C), dedo 2 na 2ª casa da 4ª corda (E), dedo 3 na 3ª casa da 5ª corda (C). Cordes 6ª não toca. 1ª corda (E) soa solta.',
        notes: [
            { string: 5, fret: 3, label: 'C', color: R },
            { string: 4, fret: 2, label: 'E', color: T3 },
            { string: 3, fret: 0, label: 'G', color: N5 },
            { string: 2, fret: 1, label: 'C', color: R },
            { string: 1, fret: 0, label: 'E', color: T3 },
        ]
    },
    G_open: {
        name: 'Sol Maior (G) — Aberto',
        desc: 'Som aberto e cheio — todas as 6 cordas soam. Muito versátil.',
        tip: 'Dedo 1 na 2ª casa da 5ª corda (B), dedo 2 na 3ª casa da 6ª corda (G), dedo 3 na 3ª casa da 1ª corda (G). Cordas 4ª, 3ª e 2ª soam abertas.',
        notes: [
            { string: 6, fret: 3, label: 'G', color: R },
            { string: 5, fret: 2, label: 'B', color: T3 },
            { string: 4, fret: 0, label: 'D', color: N5 },
            { string: 3, fret: 0, label: 'G', color: R },
            { string: 2, fret: 0, label: 'B', color: T3 },
            { string: 1, fret: 3, label: 'G', color: R },
        ]
    },
    D_open: {
        name: 'Ré Maior (D) — Aberto',
        desc: 'Posição compacta e brilhante na região das casas 2-3. Muito comum em pop e rock.',
        tip: 'Dedo 1 na 2ª casa da 3ª corda (F#), dedo 2 na 2ª casa da 1ª corda (E), dedo 3 na 3ª casa da 2ª corda (D). Apenas as 4 cordas agudas soam.',
        notes: [
            { string: 4, fret: 0, label: 'D', color: R },
            { string: 3, fret: 2, label: 'F#', color: T3 },
            { string: 2, fret: 3, label: 'D', color: R },
            { string: 1, fret: 2, label: 'A', color: N5 },
        ]
    },
}

// ── Chord Definitions ────────────────────────────────────
export const chordDefinitions: Record<string, ChordDef> = {
    // ── Dó (C) ──
    C_maj: {
        name: 'Dó Maior (C)',
        desc: 'O acorde mais fundamental. Tríade: Dó + Mi + Sol (1 + 3 + 5).',
        shapes: cagedShapes(C, MAJ, R, T3, N5)
    },
    C_min: {
        name: 'Dó Menor (Cm)',
        desc: 'A terça menor transforma o som alegre em melancólico: Dó + Mi♭ + Sol.',
        shapes: cagedShapes(C, MIN, R, T3, N5)
    },
    C_maj7: {
        name: 'Dó Maior com 7ª (Cmaj7)',
        desc: 'Acorde jazz elegante: Dó + Mi + Sol + Si (1 + 3 + 5 + 7M).',
        shapes: cagedShapes(C, MAJ7, R, T3, N5, [{ interval: 11, color: S7 }])
    },
    C_min7: {
        name: 'Dó Menor com 7ª (Cm7)',
        desc: 'Menor com sétima menor: Dó + Mi♭ + Sol + Si♭.',
        shapes: cagedShapes(C, MIN7, R, T3, N5, [{ interval: 10, color: S7 }])
    },
    C_dom7: {
        name: 'Dó com 7ª Dominante (C7)',
        desc: 'O dominante: Dó + Mi + Sol + Si♭ — resolve para Fá Maior.',
        shapes: cagedShapes(C, DOM7, R, T3, N5, [{ interval: 10, color: S7 }])
    },

    // ── Ré (D) ──
    D_maj: {
        name: 'Ré Maior (D)',
        desc: 'Tríade: Ré + Fá# + Lá (1 + 3 + 5).',
        shapes: cagedShapes(D, MAJ, R, T3, N5)
    },
    D_min: {
        name: 'Ré Menor (Dm)',
        desc: 'Tríade menor: Ré + Fá + Lá.',
        shapes: cagedShapes(D, MIN, R, T3, N5)
    },
    D_dom7: {
        name: 'Ré com 7ª Dominante (D7)',
        desc: 'O dominante: Ré + Fá# + Lá + Dó.',
        shapes: cagedShapes(D, DOM7, R, T3, N5, [{ interval: 10, color: S7 }])
    },

    // ── Mi (E) ──
    E_maj: {
        name: 'Mi Maior (E)',
        desc: 'Tríade: Mi + Sol# + Si (1 + 3 + 5).',
        shapes: cagedShapes(E, MAJ, R, T3, N5)
    },
    E_min: {
        name: 'Mi Menor (Em)',
        desc: 'Tríade menor: Mi + Sol + Si.',
        shapes: cagedShapes(E, MIN, R, T3, N5)
    },
    E_dom7: {
        name: 'Mi com 7ª Dominante (E7)',
        desc: 'O dominante: Mi + Sol# + Si + Ré.',
        shapes: cagedShapes(E, DOM7, R, T3, N5, [{ interval: 10, color: S7 }])
    },

    // ── Fá (F) ──
    F_maj: {
        name: 'Fá Maior (F)',
        desc: 'Tríade: Fá + Lá + Dó (1 + 3 + 5).',
        shapes: cagedShapes(F, MAJ, R, T3, N5)
    },
    F_min: {
        name: 'Fá Menor (Fm)',
        desc: 'Tríade menor: Fá + Lá♭ + Dó.',
        shapes: cagedShapes(F, MIN, R, T3, N5)
    },

    // ── Sol (G) ──
    G_maj: {
        name: 'Sol Maior (G)',
        desc: 'Tríade: Sol + Si + Ré (1 + 3 + 5).',
        shapes: cagedShapes(G, MAJ, R, T3, N5)
    },
    G_min: {
        name: 'Sol Menor (Gm)',
        desc: 'Tríade menor: Sol + Si♭ + Ré.',
        shapes: cagedShapes(G, MIN, R, T3, N5)
    },
    G_dom7: {
        name: 'Sol com 7ª Dominante (G7)',
        desc: 'O dominante: Sol + Si + Ré + Fá.',
        shapes: cagedShapes(G, DOM7, R, T3, N5, [{ interval: 10, color: S7 }])
    },

    // ── Lá (A) ──
    A_maj: {
        name: 'Lá Maior (A)',
        desc: 'Tríade: Lá + Dó# + Mi (1 + 3 + 5).',
        shapes: cagedShapes(A, MAJ, R, T3, N5)
    },
    A_min: {
        name: 'Lá Menor (Am)',
        desc: 'Tríade menor: Lá + Dó + Mi.',
        shapes: cagedShapes(A, MIN, R, T3, N5)
    },
    A_maj7: {
        name: 'Lá Maior com 7ª (Amaj7)',
        desc: 'Acorde jazz: Lá + Dó# + Mi + Sol#.',
        shapes: cagedShapes(A, MAJ7, R, T3, N5, [{ interval: 11, color: S7 }])
    },
    A_min7: {
        name: 'Lá Menor com 7ª (Am7)',
        desc: 'Menor com sétima menor: Lá + Dó + Mi + Sol.',
        shapes: cagedShapes(A, MIN7, R, T3, N5, [{ interval: 10, color: S7 }])
    },

    // ── Si (B) ──
    B_maj: {
        name: 'Si Maior (B)',
        desc: 'Tríade: Si + Ré# + Fá# (1 + 3 + 5).',
        shapes: cagedShapes(B, MAJ, R, T3, N5)
    },
    B_min: {
        name: 'Si Menor (Bm)',
        desc: 'Tríade menor: Si + Ré + Fá#.',
        shapes: cagedShapes(B, MIN, R, T3, N5)
    },
    B_dom7: {
        name: 'Si com 7ª Dominante (B7)',
        desc: 'O dominante: Si + Ré# + Fá# + Lá.',
        shapes: cagedShapes(B, DOM7, R, T3, N5, [{ interval: 10, color: S7 }])
    },

    // ══════════════════════════════════════════════
    // ── SUSTENIDOS / BEMÓIS ──────────────────────
    // ══════════════════════════════════════════════

    // ── Dó# / Ré♭ ──
    Cs_maj: {
        name: 'Dó# Maior / Ré♭ (C#/D♭)',
        desc: 'Tríade: Dó# + Mi# + Sol# (enarmônico de Ré♭ Maior).',
        shapes: cagedShapes(1, MAJ, R, T3, N5)
    },
    Cs_min: {
        name: 'Dó# Menor / Ré♭m (C#m/D♭m)',
        desc: 'Tríade menor: Dó# + Mi + Sol#.',
        shapes: cagedShapes(1, MIN, R, T3, N5)
    },
    Cs_dom7: {
        name: 'Dó# com 7ª Dom. (C#7/D♭7)',
        desc: 'Dominante: Dó# + Mi# + Sol# + Si.',
        shapes: cagedShapes(1, DOM7, R, T3, N5, [{ interval: 10, color: S7 }])
    },

    // ── Ré# / Mi♭ ──
    Eb_maj: {
        name: 'Mi♭ Maior / Ré# (E♭/D#)',
        desc: 'Tríade: Mi♭ + Sol + Si♭.',
        shapes: cagedShapes(3, MAJ, R, T3, N5)
    },
    Eb_min: {
        name: 'Mi♭ Menor (E♭m/D#m)',
        desc: 'Tríade menor: Mi♭ + Sol♭ + Si♭.',
        shapes: cagedShapes(3, MIN, R, T3, N5)
    },
    Eb_dom7: {
        name: 'Mi♭ com 7ª Dom. (E♭7/D#7)',
        desc: 'Dominante: Mi♭ + Sol + Si♭ + Ré♭.',
        shapes: cagedShapes(3, DOM7, R, T3, N5, [{ interval: 10, color: S7 }])
    },

    // ── Fá# / Sol♭ ──
    Fs_maj: {
        name: 'Fá# Maior / Sol♭ (F#/G♭)',
        desc: 'Tríade: Fá# + Lá# + Dó#.',
        shapes: cagedShapes(6, MAJ, R, T3, N5)
    },
    Fs_min: {
        name: 'Fá# Menor (F#m/G♭m)',
        desc: 'Tríade menor: Fá# + Lá + Dó#. Muito usado em worship!',
        shapes: cagedShapes(6, MIN, R, T3, N5)
    },
    Fs_dom7: {
        name: 'Fá# com 7ª Dom. (F#7/G♭7)',
        desc: 'Dominante: Fá# + Lá# + Dó# + Mi.',
        shapes: cagedShapes(6, DOM7, R, T3, N5, [{ interval: 10, color: S7 }])
    },

    // ── Sol# / Lá♭ ──
    Ab_maj: {
        name: 'Lá♭ Maior / Sol# (A♭/G#)',
        desc: 'Tríade: Lá♭ + Dó + Mi♭.',
        shapes: cagedShapes(8, MAJ, R, T3, N5)
    },
    Ab_min: {
        name: 'Lá♭ Menor (A♭m/G#m)',
        desc: 'Tríade menor: Lá♭ + Si + Mi♭.',
        shapes: cagedShapes(8, MIN, R, T3, N5)
    },
    Ab_dom7: {
        name: 'Lá♭ com 7ª Dom. (A♭7/G#7)',
        desc: 'Dominante: Lá♭ + Dó + Mi♭ + Sol♭.',
        shapes: cagedShapes(8, DOM7, R, T3, N5, [{ interval: 10, color: S7 }])
    },

    // ── Lá# / Si♭ ──
    Bb_maj: {
        name: 'Si♭ Maior / Lá# (B♭/A#)',
        desc: 'Tríade: Si♭ + Ré + Fá. Tonalidade frequente em Jazz e Worship.',
        shapes: cagedShapes(10, MAJ, R, T3, N5)
    },
    Bb_min: {
        name: 'Si♭ Menor (B♭m/A#m)',
        desc: 'Tríade menor: Si♭ + Ré♭ + Fá.',
        shapes: cagedShapes(10, MIN, R, T3, N5)
    },
    Bb_dom7: {
        name: 'Si♭ com 7ª Dom. (B♭7/A#7)',
        desc: 'Dominante: Si♭ + Ré + Fá + Lá♭.',
        shapes: cagedShapes(10, DOM7, R, T3, N5, [{ interval: 10, color: S7 }])
    },
}
