import './style.css'
import WaveSurfer from 'wavesurfer.js'
import Spectrogram from 'wavesurfer.js/dist/plugins/spectrogram.esm.js'
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js'

const sounds = [
  'closehat.wav',
  'kick.wav',
  'openhat.wav',
  'snare.wav',
];

const ws = WaveSurfer.create({
  container: '#wavesurfer-container',
  waveColor: 'rgb(200, 0, 200)',
  progressColor: 'rgb(100, 0, 100)',
  url: sounds[0],
  sampleRate: 44100,
})

ws.registerPlugin(
  Spectrogram.create({
    labels: true,
    height: 200,
    splitChannels: true,
    scale: 'mel', // or 'linear', 'logarithmic', 'bark', 'erb'
    frequencyMax: 8000,
    frequencyMin: 0,
    fftSamples: 1024,
    labelsBackground: 'rgba(0, 0, 0, 0.1)',
  }),
)
ws.registerPlugin(TimelinePlugin.create())

ws.on('interaction', () => {
  ws.play()
})

ws.on('load', () => {
  console.log('load');
  const nowLoading = document.querySelector('#now-loading') as HTMLDivElement
  nowLoading.classList.remove('hidden')
})

ws.on('ready', () => {
  console.log('ready');
  const nowLoading = document.querySelector('#now-loading') as HTMLDivElement
  nowLoading.classList.add('hidden')
})

{
  const playPauseButton = document.querySelector('#play-pause') as HTMLButtonElement
  playPauseButton.onclick = () => {
    if (ws.isPlaying()) {
      ws.pause()
    } else {
      ws.play()
    }
  }
}

{
  const presetSoundSelect = document.querySelector('#preset-sounds') as HTMLSelectElement;
  sounds.forEach(sound => {
    const soundOption = document.createElement('option')
    soundOption.innerText = sound
    soundOption.value = sound
    presetSoundSelect.appendChild(soundOption)
  })
  presetSoundSelect.onchange = (event: Event) => {
    const target = event.target as HTMLSelectElement
    ws.load(target.value)
  }
}

{
  const dropArea: HTMLDivElement = document.querySelector('#drop')!
  dropArea.ondragenter = (dragEnterEvent: DragEvent) => {
    dragEnterEvent.preventDefault()
    const {target} = dragEnterEvent
    if (target instanceof HTMLElement) {
      target.classList.add('over')
    }
  }
  dropArea.ondragleave = (dragleaveEvent: DragEvent) => {
    dragleaveEvent.preventDefault()
    const {target} = dragleaveEvent
    if (target instanceof HTMLDivElement) {
      target.classList.remove('over')
    }
  }
  dropArea.ondragover = (dragoverEvent: DragEvent) => {
    dragoverEvent.preventDefault()
  }
  dropArea.ondrop = (dropEvent: DragEvent) => {
    dropEvent.preventDefault()
    const {target} = dropEvent
    if (target instanceof HTMLDivElement) {
      target.classList.remove('over')
    }
    
    const reader = new FileReader()
    reader.onload = (loadEvent: ProgressEvent<FileReader>) => {
      ws.load(loadEvent.target?.result as string)
    }
    reader.readAsDataURL(dropEvent.dataTransfer?.files[0] as File)
    dropArea.textContent = dropEvent.dataTransfer?.files[0].name as string
    ws.empty()
  }
  document.body.ondrop = (dropEvent: DragEvent) => {
    dropEvent.preventDefault()
  }
}
