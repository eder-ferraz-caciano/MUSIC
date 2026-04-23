// Chromatic note names
const N = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
// Open string chromatic values: strings 6→1 = E A D G B E
const OPEN = [4, 9, 2, 7, 11, 4]

export interface ScaleNote { string: number; fret: number; label: string; color: string }
export interface ScaleShape { name: string; notes: ScaleNote[] }
export interface ScaleDef {
    name: string
    desc: string
    btnActive: string
    btnInactive: string
    glowClass: string
    shapes: ScaleShape[]
}

// All 12 chromatic roots for the selector
export const ROOT_NOTES = [
    { value: 0, label: 'C (Dó)' },
    { value: 1, label: 'C# / D♭' },
    { value: 2, label: 'D (Ré)' },
    { value: 3, label: 'D# / E♭' },
    { value: 4, label: 'E (Mi)' },
    { value: 5, label: 'F (Fá)' },
    { value: 6, label: 'F# / G♭' },
    { value: 7, label: 'G (Sol)' },
    { value: 8, label: 'G# / A♭' },
    { value: 9, label: 'A (Lá)' },
    { value: 10, label: 'A# / B♭' },
    { value: 11, label: 'B (Si)' },
]

function gen(
    root: number,
    intervals: number[],
    range: [number, number],
    rootClr: string,
    noteClr: string,
    specials?: { interval: number; color: string }[]
): ScaleNote[] {
    const res: ScaleNote[] = []
    const scaleChrom = intervals.map(i => (root + i) % 12)
    for (let si = 0; si < 6; si++) {
        const str = 6 - si
        for (let f = range[0]; f <= range[1]; f++) {
            const nc = (OPEN[si]! + f) % 12
            const idx = scaleChrom.indexOf(nc)
            if (idx !== -1) {
                const sp = specials?.find(s => s.interval === intervals[idx])
                const isRoot = intervals[idx] === 0
                res.push({ string: str, fret: f, label: N[nc]!, color: sp ? sp.color : (isRoot ? rootClr : noteClr) })
            }
        }
    }
    return res
}

const G = 'bg-zinc-600 text-white'

// ── Intervals ────────────────────────────────────────────
const PENTA_MAJ = [0, 2, 4, 7, 9]
const PENTA_MIN = [0, 3, 5, 7, 10]
const BLUES = [0, 3, 5, 6, 7, 10]
const MAJOR = [0, 2, 4, 5, 7, 9, 11]
const MINOR_NAT = [0, 2, 3, 5, 7, 8, 10]
const HARM_MIN = [0, 2, 3, 5, 7, 8, 11]
const MELOD_MIN = [0, 2, 3, 5, 7, 9, 11]
const DIMINISHED = [0, 2, 3, 5, 6, 8, 9, 11]
const WHOLE_TONE = [0, 2, 4, 6, 8, 10]

// ── Color tokens ─────────────────────────────────────────
const R_RED = 'bg-red-500 text-white shadow-lg shadow-red-500/40'
const R_SKY = 'bg-sky-500 text-white shadow-lg shadow-sky-500/40'
const R_BLUE = 'bg-blue-500 text-white shadow-lg shadow-blue-500/40'
const R_EMER = 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/40'
const R_PURP = 'bg-purple-500 text-white shadow-lg shadow-purple-500/40'
const R_PINK = 'bg-pink-500 text-white shadow-lg shadow-pink-500/40'
const R_ORAN = 'bg-orange-500 text-white shadow-lg shadow-orange-500/40'
const R_TEAL = 'bg-teal-500 text-white shadow-lg shadow-teal-500/40'
const R_LIME = 'bg-lime-500 text-white shadow-lg shadow-lime-500/40'
const BLUE_NOTE = 'bg-yellow-400 text-black font-bold ring-2 ring-yellow-300'
const SPECIAL = 'bg-amber-400 text-black font-bold ring-2 ring-amber-300'

// ── Shape position offsets (relative to root on 6th string) ──
// For each scale we define offsets from the root fret on the 6th string
// The root fret on 6th string = (root - 4 + 12) % 12 for E standard tuning

interface ScaleTemplate {
    name: string
    desc: string
    btnActive: string
    btnInactive: string
    glowClass: string
    intervals: number[]
    rootColor: string
    specials?: { interval: number; color: string }[]
    // Each shape: [name suffix, fret offset from root6, span]
    shapeOffsets: { label: string; offset: number; span: number }[]
}

