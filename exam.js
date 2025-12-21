// Exam script
let questions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let examStartTime;
let timerInterval;

document.addEventListener('DOMContentLoaded', function() {
    loadQuestions();
    initializeExam();
});

function loadQuestions() {
    // Load questions from localStorage
    questions = JSON.parse(localStorage.getItem('examQuestions') || '[]');
    
    // If no questions exist, add some default questions
    if (questions.length === 0) {
        questions = [
            {
                question: "ما هي لغة البرمجة المستخدمة لتطوير تطبيقات الويب من جانب العميل؟",
                options: ["Python", "JavaScript", "Java", "C++"],
                correctAnswer: 1
            },
            {
                question: "ما هو اختصار HTML؟",
                options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language"],
                correctAnswer: 0
            },
            {
                question: "ما هي قاعدة البيانات العلائقية؟",
                options: ["MongoDB", "MySQL", "Redis", "Cassandra"],
                correctAnswer: 1
            },
            {
                question: "ما هو CSS؟",
                options: ["لغة برمجة", "لغة تنسيق", "قاعدة بيانات", "نظام تشغيل"],
                correctAnswer: 1
            },
            {
                question: "ما هي وظيفة Git؟",
                options: ["تصميم واجهات المستخدم", "إدارة قواعد البيانات", "التحكم في الإصدارات", "اختبار البرمجيات"],
                correctAnswer: 2
            }
        ];
        localStorage.setItem('examQuestions', JSON.stringify(questions));
    }
}

function initializeExam() {
    if (questions.length === 0) {
        document.getElementById('question-area').innerHTML = '<p class="no-data">لا توجد أسئلة متاحة. يرجى إضافة أسئلة من صفحة الإدارة.</p>';
        return;
    }
    
    document.getElementById('question-count').textContent = questions.length;
    userAnswers = new Array(questions.length).fill(null);
    examStartTime = Date.now();
    
    startTimer();
    displayQuestion();
    setupEventListeners();
}

function startTimer() {
    const examDuration = 30 * 60; // 30 minutes in seconds
    let timeRemaining = examDuration;
    
    updateTimerDisplay(timeRemaining);
    
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay(timeRemaining);
        
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            submitExam();
        }
    }, 1000);
}

function updateTimerDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    document.getElementById('timer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function displayQuestion() {
    const question = questions[currentQuestionIndex];
    const questionArea = document.getElementById('question-area');
    
    let html = `
        <div class="question-card">
            <h3>السؤال ${currentQuestionIndex + 1} من ${questions.length}</h3>
            <p style="font-size: 1.1rem; margin-bottom: 1.5rem;">${question.question}</p>
            <div class="options">
    `;
    
    question.options.forEach((option, index) => {
        const isSelected = userAnswers[currentQuestionIndex] === index;
        html += `
            <div class="option ${isSelected ? 'selected' : ''}" data-index="${index}">
                <label style="cursor: pointer; display: block;">
                    <input type="radio" name="answer" value="${index}" ${isSelected ? 'checked' : ''} style="margin-left: 10px;">
                    ${option}
                </label>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    questionArea.innerHTML = html;
    
    // Add click listeners to options
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            selectAnswer(index);
        });
    });
    
    updateNavigationButtons();
}

function selectAnswer(answerIndex) {
    userAnswers[currentQuestionIndex] = answerIndex;
    
    // Update UI
    document.querySelectorAll('.option').forEach((opt, idx) => {
        if (idx === answerIndex) {
            opt.classList.add('selected');
            opt.querySelector('input').checked = true;
        } else {
            opt.classList.remove('selected');
        }
    });
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    
    // Show/hide previous button
    if (currentQuestionIndex > 0) {
        prevBtn.style.display = 'inline-block';
    } else {
        prevBtn.style.display = 'none';
    }
    
    // Show/hide next and submit buttons
    if (currentQuestionIndex < questions.length - 1) {
        nextBtn.style.display = 'inline-block';
        submitBtn.style.display = 'none';
    } else {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-block';
    }
}

function setupEventListeners() {
    document.getElementById('prev-btn').addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            displayQuestion();
        }
    });
    
    document.getElementById('next-btn').addEventListener('click', () => {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            displayQuestion();
        }
    });
    
    document.getElementById('submit-btn').addEventListener('click', () => {
        if (confirm('هل أنت متأكد من إنهاء الاختبار؟')) {
            submitExam();
        }
    });
}

function submitExam() {
    clearInterval(timerInterval);
    
    // Calculate results
    let correctCount = 0;
    questions.forEach((question, index) => {
        if (userAnswers[index] === question.correctAnswer) {
            correctCount++;
        }
    });
    
    const wrongCount = questions.length - correctCount;
    const percentage = Math.round((correctCount / questions.length) * 100);
    
    // Save results
    const results = JSON.parse(localStorage.getItem('examResults') || '[]');
    results.push({
        score: correctCount,
        total: questions.length,
        percentage: percentage,
        date: new Date().toISOString()
    });
    localStorage.setItem('examResults', JSON.stringify(results));
    
    // Display results
    displayResults(correctCount, wrongCount, percentage);
}

function displayResults(correctCount, wrongCount, percentage) {
    document.getElementById('exam-container').style.display = 'none';
    document.getElementById('results-container').style.display = 'block';
    
    document.getElementById('score').textContent = `${correctCount} / ${questions.length}`;
    document.getElementById('correct-answers').textContent = correctCount;
    document.getElementById('wrong-answers').textContent = wrongCount;
    document.getElementById('percentage').textContent = `${percentage}%`;
    
    // Display review
    displayAnswersReview();
}

function displayAnswersReview() {
    const reviewList = document.getElementById('review-list');
    let html = '';
    
    questions.forEach((question, index) => {
        const userAnswer = userAnswers[index];
        const isCorrect = userAnswer === question.correctAnswer;
        
        html += `
            <div class="review-item">
                <div class="review-question">السؤال ${index + 1}: ${question.question}</div>
                <div class="review-answer ${isCorrect ? 'correct' : 'wrong'}">
                    ${userAnswer !== null ? 
                        `إجابتك: ${question.options[userAnswer]}` : 
                        'لم تجب على هذا السؤال'}
                </div>
                ${!isCorrect ? 
                    `<div class="review-answer correct">الإجابة الصحيحة: ${question.options[question.correctAnswer]}</div>` 
                    : ''}
            </div>
        `;
    });
    
    reviewList.innerHTML = html;
}
