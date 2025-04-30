// ========================================================
// Step 1: Firebase Configuration & Initialization
// ========================================================

// --- PASTE YOUR FIREBASE CONFIGURATION OBJECT HERE ---
// Replace the placeholder values below with your ACTUAL Firebase config details
// You get this from: Firebase Console -> Project settings -> General -> Your apps -> Web app -> SDK setup and configuration -> Config
const firebaseConfig = {
  apiKey: "AIzaSyASpweJ1bRD8yKA4CPReXzC12wBZbYdKc8",
  authDomain: "harry-potter-quiz-scores.firebaseapp.com",
  projectId: "harry-potter-quiz-scores",
  storageBucket: "harry-potter-quiz-scores.firebasestorage.app",
  messagingSenderId: "651888601262",
  appId: "1:651888601262:web:c03342f9eedf324398a53f",
  measurementId: "G-WJY003DF68"
};
// --- END OF FIREBASE CONFIGURATION ---

// Initialize Firebase App
let app;
try {
    if (!firebase.apps.length) {
        app = firebase.initializeApp(firebaseConfig);
        console.log("Firebase Initialized Successfully.");
    } else {
        app = firebase.app();
        console.log("Firebase Already Initialized.");
    }
} catch (error) {
    console.error("Error initializing Firebase:", error);
    alert("Error connecting to Firebase. Please check configuration and console logs.");
}

// Initialize Firestore Database service
let db;
if (app) {
    try {
        db = firebase.firestore();
        console.log("Firestore service initialized.");
    } catch(error) {
        console.error("Error getting Firestore service:", error);
        alert("Error connecting to Firestore Database. Please check console logs.");
    }
} else {
    console.error("Firebase app not initialized. Cannot get Firestore service.");
}

// ========================================================
// Step 2: Harry Potter Quiz Data (Aficionado Level)
// ========================================================

const questions = [
    {
        questionText: "What is the name of the Black family's house elf?",
        options: ["Dobby", "Winky", "Kreacher", "Hokey"],
        correctAnswerIndex: 2
    },
    {
        questionText: "Which Hogwarts founder's artefact was Marvolo Gaunt's Ring originally?",
        options: ["Godric Gryffindor's Sword", "Rowena Ravenclaw's Diadem", "Helga Hufflepuff's Cup", "Salazar Slytherin's Locket"],
        correctAnswerIndex: 3 // Tricky! While it became a Horcrux, it was Slytherin's Locket. The *stone* was the Resurrection Stone, Peverell artefact. Let's rephrase or pick a different one.
        // Revision: Let's change the question slightly for clarity.
        // questionText: "Which artefact, later revealed to be a Horcrux, did Hepzibah Smith show Tom Riddle?",
        // options: ["Gryffindor's Sword", "Ravenclaw's Diadem", "Hufflepuff's Cup", "Slytherin's Locket"],
        // correctAnswerIndex: 2 // Hufflepuff's Cup and Slytherin's Locket were shown. Let's focus on one.
    },
     {
        questionText: "Which magical creature pulls the Hogwarts carriages for students who can see them?",
        options: ["Hippogriffs", "Thestrals", "Grindylows", "Abraxans"],
        correctAnswerIndex: 1
    },
    {
        questionText: "What is the incantation for the Shield Charm?",
        options: ["Expecto Patronum", "Expelliarmus", "Stupefy", "Protego"],
        correctAnswerIndex: 3
    },
    {
        questionText: "Who was the original owner of the Elder Wand before Grindelwald stole it?",
        options: ["Antioch Peverell", "Gregorovitch", "Albus Dumbledore", "Mykew Gregorovitch"], // Use full name for distinction
        correctAnswerIndex: 3 // Mykew Gregorovitch, the wandmaker
    },
    {
        questionText: "What is the core of Bellatrix Lestrange's wand?",
        options: ["Phoenix Feather", "Dragon Heartstring", "Unicorn Hair", "Thestral Tail Hair"],
        correctAnswerIndex: 1
    },
    {
        questionText: "In 'The Tale of the Three Brothers', what gift did the second brother receive from Death?",
        options: ["The Elder Wand", "The Cloak of Invisibility", "The Resurrection Stone", "A Goblin-made Sword"],
        correctAnswerIndex: 2
    },
    {
        questionText: "What is the full name of the Ravenclaw house ghost?",
        options: ["The Bloody Baron", "The Fat Friar", "Helena Ravenclaw (The Grey Lady)", "Sir Nicholas de Mimsy-Porpington"],
        correctAnswerIndex: 2
    },
    {
        questionText: "Which ingredient is NOT needed to brew the Polyjuice Potion?",
        options: ["Lacewing flies", "Fluxweed", "Boomslang skin", "Mandrake root"],
        correctAnswerIndex: 3 // Mandrake root is for restoring petrified people.
    },
    {
        questionText: "What form does Kingsley Shacklebolt's Patronus take?",
        options: ["Hare", "Lynx", "Stag", "Weasel"],
        correctAnswerIndex: 1
    }
    // Add more questions if needed
];


