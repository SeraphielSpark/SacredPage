const deck1  = document.getElementById('deck1');
const deck2 = document.getElementById('deck2');
     
const audioDeck1 = document.getElementById('audioDeck1');
const audioDeck2 = document.getElementById('audioDeck2');    
const fileInput = document.getElementById('file-input');
const musicList = document.getElementById('music-list');
const audioPlayer = document.getElementById('audio-player');

// Supported audio formats
const allowedFormats = ['audio/mpeg', 'audio/webm', 'audio/ogg', 'audio/wav'];

fileInput.addEventListener('change', () => {
  const files = fileInput.files;

  // Clear the music list
  musicList.innerHTML = '';

  Array.from(files).forEach((file) => {
    // Check if the file is a supported audio format
    if (allowedFormats.includes(file.type)) {
      // Create a button for each audio file
      const button = document.createElement('button');
      button.textContent = file.name;
      button.draggable = true;

      // Set drag data
      button.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('audio-file', URL.createObjectURL(file));
        event.dataTransfer.setData('file-name', file.name);
      });

      const makeDeckDroppable = (deckElement, audioElement) => {
        deckElement.addEventListener('dragover', (event) => {
          event.preventDefault();
          deckElement.classList.add('highlight');
        });
        
        deckElement.addEventListener('dragleave', () => {
          deckElement.classList.remove('highlight');
        });

        deckElement.addEventListener('drop', (event) => {
          event.preventDefault();
          deckElement.classList.remove('highlight');

          const audioFile = event.dataTransfer.getData('audio-file');
          const fileName = event.dataTransfer.getData('file-name');

          if (audioFile) {
            // Pause any currently playing audio
            audioElement.pause();
            audioElement.src = audioFile;
            audioElement.play();

            // Update deck label
            deckElement.querySelector('h3').textContent = `Now Playing: ${fileName}`;
          }
        });
      };

      // Make both decks droppable
      makeDeckDroppable(deck1, audioDeck1);
      makeDeckDroppable(deck2, audioDeck2);

      button.addEventListener('click', () => {
        // Create a Blob URL and set it as the audio source
        const blobUrl = URL.createObjectURL(file);
        console.log(blobUrl);
        audioPlayer.src = blobUrl;
        audioPlayer.play();

        // Revoke the object URL after playing
        audioPlayer.addEventListener('ended', () => {
          URL.revokeObjectURL(blobUrl);
        });
      });

      musicList.appendChild(button);
    } else {
      console.warn(`Skipped unsupported file: ${file.name}`);
    }
  });
});
