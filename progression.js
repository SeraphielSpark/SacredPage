const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
let progress = 0;

function moveProgressBar() {
    if (progress < 100) {
        progress++;
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `Loading The App, Progress: ${progress}% `;
    } else {
        
        progressText.textContent = "Loading Complete!";
        main.style.display = 'grid';
        document.getElementById('overlay').style.display= 'none'
        document.getElementById('div').style.display = 'none';
        clearInterval(interval); // Stop when it reaches 100%
    }
}

//const interval = setInterval(moveProgressBar, 450); // Adjust speed here
