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

// PluckSynth does NOT extend Monophonic, so PolySynth rejects it.
// We manage our own voice pool (8 instances) with round-robin allocation.
type PluckParams = { attackNoise: number; dampening: number; resonance: number }

interface PresetConfig {
    pluck: PluckParams
    reverbWet: number
    distWet: number
    volume: number // dB — already boosted ~+1.6 dB (~20% louder) vs neutral baseline
}

const PRESETS: Record<SoundPreset, PresetConfig> = {
    // Warm, round — nylon string classical guitar
    nylon: {
        pluck:     { attackNoise: 1.2, dampening: 2400, resonance: 0.966 },
        reverbWet: 0.42,
        distWet:   0,
        volume:    -2,
    },
    // Punchy, bright attack — steel string acoustic / folk
    steel: {
        pluck:     { attackNoise: 3.0, dampening: 5200, resonance: 0.976 },
        reverbWet: 0.26,
        distWet:   0,
        volume:    -1,
    },
    // Glassy, long sustain — clean electric (neck pickup)
    electric: {
        pluck:     { attackNoise: 1.4, dampening: 8000, resonance: 0.990 },
        reverbWet: 0.16,
        distWet:   0,
        volume:    0,
    },
    // Saturated crunch — light overdrive rock/blues
    dist: {
        pluck:     { attackNoise: 2.2, dampening: 5500, resonance: 0.992 },
        reverbWet: 0.18,
        distWet:   0.52,
        volume:    -3,
    },
}

const VOICE_POOL_SIZE = 8

class AudioManager {
    private voices: Tone.PluckSynth[]
    private voiceIdx = 0
    private reverb: Tone.Freeverb
    private distortion: Tone.Distortion
    private compressor: Tone.Compressor
    private volumeNode: Tone.Volume
    private initialized = false
    readonly currentPreset = ref<SoundPreset>('nylon')

    constructor() {
        const init = PRESETS.nylon

        // Voice pool — round-robin allocation avoids voice stealing artifacts
        this.voices = Array.from({ length: VOICE_POOL_SIZE }, () =>
            new Tone.PluckSynth(init.pluck)
        )

        this.distortion = new Tone.Distortion({ distortion: 0.65, wet: 0 })
        this.compressor = new Tone.Compressor(-18, 4)
        // Freeverb is synchronous (feedback algorithm, no async IR generation)
        this.reverb = new Tone.Freeverb({ roomSize: 0.55, dampening: 3200 })
        this.volumeNode = new Tone.Volume(init.volume)

        // All voices → shared mix bus → effects chain → output
        const mix = new Tone.Gain(1)
        this.voices.forEach(v => v.connect(mix))
        mix.chain(this.distortion, this.compressor, this.reverb, this.volumeNode, Tone.getDestination())

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
        this.voices.forEach(v => v.set(p.pluck))
        this.reverb.wet.value = p.reverbWet
        this.distortion.wet.value = p.distWet
        this.volumeNode.volume.value = p.volume
        this.currentPreset.value = preset
    }

    playNote(note: string, _duration = '4n') {
        if (!this.initialized) return
        // PluckSynth decays naturally — no triggerRelease needed
        const voice = this.voices[this.voiceIdx % VOICE_POOL_SIZE]!
        this.voiceIdx++
        voice.triggerAttack(note)
    }

    playChord(notes: string[], _duration = '2n') {
        if (!this.initialized) return
        notes.forEach(note => {
            const voice = this.voices[this.voiceIdx % VOICE_POOL_SIZE]!
            this.voiceIdx++
            voice.triggerAttack(note)
        })
    }

    // Guitar standard tuning: string 1 = high e (E4) … string 6 = low E (E2)
    getFretNote(stringIdx: number, fret: number): string {
        const openNotes = ['E4', 'B3', 'G3', 'D3', 'A2', 'E2']
        const root = openNotes[stringIdx - 1]
        if (!root) return ''
        return Tone.Frequency(root).transpose(fret).toNote()
    }
}

export const audio = new AudioManager()
