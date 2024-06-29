const audio = document.getElementById('audio');
const lyrics = document.getElementById('lyrics');
const recordButton = document.getElementById('record');
const stopButton = document.getElementById('stop');

const lyricsText = `
  [00:00] ..... Music .....
  [00:32] Ho Janam Janam Ki Khoj Bataye
  [00:39] Ram Se Chalke Ram Pe Aaye
  [00:45] Prem Koyi Hum Aur Na Jaane
  [00:50] Ram Se Roothe Ram Se Maane
  [00:56] Ram Siya Ki Karun Kahaani
  [01:04] Ek Hai Chandan Ek Hai Paani
  [01:10] Ram Siya Ram Siya Ram Jai Jai Ram
  [01:34] ..... Music .....
  [02:00] Hari Anant Hari Katha Ananta
  [02:06] Kahahin Sunahi Bahuvidhi Sab Santa
  [02:12] Ram Ratan Dhan Jo Koyi Paaye
  [02:18] Jeevan Bhar Ramayan Gaye
  [02:23] Mangal Bhavan Amangal Haari 
  [02:32] Drabahu Sudasarath Ajar Bihari 
  [02:38] Ram Siya Ram Siya Ram Jai Jai Ram
  [03:01] ..... Music ..... 
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
