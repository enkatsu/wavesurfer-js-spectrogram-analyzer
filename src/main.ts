import './style.css';
import WaveSurfer from 'wavesurfer.js';
import Spectrogram from 'wavesurfer.js/dist/plugins/spectrogram.esm.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js';
import closehat from './sounds/closehat.wav';
import kick from './sounds/kick.wav';
import openhat from './sounds/openhat.wav';
import snare from './sounds/snare.wav';

const sounds = {
  closehat, kick, openhat, snare
};
type PresetSound = keyof typeof sounds;

const ws = WaveSurfer.create({
  container: '#wavesurfer-container',
  waveColor: 'rgb(200, 0, 200)',
  progressColor: 'rgb(100, 0, 100)',
  url: sounds.closehat,
  sampleRate: 44100,
});
ws.registerPlugin(
  TimelinePlugin.create({
    timeInterval: 0.01,
    primaryLabelInterval: 0.1,
  }),
);
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
);

ws.on('load', () => {
  const nowLoading = document.querySelector('#now-loading') as HTMLDivElement;
  nowLoading.classList.remove('hidden');
});

ws.on('ready', () => {
  const nowLoading = document.querySelector('#now-loading') as HTMLDivElement;
  nowLoading.classList.add('hidden');
});

{
  const playPauseButton = document.querySelector('#play-pause') as HTMLButtonElement;
  playPauseButton.onclick = () => {
    if (ws.isPlaying()) {
      ws.pause();
    } else {
      ws.play();
    }
  };
}

{
  const presetSoundSelect = document.querySelector('#preset-sounds') as HTMLSelectElement;
  (Object.keys(sounds) as PresetSound[]).forEach((sound) => {
    const soundOption = document.createElement('option');
    soundOption.innerText = sound;
    soundOption.value = sounds[sound];
    presetSoundSelect.appendChild(soundOption);
  });
  presetSoundSelect.onchange = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    ws.load(target.value);
  };
}

{
  const dropArea: HTMLDivElement = document.querySelector('#drop')!;
  const loadFromFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (loadEvent: ProgressEvent<FileReader>) => {
      ws.load(loadEvent.target?.result as string);
    };
    reader.readAsDataURL(file);
  };
  const showOpenFileDialog = () =>
    new Promise<FileList | null>((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'audio/*';
      input.onchange = () => {
        resolve(input.files);
      };
      input.click();
    });
  dropArea.onclick = async () => {
    const files = (await showOpenFileDialog()) as FileList;
    const file = files[0];
    loadFromFile(file);
  };
  dropArea.ondragenter = (dragEnterEvent: DragEvent) => {
    dragEnterEvent.preventDefault();
    const { target } = dragEnterEvent;
    if (target instanceof HTMLElement) {
      target.classList.add('over');
    }
  };
  dropArea.ondragleave = (dragleaveEvent: DragEvent) => {
    dragleaveEvent.preventDefault();
    const { target } = dragleaveEvent;
    if (target instanceof HTMLDivElement) {
      target.classList.remove('over');
    }
  };
  dropArea.ondragover = (dragoverEvent: DragEvent) => {
    dragoverEvent.preventDefault();
  };
  dropArea.ondrop = (dropEvent: DragEvent) => {
    dropEvent.preventDefault();
    const { target } = dropEvent;
    if (target instanceof HTMLDivElement) {
      target.classList.remove('over');
    }
    const file = dropEvent.dataTransfer?.files[0] as File;
    loadFromFile(file);
    dropArea.textContent = dropEvent.dataTransfer?.files[0].name as string;
  };
  document.body.ondrop = (dropEvent: DragEvent) => {
    dropEvent.preventDefault();
  };
}
