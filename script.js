document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const timeDisplay = document.getElementById('time');
    const pairsFoundDisplay = document.getElementById('pairs-found');
    const victoryMessage = document.getElementById('victory-message');
    const finalTimeDisplay = document.getElementById('final-time');
    
    const backgroundMusic = document.getElementById('background-music');
    const victorySound = document.getElementById('victory-sound');

    const icons = [
        '🍎', '🍊', '🍓', '🍇', '🍉', '🍍', '🍌', 
        './fcg.png' 
    ];
    let cardsArray = [...icons, ...icons];
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let pairsFound = 0;
    let startTime;
    let timerInterval;

    function shuffleCards() {
        cardsArray.sort(() => Math.random() - 0.5);
    }

    function createCards() {
        shuffleCards();
        gameBoard.innerHTML = '';
        cardsArray.forEach(item => { 
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.item = item; 

            const cardBack = document.createElement('div');
            cardBack.classList.add('card-face', 'card-back');

            const cardFront = document.createElement('div');
            cardFront.classList.add('card-face', 'card-front');
            
            
            if (item.startsWith('./') || item.startsWith('http')) { 
                const img = document.createElement('img');
                img.src = item;
                img.alt = 'card-image';
                img.style.width = '80%'; 
                img.style.height = '80%';
                img.style.objectFit = 'contain';
                cardFront.appendChild(img);
            } else { 
                cardFront.textContent = item;
            }

            card.appendChild(cardBack);
            card.appendChild(cardFront);

            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
        });
    }

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        this.classList.add('flip');

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        secondCard = this;
        checkForMatch();
    }

    function checkForMatch() {
        let isMatch = firstCard.dataset.item === secondCard.dataset.item; 
        isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        
        pairsFound++;
        pairsFoundDisplay.textContent = pairsFound;

        console.log('Pares encontrados:', pairsFound, 'Total necessário:', icons.length);

        resetBoard();
        
        if (pairsFound === icons.length) {
            endGame();
        }
    }

    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }
    
    function startTimer() {
        startTime = Date.now();
        timerInterval = setInterval(() => {
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            timeDisplay.textContent = elapsedTime;
        }, 1000);
    }

    function endGame() {
        clearInterval(timerInterval);
        const finalTime = timeDisplay.textContent;
        finalTimeDisplay.textContent = finalTime;
        victoryMessage.style.display = 'flex';
        
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
        victorySound.play();
    }

    function init() {
        createCards();
        startTimer();
        backgroundMusic.play();
    }

    init();
});