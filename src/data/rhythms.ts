// Rhythm patterns for the progression player.
// Each pattern decides how a chord's notes are distributed across the time slot.

export interface StringedNote {
    string: number   // 6 = low E, 1 = high E
    note: string     // "E2", "C4" etc.
}

export interface Rhythm {
    id: string
    name: string
    icon: string
    desc: string
    // notes: chord notes (keep original string metadata so we can sort low→high)
    // msPerChord: the slot duration
    // fire: callback to schedule one note at `delay` ms from slot start
    play: (notes: StringedNote[], msPerChord: number, fire: (note: string, delay: number) => void) => void
}

// Sort low → high (string 6 first, string 1 last)
const lowToHigh = (n: StringedNote[]) => [...n].sort((a, b) => b.string - a.string)
const highToLow = (n: StringedNote[]) => [...n].sort((a, b) => a.string - b.string)

// Helper: strum all notes in given order with a small per-string delay.
// Step defaults to ~7ms — a real guitar strum is typically 30–50ms across 6 strings.
const strum = (
    notes: StringedNote[],
    offset: number,
    fire: (n: string, d: number) => void,
    step = 7,
) => notes.forEach((n, i) => fire(n.note, offset + i * step))

export const RHYTHMS: Rhythm[] = [
    {
        id: 'block',
        name: 'Bloco',
        icon: '▩',
        desc: 'Todas as notas simultâneas — som cheio e imediato.',
        play: (notes, _ms, fire) => notes.forEach(n => fire(n.note, 0)),
    },
    {
        id: 'down',
        name: 'Strum ↓',
        icon: '↓',
        desc: 'Uma batida para baixo por acorde — graves → agudos.',
        play: (notes, _ms, fire) => strum(lowToHigh(notes), 0, fire, 8),
    },
    {
        id: 'balada',
        name: 'Balada ↓↓↑↓↑',
        icon: '♩',
        desc: 'Pop/rock: 5 batidas por acorde em padrão D-D-U-D-U.',
        play: (notes, ms, fire) => {
            const low = lowToHigh(notes)
            const high = highToLow(notes)
            strum(low,  ms * 0.00, fire, 6)
            strum(low,  ms * 0.25, fire, 6)
            strum(high, ms * 0.50, fire, 5)
            strum(low,  ms * 0.70, fire, 6)
            strum(high, ms * 0.88, fire, 5)
        },
    },
    {
        id: 'arp_up',
        name: 'Arpejo ↑',
        icon: '⇗',
        desc: 'Cada nota individual, grave → agudo, em colcheias.',
        play: (notes, ms, fire) => {
            const seq = lowToHigh(notes)
            if (!seq.length) return
            // Compress into first 80% of slot so the next chord breathes
            const step = Math.min(ms * 0.8 / seq.length, 90)
            seq.forEach((n, i) => fire(n.note, i * step))
        },
    },
    {
        id: 'arp_updown',
        name: 'Arpejo ↑↓',
        icon: '⇅',
        desc: 'Sobe e desce — textura dedilhada de balada.',
        play: (notes, ms, fire) => {
            const asc = lowToHigh(notes)
            if (asc.length < 2) { asc.forEach(n => fire(n.note, 0)); return }
            const seq = [...asc, ...[...asc].reverse().slice(1, -1)]
            const step = Math.min(ms * 0.85 / seq.length, 80)
            seq.forEach((n, i) => fire(n.note, i * step))
        },
    },
    {
        id: 'dedilhado',
        name: 'Dedilhado',
        icon: '🫱',
        desc: 'Baixo + agudos alternados — folk / Travis picking simplificado.',
        play: (notes, ms, fire) => {
            const asc = lowToHigh(notes)
            const bass = asc[0]
            const trebles = asc.slice(1)
            // 4-pulse: bass, treble, bass, treble — keeps the slot busy
            const beat = ms / 4
            if (bass) fire(bass.note, 0)
            if (trebles[0]) fire(trebles[0].note, beat)
            if (bass) fire(bass.note, beat * 2)
            // Strum the rest of the trebles as a quick upper-register flourish
            if (trebles.length > 1) strum(trebles.slice(1), beat * 3, fire, 6)
        },
    },
    {
        id: 'samba',
        name: 'Samba / Bossa',
        icon: '🥁',
        desc: 'Baixo nos tempos fortes, acorde picado nos contratempos.',
        play: (notes, ms, fire) => {
            const asc = lowToHigh(notes)
            const bass = asc[0]
            const chord = asc.slice(1)
            const beat = ms / 4
            if (bass) fire(bass.note, 0)
            strum(chord, beat * 0.75, fire, 4)   // &-1
            strum(chord, beat * 1.5,  fire, 4)   // 2
            if (bass) fire(bass.note, beat * 2)
            strum(chord, beat * 2.75, fire, 4)   // &-3
            strum(chord, beat * 3.5,  fire, 4)   // 4
        },
    },
    {
        id: 'valsa',
        name: 'Valsa (3/4)',
        icon: '¾',
        desc: 'Um-dois-três: baixo no 1, acorde no 2 e 3.',
        play: (notes, ms, fire) => {
            const asc = lowToHigh(notes)
            const bass = asc[0]
            const chord = asc.slice(1)
            if (bass) fire(bass.note, 0)
            strum(chord, ms / 3,     fire, 6)
            strum(chord, ms * 2 / 3, fire, 6)
        },
    },
    {
        id: 'rock',
        name: 'Rock ↓↑↓↑',
        icon: '🤘',
        desc: 'Oito colcheias alternadas — motor rítmico de rock e punk.',
        play: (notes, ms, fire) => {
            const low = lowToHigh(notes)
            const high = highToLow(notes)
            for (let i = 0; i < 8; i++) {
                const pattern = i % 2 === 0 ? low : high
                strum(pattern, ms * i / 8, fire, 4)
            }
        },
    },
]
