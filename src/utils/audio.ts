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

// Real guitar samples via gleitz/midi-js-soundfonts (GitHub Pages — CORS open)
const GLEITZ = 'https://gleitz.github.io/midi-js-soundfonts/MusyngKite/'

// 11 notes spread across the guitar range (E2–E5).
// Tone.Sampler pitch-shifts automatically for notes between loaded samples.
const SAMPLE_URLS: Record<string, string> = {
    'A2': 'A2.mp3', 'C3': 'C3.mp3', 'E3': 'E3.mp3', 'G3': 'G3.mp3',
    'A3': 'A3.mp3', 'C4': 'C4.mp3', 'E4': 'E4.mp3', 'G4': 'G4.mp3',
    'A4': 'A4.mp3', 'C5': 'C5.mp3', 'E5': 'E5.mp3',
}

interface PresetCfg {
    baseUrl: string
    reverbWet: number
    distWet: number
    volume: number // dB — ~20% louder vs a neutral -4 dB baseline
}

const CFG: Record<SoundPreset, PresetCfg> = {
    nylon:    { baseUrl: `${GLEITZ}acoustic_guitar_nylon-mp3/`,  reverbWet: 0.40, distWet: 0,    volume:  0 },
    steel:    { baseUrl: `${GLEITZ}acoustic_guitar_steel-mp3/`,  reverbWet: 0.24, distWet: 0,    volume:  1 },
    electric: { baseUrl: `${GLEITZ}electric_guitar_clean-mp3/`,  reverbWet: 0.15, distWet: 0,    volume:  2 },
    dist:     { baseUrl: `${GLEITZ}distortion_guitar-mp3/`,      reverbWet: 0.18, distWet: 0.50, volume: -1 },
}

class AudioManager {
    private samplers = new Map<SoundPreset, Tone.Sampler>()
    private loaded = new Set<SoundPreset>()
    private reverb: Tone.Freeverb
    private distortion: Tone.Distortion
    private compressor: Tone.Compressor
    private volumeNode: Tone.Volume
    private initialized = false

    readonly currentPreset = ref<SoundPreset>('nylon')
    // true while the current preset's samples are still downloading
    readonly loading = ref(true)

    constructor() {
        this.distortion = new Tone.Distortion({ distortion: 0.65, wet: 0 })
        this.compressor = new Tone.Compressor(-18, 4)
        // Freeverb: synchronous feedback reverb, no async IR generation
        this.reverb     = new Tone.Freeverb({ roomSize: 0.55, dampening: 3200 })
        this.volumeNode = new Tone.Volume(CFG.nylon.volume)

        // Shared effects bus: all samplers → distortion → compressor → reverb → volume → out
        this.distortion.chain(this.compressor, this.reverb, this.volumeNode, Tone.getDestination())
        this.reverb.wet.value     = CFG.nylon.reverbWet
        this.distortion.wet.value = CFG.nylon.distWet

        // Load the default preset immediately; others are lazy-loaded on first select
        this._loadSampler('nylon')
    }

    private _loadSampler(preset: SoundPreset) {
        if (this.samplers.has(preset)) return
        const cfg = CFG[preset]
        const sampler = new Tone.Sampler({
            urls: SAMPLE_URLS,
            baseUrl: cfg.baseUrl,
            onload: () => {
                this.loaded.add(preset)
                if (this.currentPreset.value === preset) this.loading.value = false
            },
        })
        sampler.connect(this.distortion)
        this.samplers.set(preset, sampler)
    }

    async init() {
        if (!this.initialized) {
            await Tone.start()
            this.initialized = true
        }
    }

    setPreset(preset: SoundPreset) {
        this.currentPreset.value = preset
        const cfg = CFG[preset]
        this.reverb.wet.value        = cfg.reverbWet
        this.distortion.wet.value    = cfg.distWet
        this.volumeNode.volume.value = cfg.volume

        if (!this.samplers.has(preset)) {
            this.loading.value = true
            this._loadSampler(preset)
        } else {
            this.loading.value = !this.loaded.has(preset)
        }
    }

    playNote(note: string) {
        if (!this.initialized) return
        const s = this.samplers.get(this.currentPreset.value)
        if (!s || !this.loaded.has(this.currentPreset.value)) return
        // triggerAttack lets the sample decay naturally (no forced release)
        s.triggerAttack(note)
    }

    playChord(notes: string[]) {
        if (!this.initialized) return
        const s = this.samplers.get(this.currentPreset.value)
        if (!s || !this.loaded.has(this.currentPreset.value)) return
        notes.forEach(n => s.triggerAttack(n))
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
