import * as Tone from 'tone'
import { ref } from 'vue'

export type SoundPreset = 'nylon' | 'steel' | 'electric' | 'dist'

export const PRESET_KEYS: SoundPreset[] = ['nylon', 'steel', 'electric', 'dist']

export const PRESET_META: Record<SoundPreset, { label: string; icon: string }> = {
    nylon:    { label: 'Violão Nylon',        icon: '🎸' },
    steel:    { label: 'Violão Aço',          icon: '🪕' },
    electric: { label: 'Elétrica Limpa',      icon: '⚡' },
    dist:     { label: 'Elétrica Distorcida', icon: '🎸' },
}

interface PresetConfig {
    // PluckSynth (Karplus-Strong): attackNoise = pick attack, dampening = brightness cutoff Hz, resonance = sustain length
    pluck: { attackNoise: number; dampening: number; resonance: number }
    reverbWet: number   // 0–1
    distWet: number     // 0–1
    volume: number      // dB — already boosted ~+1.6 dB (~20% louder) vs neutral baseline
}

const PRESETS: Record<SoundPreset, PresetConfig> = {
    // Warm, round, medium sustain — nylon string classical guitar
    nylon: {
        pluck:     { attackNoise: 1.2, dampening: 2400, resonance: 0.966 },
        reverbWet: 0.42,
        distWet:   0,
        volume:    -2,
    },
    // Bright, punchy attack — steel string acoustic / folk
    steel: {
        pluck:     { attackNoise: 3.0, dampening: 5200, resonance: 0.976 },
        reverbWet: 0.26,
        distWet:   0,
        volume:    -1,
    },
    // Long sustain, glassy tone — clean electric (neck pickup)
    electric: {
        pluck:     { attackNoise: 1.4, dampening: 8000, resonance: 0.990 },
        reverbWet: 0.16,
        distWet:   0,
        volume:    0,
    },
    // Saturated crunch — light overdrive electric (rock/blues)
    dist: {
        pluck:     { attackNoise: 2.2, dampening: 5500, resonance: 0.992 },
        reverbWet: 0.18,
        distWet:   0.52,
        volume:    -3,
    },
}

class AudioManager {
    private synth: Tone.PolySynth<Tone.PluckSynth>
    private reverb: Tone.Freeverb
    private distortion: Tone.Distortion
    private compressor: Tone.Compressor
    private initialized = false
    readonly currentPreset = ref<SoundPreset>('nylon')

    constructor() {
        const init = PRESETS.nylon

        this.synth = new Tone.PolySynth(Tone.PluckSynth, init.pluck)
        // Freeverb: synchronous (no async IR generation), roomSize=warmth, dampening=brightness of tail
        this.reverb = new Tone.Freeverb({ roomSize: 0.55, dampening: 3200 })
        this.distortion = new Tone.Distortion({ distortion: 0.65, wet: 0 })
        this.compressor = new Tone.Compressor(-18, 4)

        this.synth.chain(this.distortion, this.compressor, this.reverb, Tone.getDestination())
        this.synth.volume.value = init.volume
        this.reverb.wet.value = init.reverbWet
    }

    async init() {
        if (!this.initialized) {
            await Tone.start()
            this.initialized = true
        }
    }

    setPreset(preset: SoundPreset) {
        const p = PRESETS[preset]
        this.synth.set(p.pluck)
        this.reverb.wet.value = p.reverbWet
        this.distortion.wet.value = p.distWet
        this.synth.volume.value = p.volume
        this.currentPreset.value = preset
    }

    playNote(note: string, duration = '4n') {
        if (!this.initialized) return
        this.synth.triggerAttackRelease(note, duration)
    }

    playChord(notes: string[], duration = '2n') {
        if (!this.initialized) return
        this.synth.triggerAttackRelease(notes, duration)
    }

    // Guitar standard tuning: string 1 = high e (E4), string 6 = low E (E2)
    getFretNote(stringIdx: number, fret: number): string {
        const openNotes = ['E4', 'B3', 'G3', 'D3', 'A2', 'E2']
        const root = openNotes[stringIdx - 1]
        if (!root) return ''
        return Tone.Frequency(root).transpose(fret).toNote()
    }
}

export const audio = new AudioManager()
