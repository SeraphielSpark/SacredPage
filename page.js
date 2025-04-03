// Rhyming Text for Typewriter Effect
const texts = [
    "Unveil the secrets of divine grace.",
    "Discover your angel's loving embrace.",
    "Each name whispers a heavenly sound.",
    "Let your soul in peace be crowned."
];

let currentIndex = 0;

function typeText() {
    const textElement = document.getElementById('typewriter-text');
    textElement.innerHTML = ""; // Clear previous text
    let i = 0;

    function type() {
        if (i < texts[currentIndex].length) {
            textElement.innerHTML += texts[currentIndex].charAt(i);
            i++;
            setTimeout(type, 100); // Typing speed
        } else {
            setTimeout(() => {
                currentIndex = (currentIndex + 1) % texts.length; // Move to next text
                typeText();
            }, 3000); // Pause before next text
        }
    }

    type();
}
const main = document.getElementById("main");
const button = document.getElementById('button2');
button.addEventListener('click', function(){
    setInterval(moveProgressBar, 50);
    
    document.getElementById('overlay').style.display ='flex'; 
})

// Start typing on load
window.onload = typeText;
