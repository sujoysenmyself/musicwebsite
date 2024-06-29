const audio = document.getElementById('audio');
const lyrics = document.getElementById('lyrics');
const recordButton = document.getElementById('record');
const stopButton = document.getElementById('stop');

const lyricsText = `
  [00:00] Line 1 of the song lyrics
  [00:05] Line 2 of the song lyrics
  [00:10] Line 3 of the song lyrics
  [00:15] Line 4 of the song lyrics
  [00:20] Line 5 of the song lyrics
  [00:25] Line 6 of the song lyrics
  [00:30] Line 7 of the song lyrics
  [00:35] Line 8 of the song lyrics
  [00:40] Line 9 of the song lyrics
  [00:45] Line 10 of the song lyrics
`;

// Parse lyrics and timings
const parsedLyrics = lyricsText.trim().split('\n').map(line => {
  const [time, text] = line.split(']');
  const [minutes, seconds] = time.replace('[', '').split(':');
  return { time: parseInt(minutes) * 60 + parseFloat(seconds), text };
});

// Display all the lyrics
lyrics.innerHTML = parsedLyrics.map((line, index) => `
  <div id="line-${index}" class="lyric-line">${line.text}</div>
`).join('');

audio.addEventListener('timeupdate', () => {
  const currentTime = audio.currentTime;
  const currentLineIndex = parsedLyrics.findIndex((line, index) => {
    const nextLine = parsedLyrics[index + 1];
    return currentTime >= line.time && (!nextLine || currentTime < nextLine.time);
  });

  if (currentLineIndex !== -1) {
    const currentLine = document.querySelector('.current-line');
    if (currentLine) {
      currentLine.classList.remove('current-line');
    }
    const newCurrentLine = document.getElementById(`line-${currentLineIndex}`);
    if (newCurrentLine) {
      newCurrentLine.classList.add('current-line');
      // Scroll to the current line
      newCurrentLine.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
});

let mediaRecorder;
let recordedChunks = [];

recordButton.addEventListener('click', async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable = event => {
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };

  mediaRecorder.onstop = () => {
    const blob = new Blob(recordedChunks, { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'recording.wav';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
  };

  mediaRecorder.start();
  recordButton.disabled = true;
  stopButton.disabled = false;
});

stopButton.addEventListener('click', () => {
  mediaRecorder.stop();
  recordButton.disabled = false;
  stopButton.disabled = true;
});
