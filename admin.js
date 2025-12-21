// Admin script
let questions = [];

document.addEventListener('DOMContentLoaded', function() {
    loadQuestions();
    displayQuestions();
    setupFormListener();
});

function loadQuestions() {
    questions = JSON.parse(localStorage.getItem('examQuestions') || '[]');
}

function setupFormListener() {
    const form = document.getElementById('question-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        addQuestion();
    });
}

function addQuestion() {
    const questionText = document.getElementById('question-text').value.trim();
    const option1 = document.getElementById('option1').value.trim();
    const option2 = document.getElementById('option2').value.trim();
    const option3 = document.getElementById('option3').value.trim();
    const option4 = document.getElementById('option4').value.trim();
    const correctAnswer = parseInt(document.getElementById('correct-answer').value);
    
    if (!questionText || !option1 || !option2 || !option3 || !option4 || isNaN(correctAnswer) || correctAnswer < 0 || correctAnswer > 3) {
        alert('يرجى ملء جميع الحقول');
        return;
    }
    
    const newQuestion = {
        question: questionText,
        options: [option1, option2, option3, option4],
        correctAnswer: correctAnswer
    };
    
    questions.push(newQuestion);
    localStorage.setItem('examQuestions', JSON.stringify(questions));
    
    // Clear form
    document.getElementById('question-form').reset();
    
    // Refresh display
    displayQuestions();
    
    // Show success message
    showMessage('تم إضافة السؤال بنجاح!', 'success');
}

function displayQuestions() {
    const container = document.getElementById('questions-container');
    const totalQuestions = document.getElementById('total-questions');
    
    totalQuestions.textContent = questions.length;
    
    if (questions.length === 0) {
        container.innerHTML = '<p class="no-data">لا توجد أسئلة حتى الآن. قم بإضافة أسئلة جديدة.</p>';
        return;
    }
    
    let html = '';
    questions.forEach((question, index) => {
        html += `
            <div class="question-item">
                <h4>السؤال ${index + 1}</h4>
                <p style="margin-bottom: 1rem;">${question.question}</p>
                <ul class="options-list">
                    ${question.options.map((option, optIndex) => `
                        <li class="${optIndex === question.correctAnswer ? 'correct-answer' : ''}">
                            ${option}
                            ${optIndex === question.correctAnswer ? ' ✓' : ''}
                        </li>
                    `).join('')}
                </ul>
                <button class="delete-btn" onclick="deleteQuestion(${index})">حذف السؤال</button>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function deleteQuestion(index) {
    if (confirm('هل أنت متأكد من حذف هذا السؤال؟')) {
        questions.splice(index, 1);
        localStorage.setItem('examQuestions', JSON.stringify(questions));
        displayQuestions();
        showMessage('تم حذف السؤال بنجاح!', 'success');
    }
}

function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? '#48bb78' : '#f56565'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 300);
    }, 3000);
}

// Add CSS animation for messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
