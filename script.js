const firebaseConfig = {
    apiKey: "AIzaSyDbglbTE2gEHdqC5xEcHV2meVBKEch9xDg",
    authDomain: "hope-9dc1a.firebaseapp.com",
    databaseURL: "https://hope-9dc1a-default-rtdb.firebaseio.com",
    projectId: "hope-9dc1a",
    storageBucket: "hope-9dc1a.appspot.com"
  };
  firebase.initializeApp(firebaseConfig);
  const db = firebase.database();

  // ─── Global State ────────────────────────────────────────────────────────────
  let poemLines = [];               // Will hold exactly 5 lines
  let selectedImageLineFirst = "";  // For #captchaOne (imageGridTwo)
  let selectedImageLineLast = "";   // For #captchaFive (imageGrid)

  // ─── Utility Functions ──────────────────────────────────────────────────────
  
  function showQuestion(id) {
    console.log("🔍 showQuestion called with:", id);
    document.querySelectorAll('.captcha-question').forEach(div => {
      if (div.id === id) {
        console.log("   → Setting", div.id, "to block");
        div.style.display = 'block';
      } else {
        console.log("   → Setting", div.id, "to none");
        div.style.display = 'none';
      }
    });
  }
  

  function togglePoemDisplay(show) {
    document.getElementById('poemDisplay').style.display = show ? 'block' : 'none';
  }

  function toggleRestartButton(show) {
    document.getElementById('restartBtn').style.display = show ? 'inline-block' : 'none';
  }

  function resetSelections() {
    poemLines = [];
    selectedImageLineFirst = "";
    selectedImageLineLast = "";
    // Clear all radio selections
    document.querySelectorAll('input[type="radio"]').forEach(input => input.checked = false);
    // Clear all selected states in both image grids
    document.querySelectorAll('.image-grid img').forEach(img => img.classList.remove('selected'));
    // Reset slider to middle (50) and ellipse size
    document.getElementById('loveSlider').value = 50;
    updateEllipseSize(50);
  }

  function displayPoem(text) {
    document.getElementById('poemText').innerText = text;
  }

  function randomPosition(maxWidth, maxHeight) {
    return {
      x: Math.random() * (maxWidth - 100),
      y: Math.random() * (maxHeight - 50)
    };
  }

  function createOrb(poemText) {
    const orb = document.createElement('div');
    orb.className = 'poemOrb';
    // Show only the first sentence/fragment
    orb.innerText = 'other user';
    const container = document.getElementById('orbsContainer');
    const pos = randomPosition(container.clientWidth, container.clientHeight);
    orb.style.left = `${pos.x}px`;
    orb.style.top = `${pos.y}px`;
    orb.addEventListener('click', () => displayPoem(poemText));
    container.appendChild(orb);
  }

  function loadAndDisplayAllPoems() {
    const container = document.getElementById('orbsContainer');
    container.innerHTML = '';
    db.ref('poems').orderByChild('timestamp').once('value').then(snapshot => {
      const poems = snapshot.val();
      if (poems) {
        Object.values(poems).forEach(entry => createOrb(entry.poem));
      }
    });
  }

  function savePoem(poem) {
    const newRef = db.ref('poems').push();
    return newRef.set({ poem, timestamp: Date.now() });
  }

  // ─── Question 1: First Image Grid (#captchaOne → imageGridTwo) ───────────────
  function handleImageClickFirst(e) {
    document.querySelectorAll('#imageGridTwo img').forEach(img => img.classList.remove('selected'));
    e.target.classList.add('selected');
    selectedImageLineFirst = e.target.getAttribute('data-line');
  }
  document.getElementById('nextOneBtn').addEventListener('click', () => {
    if (!selectedImageLineFirst) {
      alert("Please select an image.");
      return;
    }
    poemLines[0] = selectedImageLineFirst;
    showQuestion('captchaTwo');
  });

  // ─── Question 2: Radio Buttons (#captchaTwo → question1 → poemLines[1]) ────
  document.getElementById('nextTwoBtn').addEventListener('click', () => {
    const selected = document.querySelector('input[name="question1"]:checked');
    if (!selected) {
      alert("Please select an answer.");
      return;
    }
    poemLines[1] = selected.value;
    showQuestion('captchaThree');
  });

  // ─── Question 3: Radio Buttons (#captchaThree → question2 → poemLines[2]) ──
  document.getElementById('nextThreeBtn').addEventListener('click', () => {
    const selected = document.querySelector('input[name="question2"]:checked');
    if (!selected) {
      alert("Please select an answer.");
      return;
    }
    poemLines[2] = selected.value;
    showQuestion('captchaFour');
    document.querySelector('.room').style.display = 'block';
  });

  // ─── Q4: Radio (#captchaFour / name="question3" → poemLines[3]) ─────────────
