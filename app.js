let players = [];
let currentQuestionIndex = 0;
let currentPlayerIndex = 0;
let selectedMode = 'all';
let filteredQuestions = [];
let gameRoundCounter = 1;

const setupScreen = document.getElementById('setup-screen');
const gameScreen = document.getElementById('game-screen');
const playersList = document.getElementById('players-list');
const addPlayerBtn = document.getElementById('add-player-btn');
const startGameBtn = document.getElementById('start-game-btn');
const backBtn = document.getElementById('back-btn');
const themeToggle = document.getElementById('theme-toggle');
const currentPlayerName = document.getElementById('current-player-name');
const questionCard = document.getElementById('question-card');
const cardCategory = document.getElementById('card-category');
const questionText = document.getElementById('question-text');
const nextBtn = document.getElementById('next-btn');
const skipBtn = document.getElementById('skip-btn');
const modeButtons = document.querySelectorAll('.mode-btn');
const scoreDisplay = document.getElementById('score-display');

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    themeToggle.innerHTML = isLight ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
});

modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        modeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedMode = btn.getAttribute('data-mode');
    });
});

addPlayerBtn.addEventListener('click', () => {
    const playerGroups = document.querySelectorAll('.player-input-group');
    const newPlayerNumber = playerGroups.length + 1;
    
    const newInputGroup = document.createElement('div');
    newInputGroup.classList.add('player-input-group');
    newInputGroup.innerHTML = `<input type="text" class="player-input" placeholder="اسم اللاعب ${newPlayerNumber}...">`;
    playersList.appendChild(newInputGroup);
    playersList.scrollTop = playersList.scrollHeight;
});

// 🚀 الدالة المحدثة والآمنة لزر ابدأ التحدي
startGameBtn.addEventListener('click', () => {
    try {
        players = [];
        const inputs = document.querySelectorAll('.player-input');
        
        inputs.forEach(input => {
            const name = input.value.trim();
            if (name !== "") players.push(name);
        });

        if (players.length < 2) {
            players = ["لاعب 1", "لاعب 2"];
        }

        // 🛡️ فحص أمان: التحقق من وجود مصفوفة الأسئلة لتجنب توقف الزر
        if (typeof questions === 'undefined' || !Array.isArray(questions)) {
            alert("خطأ: لم يتم تحميل ملف الأسئلة بالشكل الصحيح! تأكد من تسمية المصفوفة في ملف questions.js باسم questions");
            return;
        }

        if (selectedMode === 'all') {
            filteredQuestions = [...questions];
        } else {
            filteredQuestions = questions.filter(q => q.category === selectedMode);
        }

        if (filteredQuestions.length === 0) {
            alert("تنبيه: هذه الفئة لا تحتوي على أسئلة حالياً، سيتم عرض فئة الكل تلقائياً.");
            filteredQuestions = [...questions];
        }

        filteredQuestions.sort(() => Math.random() - 0.5);

        currentQuestionIndex = 0;
        currentPlayerIndex = 0;
        gameRoundCounter = 1;

        setupScreen.classList.remove('active');
        gameScreen.classList.add('active');

        showNextQuestion();
    } catch (error) {
        console.error("حدث خطأ أثناء تشغيل اللعبة:", error);
        alert("عذراً، حدث خطأ داخلي. يرجى مراجعة وحدة تحكم المتصفح (Console) لمعرفة التفاصيل.");
    }
});

backBtn.addEventListener('click', () => {
    gameScreen.classList.remove('active');
    setupScreen.classList.add('active');
    questionText.innerText = "اضغط على التالي لسحب الموقف الأول!";
    cardCategory.innerText = "لو.. 🤔";
    scoreDisplay.innerText = "الموقف الحالي";
});

function showNextQuestion() {
    if (filteredQuestions.length === 0) return;

    if (currentQuestionIndex >= filteredQuestions.length) {
        filteredQuestions.sort(() => Math.random() - 0.5);
        currentQuestionIndex = 0;
    }

    if (scoreDisplay) {
        scoreDisplay.innerText = `الموقف الحالي: ${gameRoundCounter}`;
    }

    const player = players[currentPlayerIndex];
    currentPlayerName.innerText = player;

    const currentQuestion = filteredQuestions[currentQuestionIndex];
    questionText.innerText = currentQuestion.text;

    let categoryName = "عام 💥";
    if (currentQuestion.category === 'tech') categoryName = "تكنولوجيا 📱";
    if (currentQuestion.category === 'social') categoryName = "اجتماعي 🤐";
    if (currentQuestion.category === 'scandal') categoryName = "فضائح 🤦‍♂️";
    if (currentQuestion.category === 'scifi') categoryName = "خيال علمي 🧙‍♂️";
    if (currentQuestion.category === 'survival') categoryName = "بقاء 🪵";
    cardCategory.innerText = categoryName;

    questionCard.classList.remove('card-bounce');
    void questionCard.offsetWidth; 
    questionCard.classList.add('card-bounce');

    currentQuestionIndex++;
    gameRoundCounter++;
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
}

nextBtn.addEventListener('click', showNextQuestion);

skipBtn.addEventListener('click', () => {
    const punishments = [
        "اشرب كوباية مية كاملة بـ بوق واحد وبدون نفس!",
        "سيب الشخص اللي على يمينك يضربك قفا خفيف أو يحكم عليك!",
        "اغسل وشك بمية ساقعة حالا وارجع كمل الجيم!",
        "أقعد على الأرض دقيقتين ومفتفتحش بوقك بكلمة!",
        "قول نكتة بايخة تضحك القعدة كلها وإلا هتتعاقب تاني!"
    ];
    const randomPunishment = punishments[Math.floor(Math.random() * punishments.length)];
    
    cardCategory.innerText = "🚨 عِقَاب الِانْسِحَاب!";
    questionText.innerHTML = `<span style="color: #ff007f; font-weight: 900;">عقابك:</span> ${randomPunishment}`;
});
