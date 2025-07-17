// Application data
const appData = {
    quotes: [
        {
            text: "Nu lucrurile ne tulbură, ci modul în care le privim.",
            author: "Epictet",
            context: "Manualul, despre dicotomia controlului"
        },
        {
            text: "Tot ce auzim este o părere, nu un fapt. Tot ceea ce vedem este o perspectivă, nu adevărul.",
            author: "Marcus Aurelius",
            context: "Gânduri către sine însuși, despre perspectivă"
        },
        {
            text: "Dacă vrei cu adevărat să scapi de lucrurile care te hărțuiesc, nu ai nevoie să te afli într-un alt loc, ci să fii o altă persoană.",
            author: "Seneca",
            context: "Scrisori către Lucilius, despre schimbarea interioară"
        },
        {
            text: "Cu ocazia fiecărui lucru care ți se întâmplă, nu uita să te întorci la tine însuți și să te întrebi ce putere ai pentru a-l folosi.",
            author: "Epictet",
            context: "Discursurile, despre folosirea circumstanțelor"
        },
        {
            text: "Dacă un rău a fost meditat dinainte, lovitura este blândă când vine.",
            author: "Seneca",
            context: "Despre linistea sufletului, despre praemeditatio malorum"
        }
    ],
    exercises: [
        {
            id: "dichotomy_control",
            title: "Dicotomia Controlului",
            description: "Distinge între ceea ce stă în puterea ta și ceea ce nu stă",
            instructions: "Gândește-te la o problemă actuală și împarte-o în două categorii: ceea ce poți controla și ceea ce nu poți controla. Concentrează-te doar pe primul."
        },
        {
            id: "praemeditatio_malorum",
            title: "Praemeditatio Malorum",
            description: "Vizualizarea negativă pentru pregătirea mentală",
            instructions: "Imaginează-ți pierderea unui confort sau avantaj. Cum te-ai adapta? Această practică te pregătește emoțional pentru adversități."
        },
        {
            id: "memento_mori",
            title: "Memento Mori",
            description: "Amintește-ți că vei muri pentru a aprecia prezentul",
            instructions: "Reflectează asupra faptului că viața este finită. Cum schimbă acest lucru prioritățile tale de astăzi?"
        },
        {
            id: "view_from_above",
            title: "Vederea de Sus",
            description: "Privește problemele din perspectivă cosmică",
            instructions: "Imaginează-te ridicându-te deasupra corpului tău, apoi a orașului, planetei. Cum arată problema ta de la această înălțime?"
        },
        {
            id: "gratitude_practice",
            title: "Gratitudine Activă",
            description: "Reflectează asupra lucrurilor pentru care ești recunoscător",
            instructions: "Notează 3 lucruri pentru care ești recunoscător astăzi - de la cele mici la cele mari."
        }
    ],
    habits: [
        {
            id: "morning_reflection",
            title: "Reflecție Matinală",
            description: "5 minute de meditație asupra zilei care urmează"
        },
        {
            id: "evening_review",
            title: "Recapitulare de Seară",
            description: "Analizează acțiunile și reacțiile din ziua care trece"
        },
        {
            id: "daily_journal",
            title: "Jurnal Zilnic",
            description: "Scrie reflecții despre principiile stoice aplicate"
        },
        {
            id: "control_practice",
            title: "Practică Dicotomia Controlului",
            description: "Aplică principiul în situații stresante"
        },
        {
            id: "gratitude_notes",
            title: "Notițe de Gratitudine",
            description: "Scrie 3 lucruri pentru care ești recunoscător"
        }
    ],
    journalPrompts: [
        "Ce am făcut bine astăzi?",
        "Ce am putea îmbunătăți mâine?",
        "Ce datorie am lăsat neîndeplinită?",
        "Cum am aplicat dicotomia controlului?",
        "Pentru ce sunt recunoscător astăzi?",
        "Ce lecție stoică am învățat?",
        "Cum am reacționat la adversități?",
        "Ce virtute am practicat?"
    ]
};

// Application state
let currentQuoteIndex = 0;
let currentPromptIndex = 0;
let journalEntries = [];
let completedExercises = [];
let habitStreaks = {};
let todayDate = new Date().toDateString();

// Initialize habit streaks
appData.habits.forEach(habit => {
    habitStreaks[habit.id] = {
        streak: 0,
        lastCompleted: null,
        completedToday: false
    };
});

// DOM elements
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const quoteContext = document.getElementById('quote-context');
const dailyPrompt = document.getElementById('daily-prompt');
const journalTextarea = document.getElementById('journal-text');
const journalEntriesContainer = document.getElementById('journal-entries');
const exerciseModal = document.getElementById('exercise-modal');
const exerciseTitle = document.getElementById('exercise-title');
const exerciseDescription = document.getElementById('exercise-description');
const exerciseInstructions = document.getElementById('exercise-instructions');
const exerciseReflection = document.getElementById('exercise-reflection');
const habitsListContainer = document.getElementById('habits-list');
const streakDays = document.getElementById('streak-days');
const exercisesCompleted = document.getElementById('exercises-completed');
const journalEntriesCount = document.getElementById('journal-entries-count');
let currentExerciseId = null;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadInitialData();
});