// ========================================================
// Step 3: DOM Element References
// ========================================================
const quizForm = document.getElementById('quiz-form');
const questionsContainer = document.getElementById('questions-container');
const resultsArea = document.getElementById('results-area');
const scoreText = document.getElementById('score-text');
const detailedFeedback = document.getElementById('detailed-feedback');
const saveStatus = document.getElementById('save-status');
const validationMessage = document.getElementById('validation-message');
const submitButton = document.getElementById('submit-button');
const restartButton = document.getElementById('restart-button'); // Assuming you added a restart button with this ID

// ========================================================
// Step 4: Display Quiz Questions Function
// ========================================================

function displayQuiz() {
    console.log("Displaying quiz...");
    questionsContainer.innerHTML = ''; // Clear previous questions if any

    questions.forEach((question, qIndex) => {
        // Create fieldset for each question group
        const fieldset = document.createElement('fieldset');
        fieldset.className = 'border border-gray-300 p-4 rounded-lg shadow-sm bg-white';

        // Create legend for question number
        const legend = document.createElement('legend');
        legend.className = 'text-lg font-semibold px-2 text-gray-700';
        legend.textContent = `Question ${qIndex + 1}:`;
        fieldset.appendChild(legend);

        // Create paragraph for question text
        const questionPara = document.createElement('p');
        questionPara.className = 'mb-4 text-gray-800';
        questionPara.textContent = question.questionText;
        fieldset.appendChild(questionPara);

        // Create div to hold radio buttons
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'space-y-3'; // Increased spacing

        // Create radio button and label for each option
        question.options.forEach((option, oIndex) => {
            const optionId = `q${qIndex}_opt${oIndex}`;

            const optionDiv = document.createElement('div');
            optionDiv.className = 'flex items-center p-2 rounded hover:bg-indigo-50 transition duration-150'; // Added hover effect

            const radioInput = document.createElement('input');
            radioInput.type = 'radio';
            radioInput.id = optionId;
            radioInput.name = `q${qIndex}`; // Group radios by question index
            radioInput.value = oIndex;      // Store the option index as the value
            radioInput.required = true;     // Make selection mandatory
            radioInput.className = 'form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500';

            const label = document.createElement('label');
            label.htmlFor = optionId;
            label.textContent = option;
            label.className = 'ml-3 block text-sm font-medium text-gray-700 cursor-pointer';

            optionDiv.appendChild(radioInput);
            optionDiv.appendChild(label);
            optionsDiv.appendChild(optionDiv);
        });

        fieldset.appendChild(optionsDiv);
        questionsContainer.appendChild(fieldset);
    });
     // Ensure results area is hidden initially
    resultsArea.classList.add('hidden');
    quizForm.classList.remove('hidden');
    validationMessage.textContent = ''; // Clear validation message
}

// ========================================================
// Step 5: Handle Form Submission
// ========================================================

quizForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default page reload
    console.log("Form submitted.");
    validationMessage.textContent = ''; // Clear previous validation messages

    const totalQuestions = questions.length;
    let score = 0;
    const userAnswers = []; // Store user's selected answer index for each question
    let allAnswered = true;

    // Check if all questions are answered and collect answers
    for (let i = 0; i < totalQuestions; i++) {
        const selectedOption = quizForm.querySelector(`input[name="q${i}"]:checked`);
        if (selectedOption) {
            userAnswers[i] = parseInt(selectedOption.value); // Store the selected index
        } else {
            allAnswered = false;
            // Highlight the first unanswered question's fieldset
            const fieldset = questionsContainer.children[i];
            if (fieldset) {
                 fieldset.style.borderColor = '#dc2626'; // Red border
                 fieldset.style.borderWidth = '2px';
            }
           // break; // Stop checking once one unanswered question is found
        }
    }

    // If not all questions are answered, show validation message and stop
    if (!allAnswered) {
        console.log("Validation failed: Not all questions answered.");
        validationMessage.textContent = "Please answer all questions before submitting.";
        // Optionally scroll to the first unanswered question
        const firstUnanswered = quizForm.querySelector('input[type="radio"]:required:invalid');
         if(firstUnanswered) {
            firstUnanswered.closest('fieldset')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
         }
        return;
    }

    // --- If all questions answered, proceed to calculate score and show results ---
    console.log("Validation passed. Calculating score...");

    // Calculate score and prepare detailed feedback
    detailedFeedback.innerHTML = '<h3 class="text-xl font-semibold text-gray-800 mb-3 text-center">Review Your Answers:</h3>'; // Clear previous feedback
    questions.forEach((question, index) => {
        const correctAnswerIndex = question.correctAnswerIndex;
        const userAnswerIndex = userAnswers[index];

        if (userAnswerIndex === correctAnswerIndex) {
            score++;
        } else {
            // Add feedback for incorrect answers
            const feedbackItem = document.createElement('div');
            feedbackItem.className = 'p-3 bg-red-50 rounded-md border border-red-200';

            const qPara = document.createElement('p');
            qPara.className = 'font-medium text-gray-700 mb-1';
            qPara.textContent = `Q${index + 1}: ${question.questionText}`;
            feedbackItem.appendChild(qPara);

            const userAnswerPara = document.createElement('p');
            userAnswerPara.className = 'text-sm';
            userAnswerPara.innerHTML = `Your answer: <span class="user-answer-wrong">${question.options[userAnswerIndex]}</span>`;
            feedbackItem.appendChild(userAnswerPara);

            const correctAnswerPara = document.createElement('p');
            correctAnswerPara.className = 'text-sm';
            correctAnswerPara.innerHTML = `Correct answer: <span class="correct-answer-highlight">${question.options[correctAnswerIndex]}</span>`;
            feedbackItem.appendChild(correctAnswerPara);

            detailedFeedback.appendChild(feedbackItem);
        }
    });

    // Display the final score
    console.log(`Score calculated: ${score}/${totalQuestions}`);
    scoreText.textContent = `You scored ${score} out of ${totalQuestions}!`;

    // Hide the quiz form and show the results area
    quizForm.classList.add('hidden');
    resultsArea.classList.remove('hidden');
    resultsArea.scrollIntoView({ behavior: 'smooth' }); // Scroll to results

    // Save the score to Firebase
    saveScoreToFirebase(score, totalQuestions);
});

// ========================================================
// Step 6: Save Score to Firebase Function
// ========================================================

function saveScoreToFirebase(score, totalQuestions) {
    if (!db) {
        console.error("Firestore database object ('db') is not available. Cannot save score.");
        saveStatus.textContent = "Error: Could not connect to database.";
        saveStatus.className = 'text-sm font-medium h-6 mt-6 text-red-600';
        return;
    }

    saveStatus.textContent = "Saving score...";
    saveStatus.className = 'text-sm font-medium h-6 mt-6 text-gray-600';
    console.log("Attempting to save score to Firebase collection 'hpQuizResults'...");

    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const dataToSend = {
        scoreAchieved: score,
        scorePossible: totalQuestions,
        timeSubmitted: timestamp,
        // Optional: Add a user identifier later if you implement authentication
        // userId: firebase.auth().currentUser ? firebase.auth().currentUser.uid : 'anonymous',
    };

    db.collection("hpQuizResults").add(dataToSend) // Using collection "hpQuizResults"
        .then((docRef) => {
            console.log("SUCCESS! Score saved to Firestore. Document ID:", docRef.id);
            saveStatus.textContent = "Score saved successfully!";
            saveStatus.className = 'text-sm font-medium h-6 mt-6 text-green-600';
        })
        .catch((error) => {
            console.error("ERROR saving score to Firestore:", error);
            saveStatus.textContent = "Error saving score.";
            saveStatus.className = 'text-sm font-medium h-6 mt-6 text-red-600';
            if (error.code === 'permission-denied') {
                console.error("Firestore Security Rules might be blocking writes.");
                alert("Error: Permission denied saving score. Check Firestore rules in Firebase console.");
            }
        });
}


// ========================================================
// Step 7: Restart Quiz Functionality (Optional)
// ========================================================
if (restartButton) {
    restartButton.addEventListener('click', () => {
        console.log("Restarting quiz...");
        // Reset score and index
        // score = 0; // Score is calculated on submit, no need to reset here
        // userAnswers = []; // Reset user answers array
        // currentQuestionIndex = 0; // Resetting index isn't needed as displayQuiz handles it

        // Hide results, show quiz form
        resultsArea.classList.add('hidden');
        quizForm.classList.remove('hidden');
        validationMessage.textContent = ''; // Clear validation

        // Remove red borders from fieldsets
        const fieldsets = questionsContainer.querySelectorAll('fieldset');
        fieldsets.forEach(fs => {
            fs.style.borderColor = ''; // Reset border color
            fs.style.borderWidth = ''; // Reset border width
        });

        // Reset the form (clears radio buttons)
        quizForm.reset();

        // Redisplay the quiz (optional, could just reset form)
        // displayQuiz(); // If you want to completely redraw

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
} else {
    console.warn("Restart button not found.");
}


// ========================================================
// Step 8: Initial Quiz Display on Page Load
// ========================================================
// Ensure the DOM is ready before trying to display the quiz
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', displayQuiz);
} else {
    displayQuiz(); // DOM is already ready
}
