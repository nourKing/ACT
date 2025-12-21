// Main script for index.html
document.addEventListener('DOMContentLoaded', function() {
    loadRecentResults();
});

function loadRecentResults() {
    const resultsContainer = document.getElementById('recent-results');
    const results = JSON.parse(localStorage.getItem('examResults') || '[]');
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<p class="no-data">لا توجد نتائج بعد. قم بإجراء اختبار أولاً!</p>';
        return;
    }
    
    // Show last 5 results
    const recentResults = results.slice(-5).reverse();
    let html = '<div class="results-table">';
    
    recentResults.forEach((result, index) => {
        html += `
            <div class="result-row" style="display: flex; justify-content: space-between; padding: 1rem; background: #f7fafc; margin-bottom: 0.5rem; border-radius: 5px;">
                <span><strong>اختبار ${recentResults.length - index}</strong></span>
                <span>الدرجة: <strong style="color: #667eea;">${result.score}/${result.total}</strong></span>
                <span>النسبة: <strong style="color: ${result.percentage >= 50 ? '#48bb78' : '#f56565'};">${result.percentage}%</strong></span>
                <span>التاريخ: ${new Date(result.date).toLocaleDateString('ar-SA')}</span>
            </div>
        `;
    });
    
    html += '</div>';
    resultsContainer.innerHTML = html;
}