function initializeApp() {
    // Display initial quote
    displayDailyQuote();
    
    // Display initial prompt
    displayDailyPrompt();
    
    // Load journal entries
    displayJournalEntries();
    
    // Setup habits tracker
    setupHabitsTracker();
    
    // Update progress stats
    updateProgressStats();
    
    // Setup achievements
    setupAchievements();
}

function setupEventListeners() {
    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            navigateToSection(sectionId);
        });
    });
    
    // Close modal when clicking outside
    exerciseModal.addEventListener('click', function(e) {
        if (e.target === exerciseModal) {
            closeExerciseModal();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && exerciseModal.classList.contains('active')) {
            closeExerciseModal();
        }
    });
}

function loadInitialData() {
    // Set random quote index for today
    const today = new Date();
    currentQuoteIndex = today.getDate() % appData.quotes.length;
    
    // Set random prompt index
    currentPromptIndex = Math.floor(Math.random() * appData.journalPrompts.length);
    
    displayDailyQuote();
    displayDailyPrompt();
}

// Navigation functions
function navigateToSection(sectionId) {
    // Update navigation
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        }
    });
    
    // Update sections
    sections.forEach(section => {
        section.classList.remove('active');
        if (section.id === sectionId) {
            section.classList.add('active');
        }
    });
    
    // Update page content if needed
    if (sectionId === 'progress') {
        updateProgressStats();
    }
}

// Quote functions
function displayDailyQuote() {
    const quote = appData.quotes[currentQuoteIndex];
    quoteText.textContent = `"${quote.text}"`;
    quoteAuthor.textContent = `- ${quote.author}`;
    quoteContext.textContent = quote.context;
}

function showQuoteReflection() {
    const quote = appData.quotes[currentQuoteIndex];
    const reflection = prompt(`Cum aplici acest citat în viața ta de zi cu zi?\n\n"${quote.text}"\n- ${quote.author}`);
    
    if (reflection && reflection.trim()) {
        const entry = {
            date: new Date().toLocaleString('ro-RO'),
            type: 'reflection',
            content: reflection,
            quote: quote
        };
        journalEntries.unshift(entry);
        displayJournalEntries();
        showStatusMessage('Reflecția a fost salvată!', 'success');
    }
}

// Journal functions
function displayDailyPrompt() {
    dailyPrompt.textContent = appData.journalPrompts[currentPromptIndex];
}

function changePrompt() {
    currentPromptIndex = (currentPromptIndex + 1) % appData.journalPrompts.length;
    displayDailyPrompt();
}

function saveJournalEntry() {
    const text = journalTextarea.value.trim();
    
    if (!text) {
        showStatusMessage('Te rugăm să scrii ceva în jurnal!', 'error');
        return;
    }
    
    const entry = {
        date: new Date().toLocaleString('ro-RO'),
        type: 'journal',
        content: text,
        prompt: appData.journalPrompts[currentPromptIndex]
    };
    
    journalEntries.unshift(entry);
    journalTextarea.value = '';
    displayJournalEntries();
    updateProgressStats();
    showStatusMessage('Intrarea în jurnal a fost salvată!', 'success');
}

function clearJournalEntry() {
    journalTextarea.value = '';
}

function displayJournalEntries() {
    if (journalEntries.length === 0) {
        journalEntriesContainer.innerHTML = `
            <div class="empty-state">
                <h3>Nicio intrare în jurnal încă</h3>
                <p>Începe să scrii reflecțiile tale despre principiile stoice.</p>
            </div>
        `;
        return;
    }
    
    journalEntriesContainer.innerHTML = journalEntries.map(entry => `
        <div class="journal-entry-item">
            <div class="journal-entry-date">${entry.date}</div>
            ${entry.prompt ? `<div class="journal-entry-prompt"><strong>Întrebare:</strong> ${entry.prompt}</div>` : ''}
            ${entry.quote ? `<div class="journal-entry-quote"><strong>Citat:</strong> "${entry.quote.text}" - ${entry.quote.author}</div>` : ''}
            <div class="journal-entry-text">${entry.content}</div>
        </div>
    `).join('');
}

