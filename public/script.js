document.addEventListener('DOMContentLoaded', () => {
  // =============================
  // 🎬 1. Rotating film quotes
  // =============================
  const quoteElement = document.getElementById('quote');
  const quotes = [
    “A story should have a beginning, a middle, and an end… but not necessarily in that order.” – Jean-Luc Godard,
    “Cinema is a matter of what's in the frame and what's out.” – Martin Scorsese,
    “A film is—or should be—more like music than like fiction.” – Stanley Kubrick,
    “We don’t make movies to make money. We make money to make more movies.” – Walt Disney,
    “If a million people see my movie, I hope they see a million different movies.” – Quentin Tarantino,
    “My idea of professionalism is probably a lot of people’s idea of obsessive.” – David Fincher,
    “For me, filmmaking combines everything.” – Akira Kurosawa,
    “People say I pay too much attention to the look of a movie, but for God’s sake, I’m making a movie that people are going to look at.” – Ridley Scott,
  ];

  let currentQuoteIndex = Math.floor(Math.random() * quotes.length);
  quoteElement.textContent = quotes[currentQuoteIndex];

  setInterval(() => {
    quoteElement.classList.add('opacity-0');
    setTimeout(() => {
      currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
      quoteElement.textContent = quotes[currentQuoteIndex];
      quoteElement.classList.remove('opacity-0');
    }, 700);
  }, 5000);

  // =============================
  // 🪟 2. Modal open/close logic
  // =============================
  const openModalBtn = document.querySelector('button.bg-white');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const breakdownModal = document.getElementById('breakdown-modal');

  openModalBtn.addEventListener('click', () => {
    breakdownModal.classList.remove('hidden');
  });

  closeModalBtn.addEventListener('click', () => {
    breakdownModal.classList.add('hidden');
  });

  // =============================
  // 📝 3. Fullscreen toggle for text editing
  // =============================
  const scriptText = document.getElementById('script-text');
  const fullscreenBtn = document.getElementById('fullscreen-btn');

  if (fullscreenBtn && scriptText) {
    fullscreenBtn.addEventListener('click', () => {
      scriptText.classList.toggle('fullscreen');
      const icon = fullscreenBtn.querySelector('i');
      if (scriptText.classList.contains('fullscreen')) {
        icon.classList.remove('fa-expand');
        icon.classList.add('fa-compress');
        fullscreenBtn.title = 'Exit Fullscreen';
      } else {
        icon.classList.remove('fa-compress');
        icon.classList.add('fa-expand');
        fullscreenBtn.title = 'Toggle Fullscreen';
      }
    });
  }

  // Escape key to exit fullscreen
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && scriptText.classList.contains('fullscreen')) {
      scriptText.classList.remove('fullscreen');
      const icon = fullscreenBtn.querySelector('i');
      icon.classList.replace('fa-compress', 'fa-expand');
      fullscreenBtn.title = 'Toggle Fullscreen';
    }
  });

  // =============================
  // 🎬 4. Automatic screenplay formatting on paste
  // =============================
  function autoFormatScript(rawText) {
    if (!rawText) return '';

    const lines = rawText.split('\n').map(line => line.trim());
    const formatted = [];
    let lastWasCharacter = false;

    lines.forEach(line => {
      if (/^(INT\.|EXT\.|EST\.|INT\/EXT\.)/i.test(line)) {
        formatted.push('\n\n' + line.toUpperCase());
        lastWasCharacter = false;
      } else if (/^[A-Z ]{2,30}$/.test(line) && line.length <= 30) {
        formatted.push('\n' + line.toUpperCase());
        lastWasCharacter = true;
      } else if (line.startsWith('(') && line.endsWith(')')) {
        formatted.push('      ' + line);
        lastWasCharacter = false;
      } else if (line) {
        formatted.push('    ' + line);
        lastWasCharacter = false;
      } else {
        formatted.push('');
        lastWasCharacter = false;
      }
    });

    return formatted.join('\n');
  }

  scriptText.addEventListener('paste', (e) => {
    e.preventDefault();
    const pastedText = (e.clipboardData || window.clipboardData).getData('text');
    const formatted = autoFormatScript(pastedText);
    const start = scriptText.selectionStart;
    const end = scriptText.selectionEnd;
    scriptText.value = scriptText.value.slice(0, start) + formatted + scriptText.value.slice(end);
  });

  // =============================
  // 🧠 5. AI breakdown submission
  // =============================
  const uploadForm = document.getElementById('upload-form');
  const outputArea = document.getElementById('output-area');
  const loadingMessage = document.getElementById('loading-message');
  const submitButton = document.getElementById('submit-button');
  const downloadCsvBtn = document.getElementById('download-csv-btn');
  let breakdownResults = null;

  uploadForm.addEventListener('submit', handleFormSubmit);
  downloadCsvBtn.addEventListener('click', handleCsvDownload);

  async function handleFormSubmit(event) {
    event.preventDefault();
    const rawScript = scriptText.value.trim();

    if (!rawScript) {
      alert('Please paste or write a script first.');
      return;
    }

    const formattedScript = autoFormatScript(rawScript);

    submitButton.disabled = true;
    loadingMessage.classList.remove('hidden');
    outputArea.innerHTML = '<p class="text-gray-500">Analyzing script...</p>';
    downloadCsvBtn.classList.add('hidden');

    try {
      const response = await fetch('/api/breakdown/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scriptText: formattedScript }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to analyze script');
      }

      breakdownResults = await response.json();
      displayResultsAsTable(breakdownResults);
      downloadCsvBtn.classList.remove('hidden');

    } catch (error) {
      outputArea.innerHTML = <p class="text-red-500">Error: ${error.message}</p>;
    } finally {
      submitButton.disabled = false;
      loadingMessage.classList.add('hidden');
    }
  }

  // =============================
  // 🗂 6. Display results in table
  // =============================
  function displayResultsAsTable(data) {
    let tableHtml = <table class="w-full text-left border-collapse"><thead><tr class="bg-gray-700"><th class="p-3 border border-gray-600">Category</th><th class="p-3 border border-gray-600">Item</th></tr></thead><tbody>;
    for (const category in data) {
      const items = data[category] || [];
      if (items.length > 0) {
        items.forEach(item => {
          tableHtml += <tr class="border-t border-gray-800 hover:bg-gray-700"><td class="p-3 border border-gray-600 capitalize">${category}</td><td class="p-3 border border-gray-600">${item}</td></tr>;
        });
      }
    }
    tableHtml += </tbody></table>;
    outputArea.innerHTML = tableHtml;

    // 💰 Add production cost estimation
    const cost = estimateProductionCost(data);
    const costHtml = `
      <div class="mt-6 p-4 bg-black border border-gray-700 rounded-md">
        <h3 class="text-xl font-bold text-white mb-2">💰 Estimated Production Cost</h3>
        <p class="text-gray-300">Approx. total: <span class="text-white font-bold">$${cost.total.toLocaleString()}</span></p>
        <p class="text-gray-500 text-sm mt-2">${cost.breakdown}</p>
      </div>
    `;
    outputArea.insertAdjacentHTML('beforeend', costHtml);

    // 🎭 Add gender ratio chart
    updateGenderChart(data);
  }

  // =============================
  // 💰 7. Cost Estimator
  // =============================
  function estimateProductionCost(data) {
    const COSTS = {
      characters: 1000,
      props: 200,
      wardrobe: 150,
      locations: 5000,
      scenes: 800,
    };

    let total = 0;
    let details = [];

    for (const category in data) {
      const items = data[category] || [];
      if (COSTS[category]) {
        const subtotal = items.length * COSTS[category];
        total += subtotal;
        details.push(${items.length} ${category} → $${subtotal.toLocaleString()});
      }
    }

    return {
      total,
      breakdown: details.join(', '),
    };
  }

  // =============================
  // 🎭 8. Gender Ratio Chart
  // =============================
  function updateGenderChart(data) {
    const chartContainer = document.getElementById('gender-chart-container');
    const ctx = document.getElementById('genderChart').getContext('2d');

    if (!data.characters || data.characters.length === 0) {
      chartContainer.classList.add('hidden');
      return;
    }

    const maleKeywords = ['male', 'man', 'boy', 'm'];
    const femaleKeywords = ['female', 'woman', 'girl', 'f'];

    let maleCount = 0;
    let femaleCount = 0;

    data.characters.forEach(name => {
      const lower = name.toLowerCase();
      if (femaleKeywords.some(k => lower.includes(k))) femaleCount++;
      else if (maleKeywords.some(k => lower.includes(k))) maleCount++;
    });

    if (maleCount + femaleCount === 0) {
      maleCount = 1;
      femaleCount = 1;
    }

    const total = maleCount + femaleCount;
    const malePercent = ((maleCount / total) * 100).toFixed(1);
    const femalePercent = ((femaleCount / total) * 100).toFixed(1);

    chartContainer.classList.remove('hidden');

    if (window.genderChartInstance) window.genderChartInstance.destroy();

    window.genderChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [Male ${malePercent}%, Female ${femalePercent}%],
        datasets: [
          {
            data: [maleCount, femaleCount],
            backgroundColor: ['#ffffff', '#999999'],
            borderColor: '#000000',
            borderWidth: 2,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            labels: { color: '#fff', font: { size: 14 } },
            position: 'bottom',
          },
        },
        cutout: '60%',
      },
    });
  }

  // =============================
  // 💾 9. Download CSV
  // =============================
  async function handleCsvDownload() {
    if (!breakdownResults) {
      alert('No data to download.');
      return;
    }

    try {
      // Convert breakdownResults to CSV format
      let csvContent = 'data:text/csv;charset=utf-8,Category,Item\n';
      for (const category in breakdownResults) {
        const items = breakdownResults[category] || [];
        items.forEach(item => {
          csvContent += ${category},${item}\n;
        });
      }

      const encodedUri = encodeURI(csvContent);
      const a = document.createElement('a');
      a.setAttribute('href', encodedUri);
      a.setAttribute('download', 'breakdown.csv');
      document.body.appendChild(a);
      a.click();
      a.remove();

    } catch (error) {
      console.error('CSV download error:', error);
      alert('Error downloading CSV.');
    }
  }

});
