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
    
      if (id === 'captchaTwelve') {
        startWebcam();
      }
    }
      else {
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
    orb.innerText = 'other human';
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
    showQuestion('captchaOneInsert');
  });

  document.getElementById('nextOneInsertBtn').addEventListener('click', () => {
    if (!selectedImageLineFirst) {
      alert("Please select an image.");
      return;
    }
    poemLines[7] = selectedImageLineFirst;
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
    showQuestion('captchaSixInsert'); 
  });

  document.getElementById('nextSixInsertBtn').addEventListener('click', () => {
    if (!selectedImageLineFirst) {
      alert("Please select an image.");
      return;
    }
    poemLines[8] = selectedImageLineFirst;
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
    showQuestion('captchaSevenInsert');
    
  });

  document.getElementById('nextSevenInsertBtn').addEventListener('click', () => {
    
    showQuestion('captchaSevenInsert2');
  });

  window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('nextSevenInsertBtn2').addEventListener('click', () => {
      const inputElem = document.getElementById('question7Input');
      
      if (!inputElem) {
        console.error("question7Input not found in the DOM");
        return;
      }
  
      const input = inputElem.value.trim();
  
      if (!input) {
        alert("Please describe your first kiss before continuing.");
        return;
      }
  
      poemLines[6] = input;
      showQuestion('captchaEight');
    });
  });


  const nextEightBtn = document.getElementById('nextEightBtn');
if (nextEightBtn) {
  nextEightBtn.addEventListener('click', () => {
    showQuestion('captchaNine');
  });
}


window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('nextNineBtn').addEventListener('click', () => {
    const inputElem = document.getElementById('question9Input');
    
    if (!inputElem) {
      console.error("question7Input not found in the DOM");
      return;
    }

    const input = inputElem.value.trim();

    if (!input) {
      alert("Please describe your first kiss before continuing.");
      return;
    }

    poemLines[9] = input;
    showQuestion('captchaTen');
  });
});

document.querySelectorAll('#captchaTen .captchaTenSlider').forEach(slider => {
  slider.addEventListener('input', () => {
    const targetId = slider.getAttribute('data-target');
    const image = document.getElementById(targetId);
    const scale = slider.value / 100;

    // Horizontal stretch
    image.style.transform = `scaleX(${scale})`;
  });
});

document.getElementById('nextTenBtn').addEventListener('click', () => {
    
  showQuestion('captchaEleven');
});

document.getElementById('nextElevenBtn').addEventListener('click', () => {
  if (!selectedImageLineFirst) {
    alert("Please select an image.");
    return;
  }
  poemLines[10] = selectedImageLineFirst;
  showQuestion('captchaTwelve');
});

document.getElementById('nextTwelveBtn').addEventListener('click', () => {
    
  showQuestion('captchaThirteen');
  document.querySelector('.room').style.display = 'none';
  document.body.style.backgroundColor = 'black';

});

document.getElementById('nextThirteenBtn').addEventListener('click', () => {
  const selected = document.querySelector('input[name="question7"]:checked');
  if (!selected) {
    alert("Please select an answer for Question 4.");
    return;
  }
  poemLines[11] = selected.value;
  showQuestion('captchaFourteen'); 
});

document.getElementById('nextFourteenBtn').addEventListener('click', () => {
  const selected = document.querySelector('input[name="question8"]:checked');
  if (!selected) {
    alert("Please select an answer for Question 4.");
    return;
  }
  poemLines[12] = selected.value;
  showQuestion('captchaFifteen'); 
});

document.getElementById('nextFifteenBtn').addEventListener('click', () => {
    
  showQuestion('captchaSixteen');
});

document.getElementById('nextSixteenBtn').addEventListener('click', () => {
    
  showQuestion('captchaSeventeen');
});

document.getElementById('nextSeventeenBtn').addEventListener('click', () => {
  if (!selectedImageLineFirst) {
    alert("Please select an image.");
    return;
  }
  poemLines[13] = selectedImageLineFirst;
  showQuestion('captchaEighteen');
});

document.getElementById('nextEighteenBtn').addEventListener('click', () => {
  const selected = document.querySelector('input[name="question9"]:checked');
  if (!selected) {
    alert("Please select an answer for Question 4.");
    return;
  }
  poemLines[14] = selected.value;
  showQuestion('captchaNineteen'); 
});