const templates: Record<string, ScaleTemplate> = {
    major_pentatonic: {
        name: 'Pentatônica Maior',
        desc: 'A companheira brilhante da pentatônica menor — 5 notas com som alegre e melódico. Muito usada em pop, country, rock melódico e solos de blues com sentimento "maior". Toque sobre acordes maiores e dominantes.',
        btnActive: 'bg-lime-500 text-white shadow-[0_0_15px_rgba(132,204,22,0.5)]',
        btnInactive: 'bg-zinc-950 text-zinc-400 hover:text-white',
        glowClass: 'bg-lime-600',
        intervals: PENTA_MAJ,
        rootColor: R_LIME,
        shapeOffsets: [
            { label: 'Shape 1', offset: -2, span: 3 },
            { label: 'Shape 2', offset: 0, span: 3 },
            { label: 'Shape 3', offset: 2, span: 4 },
            { label: 'Shape 4', offset: 5, span: 3 },
            { label: 'Shape 5', offset: -5, span: 3 },
        ]
    },
    minor_pentatonic: {
        name: 'Pentatônica Menor',
        desc: 'A rainha do Rock & Blues — apenas 5 notas que soam perfeitas sobre qualquer progressão menor. Decore os 5 shapes e o braço inteiro vira seu playground!',
        btnActive: 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]',
        btnInactive: 'bg-zinc-950 text-zinc-400 hover:text-white',
        glowClass: 'bg-red-600',
        intervals: PENTA_MIN,
        rootColor: R_RED,
        shapeOffsets: [
            { label: 'Shape 1', offset: 0, span: 3 },
            { label: 'Shape 2', offset: 2, span: 3 },
            { label: 'Shape 3', offset: 4, span: 4 },
            { label: 'Shape 4', offset: 7, span: 3 },
            { label: 'Shape 5', offset: -5, span: 3 },
        ]
    },
    blues: {
        name: 'Pentatônica Blues',
        desc: 'A Pentatônica Menor turbinada com a famosa "Blue Note" (b5) — aquela nota tensa e chorosa que define o Blues, Jazz e o Soul.',
        btnActive: 'bg-sky-500 text-white shadow-[0_0_15px_rgba(14,165,233,0.5)]',
        btnInactive: 'bg-zinc-950 text-zinc-400 hover:text-white',
        glowClass: 'bg-sky-600',
        intervals: BLUES,
        rootColor: R_SKY,
        specials: [{ interval: 6, color: BLUE_NOTE }],
        shapeOffsets: [
            { label: 'Shape 1', offset: 0, span: 3 },
            { label: 'Shape 2', offset: 2, span: 4 },
            { label: 'Shape 3', offset: 4, span: 4 },
            { label: 'Shape 4', offset: 7, span: 4 },
            { label: 'Shape 5', offset: -5, span: 4 },
        ]
    },
    major: {
        name: 'Maior Natural (Diatônica)',
        desc: 'A escala-mãe de toda a harmonia ocidental. Sete notas, cinco shapes no sistema CAGED. Domine-a e entenderá qualquer música!',
        btnActive: 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]',
        btnInactive: 'bg-zinc-950 text-zinc-400 hover:text-white',
        glowClass: 'bg-blue-600',
        intervals: MAJOR,
        rootColor: R_BLUE,
        shapeOffsets: [
            { label: 'Shape 1', offset: -4, span: 4 },
            { label: 'Shape 2', offset: -2, span: 3 },
            { label: 'Shape 3', offset: 0, span: 5 },
            { label: 'Shape 4', offset: 3, span: 3 },
            { label: 'Shape 5', offset: 5, span: 4 },
        ]
    },
    minor: {
        name: 'Menor Natural (Eólia)',
        desc: 'O relativo menor da escala Maior — mesmas notas, porém iniciando na sexta nota. Produz um som melancólico e introspectivo.',
        btnActive: 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]',
        btnInactive: 'bg-zinc-950 text-zinc-400 hover:text-white',
        glowClass: 'bg-emerald-600',
        intervals: MINOR_NAT,
        rootColor: R_EMER,
        shapeOffsets: [
            { label: 'Shape 1', offset: 0, span: 4 },
            { label: 'Shape 2', offset: 2, span: 3 },
            { label: 'Shape 3', offset: 4, span: 4 },
            { label: 'Shape 4', offset: 7, span: 3 },
            { label: 'Shape 5', offset: -5, span: 4 },
        ]
    },
    harmonic_minor: {
        name: 'Menor Harmônica',
        desc: 'A Menor Natural com a 7ª elevada — aquele salto "árabe/neoclássico" exótico. Base do Metal neoclássico e da música oriental.',
        btnActive: 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]',
        btnInactive: 'bg-zinc-950 text-zinc-400 hover:text-white',
        glowClass: 'bg-purple-600',
        intervals: HARM_MIN,
        rootColor: R_PURP,
        specials: [{ interval: 11, color: SPECIAL }],
        shapeOffsets: [
            { label: 'Shape 1', offset: -1, span: 5 },
            { label: 'Shape 2', offset: 2, span: 4 },
            { label: 'Shape 3', offset: 4, span: 4 },
            { label: 'Shape 4', offset: 7, span: 4 },
            { label: 'Shape 5', offset: -5, span: 4 },
        ]
    },
    melodic_minor: {
        name: 'Menor Melódica',
        desc: 'A 6ª e 7ª elevadas eliminam o salto árabe, criando uma subida suave — essencial no Jazz e na Bossa Nova.',
        btnActive: 'bg-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.5)]',
        btnInactive: 'bg-zinc-950 text-zinc-400 hover:text-white',
        glowClass: 'bg-pink-600',
        intervals: MELOD_MIN,
        rootColor: R_PINK,
        specials: [{ interval: 9, color: SPECIAL }, { interval: 11, color: SPECIAL }],
        shapeOffsets: [
            { label: 'Shape 1', offset: -1, span: 5 },
            { label: 'Shape 2', offset: 2, span: 4 },
            { label: 'Shape 3', offset: 4, span: 4 },
            { label: 'Shape 4', offset: 7, span: 4 },
            { label: 'Shape 5', offset: -5, span: 4 },
        ]
    },
    diminished: {
        name: 'Diminuta (Tom-Semitom)',
        desc: 'Escala simétrica de 8 notas alternando Tom e Semitom. Gera altíssima tensão. Repete-se a cada 3 casas!',
        btnActive: 'bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.5)]',
        btnInactive: 'bg-zinc-950 text-zinc-400 hover:text-white',
        glowClass: 'bg-orange-600',
        intervals: DIMINISHED,
        rootColor: R_ORAN,
        shapeOffsets: [
            { label: 'Shape 1', offset: -1, span: 5 },
            { label: 'Shape 2', offset: 2, span: 4 },
            { label: 'Shape 3', offset: 5, span: 4 },
        ]
    },
    whole_tone: {
        name: 'Tons Inteiros (Hexafônica)',
        desc: 'Cada nota separada por 1 tom inteiro — sem semitons! Cria aquele efeito "sonho" usado em trilhas de cinema e jazz impressionista.',
        btnActive: 'bg-teal-500 text-white shadow-[0_0_15px_rgba(20,184,166,0.5)]',
        btnInactive: 'bg-zinc-950 text-zinc-400 hover:text-white',
        glowClass: 'bg-teal-600',
        intervals: WHOLE_TONE,
        rootColor: R_TEAL,
        shapeOffsets: [
            { label: 'Shape 1', offset: -4, span: 6 },
            { label: 'Shape 2', offset: 2, span: 6 },
        ]
    },
}

