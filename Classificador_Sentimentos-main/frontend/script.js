document.addEventListener('DOMContentLoaded', () => {
    const analyzeBtn = document.getElementById('analyzeBtn');
    const textInput = document.getElementById('textInput');
    const btnText = document.querySelector('.btn-text');
    const btnLoader = document.getElementById('btnLoader');
    const resultCard = document.getElementById('resultCard');
    const resultIcon = document.getElementById('resultIcon');
    const emotionLabel = document.getElementById('emotionLabel');
    const confidenceText = document.getElementById('confidenceText');

    const historyList = document.getElementById('historyList');
    const historyCount = document.getElementById('historyCount');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    let historyData = [];

    analyzeBtn.addEventListener('click', async () => {
        const text = textInput.value.trim();

        if (!text) {
            alert('Por favor, digite uma frase para analisar.');
            return;
        }

        // UI Loading State
        analyzeBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'block';

        // Hide previous result with a small delay for animation
        resultCard.classList.add('hidden');

        try {
            const response = await fetch('http://localhost:8000/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: text })
            });

            if (!response.ok) {
                throw new Error('Erro na comunicação com a API');
            }

            const data = await response.json();

            // Show new result
            setTimeout(() => {
                showResult(data.emotion, data.confidence);
                addToHistory(text, data.emotion);
            }, 300);

        } catch (error) {
            console.error('Erro:', error);
            alert('Ocorreu um erro ao analisar o sentimento. O servidor está rodando?');
        } finally {
            analyzeBtn.disabled = false;
            btnText.style.display = 'block';
            btnLoader.style.display = 'none';
        }
    });

    clearHistoryBtn.addEventListener('click', () => {
        if (historyData.length === 0) return;
        if (confirm('Tem certeza que deseja apagar todo o histórico?')) {
            historyData = [];
            renderHistory();
        }
    });

    function addToHistory(text, emotion) {
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newItem = { text, emotion, timestamp };

        // Add to start of array
        historyData.unshift(newItem);

        // Limit history to last 10 items
        if (historyData.length > 10) historyData.pop();

        renderHistory();
    }

    function renderHistory() {
        if (historyData.length === 0) {
            historyList.innerHTML = '<p class="empty-history">Nenhuma análise feita ainda.</p>';
            historyCount.textContent = '0';
            return;
        }

        historyCount.textContent = historyData.length;
        historyList.innerHTML = '';

        historyData.forEach((item, index) => {
            const emotionLower = item.emotion.toLowerCase();
            let badgeClass = 'badge-neutral';
            let emotionDisplay = 'Neutro';
            let emoji = '😐';

            if (emotionLower === 'positive' || emotionLower === 'positivo') {
                badgeClass = 'badge-positive';
                emotionDisplay = 'Positivo';
                emoji = '😁';
            } else if (emotionLower === 'negative' || emotionLower === 'negativo') {
                badgeClass = 'badge-negative';
                emotionDisplay = 'Negativo';
                emoji = '😔';
            } else if (emotionLower === 'irrelevant' || emotionLower === 'irrelevante') {
                badgeClass = 'badge-neutral';
                emotionDisplay = 'Irrelevante';
                emoji = '🤔';
            }

            const itemHtml = `
                <div class="history-item">
                    <div class="item-header-row">
                        <p class="item-text" title="${item.text}">${item.text}</p>
                        <button class="delete-btn" data-index="${index}" title="Excluir">🗑️</button>
                    </div>
                    <div class="item-footer">
                        <span class="item-badge ${badgeClass}">${emoji} ${emotionDisplay}</span>
                        <span class="item-time">${item.timestamp}</span>
                    </div>
                </div>
            `;
            historyList.innerHTML += itemHtml;
        });

        // Attach event listeners to all delete buttons
        const deleteButtons = historyList.querySelectorAll('.delete-btn');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.getAttribute('data-index'));
                historyData.splice(idx, 1); // Remove item from array
                renderHistory(); // Re-render the history list
            });
        });
    }

    function showResult(emotion, confidence) {
        const emotionLower = emotion.toLowerCase();
        resultCard.className = 'result-card'; // Reset

        if (emotionLower === 'positive' || emotionLower === 'positivo') {
            emotionLabel.textContent = 'Positivo';
            resultIcon.textContent = '😁';
            resultCard.classList.add('emotion-positive');
        } else if (emotionLower === 'negative' || emotionLower === 'negativo') {
            emotionLabel.textContent = 'Negativo';
            resultIcon.textContent = '😔';
            resultCard.classList.add('emotion-negative');
        } else if (emotionLower === 'irrelevant' || emotionLower === 'irrelevante') {
            emotionLabel.textContent = 'Irrelevante';
            resultIcon.textContent = '🤔';
            resultCard.classList.add('emotion-neutral');
        } else {
            emotionLabel.textContent = 'Neutro';
            resultIcon.textContent = '😐';
            resultCard.classList.add('emotion-neutral');
        }

        const confidencePercentage = (confidence * 100).toFixed(1);
        confidenceText.textContent = `Confiança do modelo: ${confidencePercentage}%`;
        resultCard.classList.remove('hidden');
    }
});

