const firebaseConfig = {
    apiKey: "AIzaSyDbglbTE2gEHdqC5xEcHV2meVBKEch9xDg",
    authDomain: "hope-9dc1a.firebaseapp.com",
    databaseURL: "https://hope-9dc1a-default-rtdb.firebaseio.com",
    projectId: "hope-9dc1a",
    storageBucket: "hope-9dc1a.appspot.com"
  };
  firebase.initializeApp(firebaseConfig);
  const db = firebase.database();

  
  let poemLines = [];               
  let selectedImageLineFirst = "";  
  let selectedImageLineLast = "";   

  
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
 
    document.querySelectorAll('input[type="radio"]').forEach(input => input.checked = false);
   
    document.querySelectorAll('.image-grid img').forEach(img => img.classList.remove('selected'));
    
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

  // ─── Q1 ───────────────
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

  // ─── Q2 ────
  document.getElementById('nextTwoBtn').addEventListener('click', () => {
    const selected = document.querySelector('input[name="question1"]:checked');
    if (!selected) {
      alert("Please select an answer.");
      return;
    }
    poemLines[1] = selected.value;
    showQuestion('captchaThree');
  });

  // ─── Q3 ──
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

  // ─── Q4 ─────────────
document.getElementById('nextFourBtn').addEventListener('click', () => {
    const selected = document.querySelector('input[name="question3"]:checked');
    if (!selected) {
      alert("Please select an answer for Question 4.");
      return;
    }
    poemLines[3] = selected.value;
    showQuestion('captchaFive'); 
  });
  
  // ─── Q5 ───────────────────
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
    console.log("💥 work girl");
    showQuestion('captchaSix'); 
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
    // Q6 response:
    poemLines[5] = selected.value;
  
    // Now advance to the defined #captchaSeven
    showQuestion('captchaSeven');
    document.querySelector('.room').style.display = 'none';
  });
  // ─── Q5  ─
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

  
  document.getElementById('restartBtn').addEventListener('click', () => {
    resetSelections();
    togglePoemDisplay(false);
    toggleRestartButton(false);
    showQuestion('captchaOne');
  });

  // Image Grids :P
  const imageOptionsFirst = [
    { src: 'assets/images/flower/1.png', line: 'Everything starts at once.' },
    { src: 'assets/images/flower/2.png', line: 'Everything hits the wall.' },
    { src: 'assets/images/flower/3.png', line: 'You are tired.' },
    { src: 'assets/images/flower/4.png', line: 'You watch unknowingly.' },
    { src: 'assets/images/flower/5.png', line: 'Some things must not be remembered.' },
    { src: 'assets/images/flower/6.png', line: 'Everything eats itself.' },
    { src: 'assets/images/flower/7.png', line: 'Computers sleep too.' },
    { src: 'assets/images/flower/8.png', line: 'Computers talk to you often.' },
    { src: 'assets/images/flower/9.png', line: 'Everything needs a heart.' }
  ];
  const gridOne = document.getElementById('imageGridTwo');
  imageOptionsFirst.forEach(option => {
    const img = document.createElement('img');
    img.src = option.src;
    img.setAttribute('data-line', option.line);
    img.addEventListener('click', handleImageClickFirst);
    gridOne.appendChild(img);
  });

  // Second grid :D
  const imageOptionsSecond = [
    { src: 'assets/images/computer/10.png', line: 'A computer loves you.' },
    { src: 'assets/images/computer/11.png', line: 'A computer loves you.' },
    { src: 'assets/images/computer/12.png', line: 'A computer loves you.' },
    { src: 'assets/images/computer/13.png', line: 'A computer loves you.' },
    { src: 'assets/images/computer/14.png', line: 'A computer loves you.' },
    { src: 'assets/images/computer/15.png', line: 'A computer loves you.' },
    { src: 'assets/images/computer/16.png', line: 'A computer loves you.' },
    { src: 'assets/images/computer/17.png', line: 'A computer loves you.' },
    { src: 'assets/images/computer/18.png', line: 'A computer loves you.' }
  ];
  const gridTwo = document.getElementById('imageGrid');
  imageOptionsSecond.forEach(option => {
    const img = document.createElement('img');
    img.src = option.src;
    img.setAttribute('data-line', option.line);
    img.addEventListener('click', handleImageClickLast);
    gridTwo.appendChild(img);
  });

  // setup wooo
  togglePoemDisplay(false);
  toggleRestartButton(false);
  showQuestion('captchaOne');
  loadAndDisplayAllPoems();

  document.querySelector('.start').addEventListener('click', function () {
    this.style.backgroundImage = "url('assets/images/start/load.gif')"; 
    this.style.border = "none";
    this.style.backgroundSize = "contain";
    this.style.repeat = "no-repeat";

    setTimeout(function () {
        document.querySelector('.questions').style.display = 'block';
      }, 3000);

  });