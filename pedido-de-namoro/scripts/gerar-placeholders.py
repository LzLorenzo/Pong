"""Gera a musica placeholder (public/music.mp3). Uso: python3 scripts/gerar-placeholders.py"""
import subprocess, tempfile, wave
from pathlib import Path
import numpy as np

SR = 44100
BPM = 84
BEAT = 60 / BPM
ROOT = Path(__file__).resolve().parent.parent

def hz(semi_from_a4: int) -> float:
    return 440.0 * 2 ** (semi_from_a4 / 12)

# Notas (semitons relativos a A4). None = pausa.
C4, D4, E4, F4, G4, A4, B4, C5, D5, E5 = -9, -7, -5, -4, -2, 0, 2, 3, 5, 7
C3, F3, G3, A3 = -21, -16, -14, -12
MELODY = [
    (E5, 1), (D5, 1), (C5, 2), (D5, 1), (E5, 1), (G4 + 12 - 12, 2),
    (A4, 1), (C5, 1), (B4, 2), (G4, 1), (A4, 1), (E4, 2),
    (F4, 1), (A4, 1), (C5, 2), (B4, 1), (A4, 1), (G4, 2),
    (E4, 1), (G4, 1), (D5, 1), (C5, 1), (C5, 4),
]
BASS = [(C3, 4), (A3 - 12, 4), (F3, 4), (C3, 4)] * 2  # progressao simples

def tone(freq: float, dur: float, vol: float) -> np.ndarray:
    t = np.arange(int(SR * (dur + 1.2))) / SR
    env = np.exp(-3.2 * t) * (1 - np.exp(-t * 400))  # ataque curto, queda de caixa de musica
    wave_ = (np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(2 * np.pi * freq * 2 * t)
             + 0.12 * np.sin(2 * np.pi * freq * 3 * t))
    return vol * env * wave_

def render(seq, vol):
    total = sum(d for _, d in seq) * BEAT
    out = np.zeros(int(SR * (total + 1.5)))
    pos = 0.0
    for note, beats in seq:
        if note is not None:
            s = tone(hz(note), beats * BEAT, vol)
            i = int(pos * SR)
            out[i:i + len(s)] += s[: len(out) - i]
        pos += beats * BEAT
    return out, total

mel, total = render(MELODY * 2, 0.32)
bas, _ = render(BASS, 0.22)
n = max(len(mel), len(bas))
mix = np.zeros(n); mix[:len(mel)] += mel; mix[:len(bas)] += bas
# reverb simples (ecos)
for delay, gain in ((0.23, 0.35), (0.41, 0.2), (0.67, 0.1)):
    d = int(delay * SR); mix[d:] += gain * mix[:-d]
mix /= np.max(np.abs(mix)) * 1.15
fade = int(SR * 2); mix[-fade:] *= np.linspace(1, 0, fade)
pcm = (mix * 32767).astype("<i2")

with tempfile.TemporaryDirectory() as tmp:
    wav = Path(tmp) / "m.wav"
    with wave.open(str(wav), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav), "-b:a", "96k",
                    str(ROOT / "public" / "music.mp3")], check=True)
print("public/music.mp3 gerado")