/**
 * Generate all scale definitions for a given root note (0-11 chromatic).
 * Shapes are recalculated based on the root's position on the 6th string.
 */
export function buildScalesForRoot(root: number): Record<string, ScaleDef> {
    // Root fret on 6th string (E = chromatic 4)
    const rootFret6 = ((root - 4) + 120) % 12 // +120 to avoid negative modulo

    const result: Record<string, ScaleDef> = {}

    for (const [key, tpl] of Object.entries(templates)) {
        const shapes: ScaleShape[] = tpl.shapeOffsets.map(so => {
            let startFret = rootFret6 + so.offset
            // Wrap to valid range, prefer frets 0-15
            if (startFret < 0) startFret += 12
            if (startFret > 15) startFret -= 12
            const endFret = startFret + so.span

            return {
                name: `${so.label} (Casa ${startFret})`,
                notes: gen(root, tpl.intervals, [startFret, endFret], tpl.rootColor, G, tpl.specials)
            }
        }).filter(s => s.notes.length >= 4)

        result[key] = {
            name: tpl.name,
            desc: tpl.desc,
            btnActive: tpl.btnActive,
            btnInactive: tpl.btnInactive,
            glowClass: tpl.glowClass,
            shapes
        }
    }

    return result
}

// Export template keys for iteration
export const scaleTemplateKeys = Object.keys(templates)