document.getElementById('nextNineteenBtn').addEventListener('click', () => {
  const selected = document.querySelector('input[name="question10"]:checked');
  if (!selected) {
    alert("Please select an answer for Question 4.");
    return;
  }
  poemLines[15] = selected.value;
  showQuestion('captchaTwenty'); 
});

document.getElementById('nextTwentyBtn').addEventListener('click', () => {
  const selected = document.querySelector('input[name="question10"]:checked');
  if (!selected) {
    alert("Please select an answer for Question 4.");
    return;
  }
  poemLines[15] = selected.value;
  showQuestion('captchaTwenty'); 
});

document.getElementById('nextTwentyBtn').addEventListener('click', () => {
  if (!selectedImageLineFirst) {
    alert("Please select an image.");
    return;
  }
  poemLines[16] = selectedImageLineFirst;
  showQuestion('captchaSeven');
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
    poemLines[17] = selectedImageLineLast;
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
    { src: 'assets/images/bus/1.png', line: 'Everything starts at once.' },
    { src: 'assets/images/bus/1.png', line: 'Everything hits the wall.' },
    { src: 'assets/images/bus/1.png', line: 'You are tired.' },
    { src: 'assets/images/bus/1.png', line: 'You watch unknowingly.' },
    { src: 'assets/images/bus/1.png', line: 'Some things must not be remembered.' },
    { src: 'assets/images/bus/1.png', line: 'Everything eats itself.' },
    { src: 'assets/images/bus/1.png', line: 'Computers sleep too.' },
    { src: 'assets/images/bus/1.png', line: 'Computers talk to you often.' },
    { src: 'assets/images/bus/1.png', line: 'Everything needs a heart.' }
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
    { src: 'assets/images/bus/1.png', line: 'HEAVY ETERNAL.' },
    { src: 'assets/images/bus/1.png', line: 'PINK DOMINO.' },
    { src: 'assets/images/bus/1.png', line: 'FLYING DIXIE.' },
    { src: 'assets/images/bus/1.png', line: 'ETERNAL SIREN.' },
    { src: 'assets/images/bus/1.png', line: 'KOSMETIKA.' },
    { src: 'assets/images/bus/1.png', line: 'CANDY GIRL.' },
    { src: 'assets/images/bus/1.png', line: 'CITY GIRL.' },
    { src: 'assets/images/bus/1.png', line: 'CANDY APPLE.' },
    { src: 'assets/images/bus/1.png', line: 'HALO SUNSHINE.' }
  ];
  const gridTwo = document.getElementById('imageGrid');
  imageOptionsSecond.forEach(option => {
    const img = document.createElement('img');
    img.src = option.src;
    img.setAttribute('data-line', option.line);
    img.addEventListener('click', handleImageClickLast);
    gridTwo.appendChild(img);
  });

   // Second grid :D
   const imageOptionsThird = [
    { src: 'assets/images/flower/1.png', line: 'CANDLE STAR.' },
    { src: 'assets/images/flower/7.png', line: 'RUNAWAY BRIDE.' },
    { src: 'assets/images/flower/3.png', line: 'GOOD MANNERS.' },
    { src: 'assets/images/flower/4.png', line: 'HAIL TO REASON.' },
    { src: 'assets/images/flower/8.png', line: 'BLUSHING GROOM.' },
    { src: 'assets/images/flower/6.png', line: 'CANDY STRIPES.' },
    { src: 'assets/images/flower/5.png', line: 'WILD RISK.' },
    { src: 'assets/images/flower/9.png', line: 'NORTHERN DANCER.' },
    { src: 'assets/images/flower/2.png', line: 'COSMIC BOMB.' }
  ];
  const gridThree = document.getElementById('imageGridThree');
  imageOptionsThird.forEach(option => {
    const img = document.createElement('img');
    img.src = option.src;
    img.setAttribute('data-line', option.line);
    img.addEventListener('click', handleImageClickLast);
    gridThree.appendChild(img);
  });

  const imageOptionsFour = [
    { src: 'assets/images/love/4.png', line: 'A computer loves you.' },
    { src: 'assets/images/love/2.png', line: 'A computer loves you.' },
    { src: 'assets/images/love/3.png', line: 'A computer loves you.' },
    { src: 'assets/images/love/5.png', line: 'A computer loves you.' },
    { src: 'assets/images/love/6.png', line: 'A computer loves you.' },
    { src: 'assets/images/love/7.png', line: 'A computer loves you.' },
    { src: 'assets/images/love/8.png', line: 'A computer loves you.' },
    { src: 'assets/images/love/9.png', line: 'A computer loves you.' },
    { src: 'assets/images/love/22.png', line: 'A computer loves you.' }
  ];
  const gridFour = document.getElementById('imageGridFour');
  imageOptionsFour.forEach(option => {
    const img = document.createElement('img');
    img.src = option.src;
    img.setAttribute('data-line', option.line);
    img.addEventListener('click', handleImageClickLast);
    gridFour.appendChild(img);
  });

  const imageOptionsFive = [
    { src: 'assets/images/blob/15.png', line: 'EVERYTHING IS ROYAL CHARGER.' },
    { src: 'assets/images/blob/16.png', line: 'EVERYTHING IS SPRING RISK.' },
    { src: 'assets/images/blob/17.png', line: 'EVERYTHING IS FUN HOUSE.' },
    { src: 'assets/images/blob/18.png', line: 'EVERYTHING IS WILD VIOLET.' },
    { src: 'assets/images/blob/19.png', line: 'EVERYTHING IS POETS STAR.' },
    { src: 'assets/images/blob/20.png', line: 'EVERYTHING IS SATIETY.' },
    { src: 'assets/images/blob/21.png', line: 'EVERYTHING IS VAIN DUCHESS.' },
    { src: 'assets/images/blob/22.png', line: 'EVERYTHING IS LUST APPLE.' },
    { src: 'assets/images/blob/23.png', line: 'EVERYTHING IS ROYAL LIGHT.' }
  ];
  const gridFive = document.getElementById('imageGridFive');
  imageOptionsFive.forEach(option => {
    const img = document.createElement('img');
    img.src = option.src;
    img.setAttribute('data-line', option.line);
    img.addEventListener('click', handleImageClickLast);
    gridFive.appendChild(img);
  });

  const imageOptionsSix = [
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
  const gridSix = document.getElementById('imageGridSix');
  imageOptionsSix.forEach(option => {
    const img = document.createElement('img');
    img.src = option.src;
    img.setAttribute('data-line', option.line);
    img.addEventListener('click', handleImageClickLast);
    gridSix.appendChild(img);
  });

  const imageOptionsSeven = [
    { src: 'assets/images/computer/10.png', line: 'A computer loves you.' },
    { src: 'assets/images/dream/1.png', line: 'A computer loves you.' },
    { src: 'assets/images/love/6.png', line: 'A computer loves you.' },
    { src: 'assets/images/computer/13.png', line: 'A computer loves you.' },
    { src: 'assets/images/flower/8.png', line: 'A computer loves you.' },
    { src: 'assets/images/kiss/12.png', line: 'A computer loves you.' },
    { src: 'assets/images/dream/3.png', line: 'A computer loves you.' },
    { src: 'assets/images/kiss/14.png', line: 'A computer loves you.' },
    { src: 'assets/images/computer/18.png', line: 'A computer loves you.' }
  ];
  const gridSeven = document.getElementById('imageGridSeven');
  imageOptionsSeven.forEach(option => {
    const img = document.createElement('img');
    img.src = option.src;
    img.setAttribute('data-line', option.line);
    img.addEventListener('click', handleImageClickLast);
    gridSeven.appendChild(img);
  });

  class FlashingImage {
    constructor(element, imageList, interval = 1500) {
      this.element = element;
      this.images = imageList;
      this.interval = interval;
      this.currentIndex = 0;
      this.start();
    }
  
    start() {
      this.updateImage();
      this.timer = setInterval(() => this.updateImage(), this.interval);
    }
  
    updateImage() {
      this.element.style.backgroundImage = `url('${this.images[this.currentIndex]}')`;
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }
  }
  
  // Initialize all flashingImage blocks
  document.querySelectorAll('.flashingImage').forEach(div => {
    const images = JSON.parse(div.getAttribute('data-images'));
    new FlashingImage(div, images);
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

  async function startWebcam() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.getElementById('webcamFeed');
      video.srcObject = stream;
    } catch (err) {
      console.error("Webcam access denied:", err);
      alert("Could not access webcam. Please allow camera access.");
    }
  }


  document.getElementById("info").addEventListener("click", function () {
    const infoDisplay = document.getElementById("infoDisplay");
    if (infoDisplay.style.display === "block") {
      infoDisplay.style.display = "none";
    } else {
      infoDisplay.style.display = "block";
    }
  });
  

  document.getElementById("closeInfo").addEventListener("click", function () {
    document.getElementById("infoDisplay").style.display = "none";
  });