/* -------------------------------------------------------------
   Apology Website Core JavaScript
   ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const firstScreen = document.getElementById('first-screen');
    const clickMeBtn = document.getElementById('click-me-btn');
    const envelopeScreen = document.getElementById('envelope-screen');
    const envelopeWrapper = document.querySelector('.envelope-wrapper');
    const letterScreen = document.getElementById('letter-screen');
    const poemLines = document.querySelectorAll('.poem-line');
    const forgiveSection = document.querySelector('.forgive-section');
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const successScreen = document.getElementById('success-screen');
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    const heartBg = document.getElementById('heart-bg');

    let audioStarted = false;

    // Prepare poem lines by splitting into individual word spans
    const allWords = [];
    poemLines.forEach(line => {
        if (line.classList.contains('spacer-line')) {
            allWords.push({ type: 'spacer', element: line });
            return;
        }
        const text = line.innerText;
        line.innerHTML = ''; // clear text
        const words = text.split(' ');
        words.forEach((wordText, idx) => {
            const span = document.createElement('span');
            span.classList.add('poem-word');
            span.innerText = wordText;
            line.appendChild(span);
            if (idx < words.length - 1) {
                line.appendChild(document.createTextNode(' '));
            }
            allWords.push({ type: 'word', element: span });
        });
    });

    // 1. Generate Floating Hearts Background
    function createFloatingHeart() {
        const heartsList = ['❤️', '💖', '💕', '🌸', '💝', '🧸'];
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        heart.innerText = heartsList[Math.floor(Math.random() * heartsList.length)];
        
        // Randomize positioning & size
        heart.style.left = `${Math.random() * 100}vw`;
        heart.style.fontSize = `${Math.random() * 20 + 15}px`;
        
        // Randomize duration
        const duration = Math.random() * 3 + 4; // 4s to 7s
        heart.style.animationDuration = `${duration}s`;
        
        // Append & cleanup
        heartBg.appendChild(heart);
        setTimeout(() => {
            heart.remove();
        }, duration * 1000);
    }

    // Spawn hearts periodically
    setInterval(createFloatingHeart, 300);

    // 2. Play Music Helper
    function startMusic() {
        if (!audioStarted) {
            bgMusic.play()
                .then(() => {
                    audioStarted = true;
                    musicToggle.classList.add('playing');
                })
                .catch(err => {
                    console.log('Audio autoplay blocked or failed, waiting for user click:', err);
                });
        }
    }

    // Music control button toggle
    musicToggle.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            musicToggle.classList.add('playing');
        } else {
            bgMusic.pause();
            musicToggle.classList.remove('playing');
        }
    });

    // 3. Step 1 -> Step 2: Fade Out Intro and Show Envelope
    clickMeBtn.addEventListener('click', () => {
        startMusic();
        
        // Fade out transition
        firstScreen.style.opacity = '0';
        firstScreen.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            firstScreen.classList.add('hidden');
            envelopeScreen.classList.remove('hidden');
            envelopeScreen.style.opacity = '0';
            
            // Fade in envelope screen
            setTimeout(() => {
                envelopeScreen.style.opacity = '1';
                envelopeScreen.style.transition = 'opacity 0.5s ease';
            }, 50);
        }, 500);
    });

    // 4. Step 2 -> Step 3: Click Envelope to Open and Slide Out Letter
    envelopeWrapper.addEventListener('click', () => {
        envelopeWrapper.classList.add('open');
        
        // After envelope finishes opening animation, slide in the actual letter screen
        setTimeout(() => {
            envelopeScreen.style.opacity = '0';
            envelopeScreen.style.transform = 'scale(0.9)';
            envelopeScreen.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            setTimeout(() => {
                envelopeScreen.classList.add('hidden');
                letterScreen.classList.remove('hidden');
                letterScreen.style.opacity = '0';
                letterScreen.style.transform = 'translateY(50px)';
                
                // Fade in and slide up letter paper
                setTimeout(() => {
                    letterScreen.style.opacity = '1';
                    letterScreen.style.transform = 'translateY(0)';
                    letterScreen.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
                    
                    // Trigger letter writing/revealing effect
                    revealLetterLines();
                }, 50);
            }, 600);
        }, 1500); // Wait for open animation to display fully
    });

    // 5. Letter Typewriter / Word-by-Word Reveal
    function revealLetterLines() {
        let index = 0;
        
        function revealNext() {
            if (index < allWords.length) {
                const item = allWords[index];
                index++;
                
                if (item.type === 'spacer') {
                    // spacer line delay
                    setTimeout(revealNext, 250);
                } else {
                    item.element.classList.add('reveal');
                    
                    // Punctuation-aware typing timing
                    let delay = 200; // standard word spacing delay
                    const wordText = item.element.innerText;
                    if (wordText.endsWith(',') || wordText.endsWith('...')) {
                        delay = 550; // pause longer on commas or ellipses for natural flow
                    }
                    setTimeout(revealNext, delay);
                }
            } else {
                // Show the forgive me section (Yes/No buttons)
                setTimeout(() => {
                    forgiveSection.classList.add('show-element');
                }, 600);
            }
        }
        
        setTimeout(revealNext, 500);
    }

    // 6. Interactive "No" Button Dodging Logic
    function dodgeNoButton(e) {
        // Calculate safe random coordinates within screen limits
        const btnRect = noBtn.getBoundingClientRect();
        const padding = 40;
        
        // Switch to fixed position so we can move it anywhere on the viewport
        noBtn.style.position = 'fixed';
        noBtn.style.zIndex = '1000';
        
        let newX = Math.random() * (window.innerWidth - btnRect.width - padding * 2) + padding;
        let newY = Math.random() * (window.innerHeight - btnRect.height - padding * 2) + padding;
        
        // Prevent button from flying directly under the cursor / touch point
        let clientX = e.clientX;
        let clientY = e.clientY;
        
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }
        
        const dist = Math.hypot(newX + btnRect.width / 2 - clientX, newY + btnRect.height / 2 - clientY);
        
        if (dist < 100) {
            // Push it further away if too close
            newX = (newX + 150) % (window.innerWidth - btnRect.width - padding * 2);
            newY = (newY + 150) % (window.innerHeight - btnRect.height - padding * 2);
        }
        
        noBtn.style.left = `${newX}px`;
        noBtn.style.top = `${newY}px`;
    }

    // Trigger dodge on both desktop mouse hover and mobile touches
    noBtn.addEventListener('mouseenter', dodgeNoButton);
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevents default click behavior
        dodgeNoButton(e);
    });
    
    // Fallback click handler if they somehow bypass hover/touch
    noBtn.addEventListener('click', (e) => {
        e.preventDefault();
        dodgeNoButton(e);
    });

    // 7. Clicking "Yes" Confetti & Success Screen
    yesBtn.addEventListener('click', () => {
        // Continuous Confetti Shower for 4 seconds
        const duration = 4 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1100 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // Confetti bursts from random positions left/right
            confetti(Object.assign({}, defaults, { 
                particleCount, 
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } 
            }));
            confetti(Object.assign({}, defaults, { 
                particleCount, 
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } 
            }));
        }, 250);

        // Standard center blast immediately
        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            zIndex: 1100
        });

        // Transition to Success Screen
        letterScreen.style.opacity = '0';
        letterScreen.style.transform = 'scale(0.9)';
        letterScreen.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            letterScreen.classList.add('hidden');
            successScreen.classList.remove('hidden');
            successScreen.style.opacity = '0';
            successScreen.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                successScreen.style.opacity = '1';
                successScreen.style.transform = 'scale(1)';
                successScreen.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            }, 50);
        }, 600);
    });
});