document.getElementById('nextFourBtn').addEventListener('click', () => {
    const selected = document.querySelector('input[name="question3"]:checked');
    if (!selected) {
      alert("Please select an answer for Question 4.");
      return;
    }
    poemLines[3] = selected.value;
    showQuestion('captchaFive');  // show the slider (Q5)
  });
  
  // ─── Q5: Slider (#captchaFive → loveSlider → poemLines[4]) ───────────────────
  document.getElementById('loveSlider').addEventListener('input', function () {
    updateEllipseSize(this.value);
  });
  document.getElementById('nextFiveBtn').addEventListener('click', () => {
    const loveValue = +document.getElementById('loveSlider').value;
    let line = "";
    if (loveValue < 30) {
      line = "A heart that yearns for warmth.";
    } else if (loveValue < 70) {
      line = "A comfortable feeling passes.";
    } else {
      line = "A full cup spills onto the floor.";
    }
    poemLines[4] = line;
    console.log("💥 nextFiveBtn clicked");
    showQuestion('captchaSix'); // advance to Q6 (your next radio or image grid)
  });

  
  
 

  function updateEllipseSize(value) {
    const ellipse = document.getElementById('loveEllipse');
    const size = 50 + (value * 1.5);
    ellipse.style.width = `${size}px`;
    ellipse.style.height = `${size}px`;
  }

  document.getElementById('nextSixBtn').addEventListener('click', () => {
    const selected = document.querySelector('input[name="question6"]:checked');
    if (!selected) {
      alert("Please select an answer for Question 6.");
      return;
    }
    // Store the Q6 response:
    poemLines[5] = selected.value;
  
    // Now advance to the defined #captchaSeven
    showQuestion('captchaSeven');
    document.querySelector('.room').style.display = 'none';
  });
  // ─── Question 5: Second Image Grid (#captchaFive → imageGrid → poemLines[4]) ─
  function handleImageClickLast(e) {
    document.querySelectorAll('#imageGrid img').forEach(img => img.classList.remove('selected'));
    e.target.classList.add('selected');
    selectedImageLineLast = e.target.getAttribute('data-line');
  }
  document.getElementById('finishBtn').addEventListener('click', () => {
    if (!selectedImageLineLast) {
      alert("Please select an image.");
      return;
    }
    poemLines[6] = selectedImageLineLast;
    const finalPoem = poemLines.join(" ");
    savePoem(finalPoem).then(() => {
      displayPoem(finalPoem);
      togglePoemDisplay(true);
      loadAndDisplayAllPoems();
      toggleRestartButton(true);
      showQuestion(null);
    });
    document.getElementById('start').style.display = 'none';
    document.getElementById('questions').style.display = 'none';
  });

  // ─── Restart Handler ─────────────────────────────────────────────────────────
  document.getElementById('restartBtn').addEventListener('click', () => {
    resetSelections();
    togglePoemDisplay(false);
    toggleRestartButton(false);
    showQuestion('captchaOne');
  });

  // ─── Populate Both Image Grids ───────────────────────────────────────────────
  // First grid (#imageGridTwo in CaptchaOne)
  const imageOptionsFirst = [
    { src: 'assets/images/start/flower.png', line: 'A whisper curled through soft fur.' },
    { src: 'assets/images/start/flower.png', line: 'A silent gaze held timeless mystery.' },
    { src: 'assets/images/start/flower.png', line: 'Paws padded over dreams.' },
    { src: 'assets/images/start/flower.png', line: 'Eyes mirrored moonlight.' },
    { src: 'assets/images/start/flower.png', line: 'Stillness broke into purring light.' },
    { src: 'assets/images/start/flower.png', line: 'Curiosity danced between shadows.' },
    { src: 'assets/images/start/flower.png', line: 'Tail traced lines of wonder.' },
    { src: 'assets/images/start/flower.png', line: 'A stretch yawned into eternity.' },
    { src: 'assets/images/start/flower.png', line: 'Feline steps etched fleeting magic.' }
  ];
  const gridOne = document.getElementById('imageGridTwo');
  imageOptionsFirst.forEach(option => {
    const img = document.createElement('img');
    img.src = option.src;
    img.setAttribute('data-line', option.line);
    img.addEventListener('click', handleImageClickFirst);
    gridOne.appendChild(img);
  });

  // Second grid (#imageGrid in CaptchaFive)
  const imageOptionsSecond = [
    { src: 'assets/images/start/flower.png', line: 'Morning light in whispered hues.' },
    { src: 'assets/images/start/flower.png', line: 'Shadows weaving silent tales.' },
    { src: 'assets/images/start/flower.png', line: 'Breezes carry distant dreams.' },
    { src: 'assets/images/start/flower.png', line: 'Stars blink with knowing eyes.' },
    { src: 'assets/images/start/flower.png', line: 'Raindrops hum forgotten songs.' },
    { src: 'assets/images/start/flower.png', line: 'Leaves dance in soft embrace.' },
    { src: 'assets/images/start/flower.png', line: 'Echoes drift through hollow halls.' },
    { src: 'assets/images/start/flower.png', line: 'Footsteps fade beneath the moon.' },
    { src: 'assets/images/start/flower.png', line: 'Whispers curl around the flame.' }
  ];
  const gridTwo = document.getElementById('imageGrid');
  imageOptionsSecond.forEach(option => {
    const img = document.createElement('img');
    img.src = option.src;
    img.setAttribute('data-line', option.line);
    img.addEventListener('click', handleImageClickLast);
    gridTwo.appendChild(img);
  });

  // ─── Initial Setup ──────────────────────────────────────────────────────────
  togglePoemDisplay(false);
  toggleRestartButton(false);
  showQuestion('captchaOne');
  loadAndDisplayAllPoems();

  document.querySelector('.start').addEventListener('click', function () {
    this.style.backgroundImage = "url('assets/images/start/load.gif')"; // Replace with your image path
    this.style.border = "none";
    this.style.backgroundSize = "contain";
    this.style.repeat = "no-repeat";

    setTimeout(function () {
        document.querySelector('.questions').style.display = 'block';
      }, 3000);

  });