let players = [];
let currentQuestionIndex = 0;
let currentPlayerIndex = 0;
let selectedMode = 'all';
let filteredQuestions = [];
let gameRoundCounter = 1; // عداد داخلي لحساب عدد المواقف التي تم لعبها

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
const scoreDisplay = document.getElementById('score-display'); // جلب عنصر عرض رقم الموقف الحالي

// 🌓 التحكم في الوضع الليلي المطور
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    // تبديل الأيقونات بشكل صحيح ليفهمها المستخدم فوراً
    themeToggle.innerHTML = isLight ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
});

// 🎭 اختيار فئة الأسئلة من القائمة
modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        modeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedMode = btn.getAttribute('data-mode');
    });
});

// ➕ إضافة لاعب جديد ديناميكياً مع تسمية صحيحة
addPlayerBtn.addEventListener('click', () => {
    const playerGroups = document.querySelectorAll('.player-input-group');
    const newPlayerNumber = playerGroups.length + 1;
    
    const newInputGroup = document.createElement('div');
    newInputGroup.classList.add('player-input-group');
    newInputGroup.innerHTML = `<input type="text" class="player-input" placeholder="اسم اللاعب ${newPlayerNumber}...">`;
    playersList.appendChild(newInputGroup);
    playersList.scrollTop = playersList.scrollHeight; // النزول التلقائي لأسفل القائمة عند الإضافة
});

// 🚀 بدء التحدي والفلترة العشوائية
startGameBtn.addEventListener('click', () => {
    players = [];
    const inputs = document.querySelectorAll('.player-input');
    
    inputs.forEach(input => {
        const name = input.value.trim();
        if (name !== "") players.push(name);
    });

    // إذا لم يكتب العميل أسماء، يتم تعيين لاعبين تلقائيين
    if (players.length < 2) {
        players = ["لاعب 1", "لاعب 2"];
    }

    // فلترة الأسئلة بناءً على الفئات الـ 5 المتاحة في ملف الـ HTML
    if (selectedMode === 'all') {
        filteredQuestions = [...questions];
    } else {
        filteredQuestions = questions.filter(q => q.category === selectedMode);
    }

    // إذا كانت الفئة المختارة فارغة تماماً في ملف الأسئلة، نمنع حدوث خطأ برمجي ونعرض كل الأسئلة كأمان لتعمل اللعبة دائماً
    if (filteredQuestions.length === 0) {
        filteredQuestions = [...questions];
    }

    // خلط ترتيب الأسئلة عشوائياً لضمان عدم التكرار والملل
    filteredQuestions.sort(() => Math.random() - 0.5);

    currentQuestionIndex = 0;
    currentPlayerIndex = 0;
    gameRoundCounter = 1; // إعادة تصفير عداد المواقف عند بدء جيم جديد

    // 🔒 [مستقبلاً: التحقق من تسجيل دخول المستخدم عبر Firebase قبل تشغيل شاشة الجيم]
    // if (!isFirebaseUserLoggedIn()) { alert("يرجى تسجيل الدخول أولاً!"); return; }

    setupScreen.classList.remove('active');
    gameScreen.classList.add('active');

    showNextQuestion();
});

// 🚪 زر الخروج للقائمة الرئيسية وإعادة ضبط الواجهة
backBtn.addEventListener('click', () => {
    gameScreen.classList.remove('active');
    setupScreen.classList.add('active');
    questionText.innerText = "اضغط على التالي لسحب الموقف الأول!";
    cardCategory.innerText = "لو.. 🤔";
    scoreDisplay.innerText = "الموقف الحالي";
});

// 🔄 دالة العرض اللانهائي وسحب المواقف الديناميكية
function showNextQuestion() {
    if (filteredQuestions.length === 0) return;

    // 🔗 [مستقبلاً: تحديث نقاط سكور اللاعب الحالي في قاعدة بيانات Firebase]
    // updatePlayerScoreInFirebase(players[currentPlayerIndex], 10);

    // 🔄 فكرة "إلى ما لا نهاية": إذا انتهت الأسئلة المفلترة، نخلطها مجدداً ونبدأ العداد من صفر تلقائياً
    if (currentQuestionIndex >= filteredQuestions.length) {
        filteredQuestions.sort(() => Math.random() - 0.5);
        currentQuestionIndex = 0;
    }

    // تحديث رقم الموقف الحالي في شاشة اللعب بطريقة تفاعلية واضحة للعملاء
    scoreDisplay.innerText = `الموقف الحالي: ${gameRoundCounter}`;

    const player = players[currentPlayerIndex];
    currentPlayerName.innerText = player;

    const currentQuestion = filteredQuestions[currentQuestionIndex];
    questionText.innerText = currentQuestion.text;

    // 🎭 تصنيف الفئات الـ 5 الجديدة بشكل دقيق وبأيقونات متناسقة مع الـ HTML
    let categoryName = "عام 💥";
    if (currentQuestion.category === 'tech') categoryName = "تكنولوجيا 📱";
    if (currentQuestion.category === 'social') categoryName = "اجتماعي 🤐";
    if (currentQuestion.category === 'scandal') categoryName = "فضائح 🤦‍♂️";
    if (currentQuestion.category === 'scifi') categoryName = "خيال علمي 🧙‍♂️";
    if (currentQuestion.category === 'survival') categoryName = "بقاء 🪵";
    cardCategory.innerText = categoryName;

    // تأثير حركة الكارت الأنيميشن عند الانتقال
    questionCard.classList.remove('card-bounce');
    void questionCard.offsetWidth; 
    questionCard.classList.add('card-bounce');

    // ترفيع العدادات بشكل مستقل
    currentQuestionIndex++;
    gameRoundCounter++;
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;

    // 📺 [مستقبلاً: استدعاء إعلانات أدسينس بين الأدوار - مثلاً عرض إعلان كل 5 مواقف لزيادة الربح]
    // if (gameRoundCounter % 5 === 0) { triggerGoogleAdsenseInterstitial(); }
}

nextBtn.addEventListener('click', showNextQuestion);

// 🏳️ زر الانسحاب والعقابات العشوائية الطريفة
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