// Exercise functions
function startExercise(exerciseId) {
    const exercise = appData.exercises.find(ex => ex.id === exerciseId);
    if (!exercise) return;
    
    currentExerciseId = exerciseId;
    exerciseTitle.textContent = exercise.title;
    exerciseDescription.textContent = exercise.description;
    exerciseInstructions.innerHTML = `<p><strong>Instrucțiuni:</strong> ${exercise.instructions}</p>`;
    exerciseReflection.value = '';
    
    exerciseModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function completeExercise() {
    const reflection = exerciseReflection.value.trim();
    
    if (!reflection) {
        showStatusMessage('Te rugăm să completezi reflecția!', 'error');
        return;
    }
    
    const exercise = appData.exercises.find(ex => ex.id === currentExerciseId);
    const completionEntry = {
        date: new Date().toLocaleString('ro-RO'),
        exerciseId: currentExerciseId,
        exerciseTitle: exercise.title,
        reflection: reflection
    };
    
    completedExercises.unshift(completionEntry);
    closeExerciseModal();
    updateProgressStats();
    showStatusMessage(`Exercițiul "${exercise.title}" a fost completat!`, 'success');
}

function closeExerciseModal() {
    exerciseModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    currentExerciseId = null;
}

// Habit tracking functions
function setupHabitsTracker() {
    habitsListContainer.innerHTML = appData.habits.map(habit => `
        <div class="habit-item">
            <div class="habit-info">
                <h4>${habit.title}</h4>
                <p>${habit.description}</p>
            </div>
            <div class="habit-controls">
                <span class="habit-streak">${habitStreaks[habit.id].streak} zile</span>
                <div class="habit-checkbox ${habitStreaks[habit.id].completedToday ? 'checked' : ''}" 
                     onclick="toggleHabit('${habit.id}')">
                </div>
            </div>
        </div>
    `).join('');
}

function toggleHabit(habitId) {
    const habit = habitStreaks[habitId];
    
    if (habit.completedToday) {
        // Uncheck habit
        habit.completedToday = false;
        if (habit.lastCompleted === todayDate) {
            habit.streak = Math.max(0, habit.streak - 1);
        }
    } else {
        // Check habit
        habit.completedToday = true;
        habit.lastCompleted = todayDate;
        
        // Calculate streak
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (habit.streak === 0 || habit.lastCompleted === yesterday.toDateString()) {
            habit.streak += 1;
        } else {
            habit.streak = 1;
        }
    }
    
    setupHabitsTracker();
    updateProgressStats();
}

// Progress tracking functions
function updateProgressStats() {
    // Calculate current streak (highest from all habits)
    const maxStreak = Math.max(...Object.values(habitStreaks).map(h => h.streak));
    streakDays.textContent = maxStreak;
    
    // Count completed exercises
    exercisesCompleted.textContent = completedExercises.length;
    
    // Count journal entries
    journalEntriesCount.textContent = journalEntries.length;
}

function setupAchievements() {
    const achievementsContainer = document.getElementById('achievements-list');
    
    const achievements = [
        {
            id: 'first_journal',
            title: 'Prima intrare',
            description: 'Ai scris prima intrare în jurnal',
            unlocked: journalEntries.length > 0
        },
        {
            id: 'first_exercise',
            title: 'Primul exercițiu',
            description: 'Ai completat primul exercițiu stoic',
            unlocked: completedExercises.length > 0
        },
        {
            id: 'week_streak',
            title: 'O săptămână',
            description: 'Ai menținut un obicei 7 zile consecutive',
            unlocked: Math.max(...Object.values(habitStreaks).map(h => h.streak)) >= 7
        },
        {
            id: 'ten_entries',
            title: 'Dedicat',
            description: 'Ai scris 10 intrări în jurnal',
            unlocked: journalEntries.length >= 10
        },
        {
            id: 'all_exercises',
            title: 'Explorator',
            description: 'Ai încercat toate exercițiile',
            unlocked: new Set(completedExercises.map(ex => ex.exerciseId)).size === appData.exercises.length
        }
    ];
    
    achievementsContainer.innerHTML = achievements.map(achievement => `
        <div class="achievement-item ${achievement.unlocked ? 'unlocked' : ''}">
            <div class="achievement-icon">
                ${achievement.unlocked ? '🏆' : '🔒'}
            </div>
            <div class="achievement-info">
                <h4>${achievement.title}</h4>
                <p>${achievement.description}</p>
            </div>
        </div>
    `).join('');
}

// Utility functions
function showStatusMessage(message, type = 'success') {
    const statusMessage = document.createElement('div');
    statusMessage.className = `status-message ${type}`;
    statusMessage.textContent = message;
    
    document.body.appendChild(statusMessage);
    
    setTimeout(() => {
        statusMessage.remove();
    }, 3000);
}

function getCurrentDate() {
    const today = new Date();
    return today.toLocaleDateString('ro-RO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Export functionality (for backup)
function exportData() {
    const data = {
        journalEntries,
        completedExercises,
        habitStreaks,
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stoicism-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                navigateToSection('home');
                break;
            case '2':
                e.preventDefault();
                navigateToSection('journal');
                break;
            case '3':
                e.preventDefault();
                navigateToSection('exercises');
                break;
            case '4':
                e.preventDefault();
                navigateToSection('progress');
                break;
            case '5':
                e.preventDefault();
                navigateToSection('resources');
                break;
        }
    }
});

// Auto-save functionality
setInterval(() => {
    const text = journalTextarea.value.trim();
    if (text.length > 0) {
        // Auto-save indicator could be shown here
        console.log('Auto-saving journal entry...');
    }
}, 30000); // Auto-save every 30 seconds

// Initialize achievements check
setInterval(() => {
    setupAchievements();
}, 5000); // Check achievements every 5 seconds

// Welcome message
setTimeout(() => {
    showStatusMessage('Bine ai venit! Începe ziua cu citatul zilnic și reflectează asupra lui.', 'success');
}, 1000);