/**
 * js/ai-core.js
 * Purpose: Provides the state and functions for the Cognitive Mastery Console (CMC),
 * simulating the AI's training and mastery progression. This file is designed to be
 * imported as a module into the main ILP Terminal (index.html).
 *
 * This separation allows the CMC logic to be developed, versioned, and branched
 * independently on GitHub (e.g., branch: 'feature/ai-core-logic').
 */

// --- Global State for the CMC ---
let aiMasteryLevel = 1; // 1: Novice, 2: Proficient, 3: Master
let totalDataProcessed = 1500;
let errorRate = 0.55; // Initial high error rate (55%)

// Mapping mastery levels to readable strings
const MASTERY_MAP = {
    1: 'Novice (Needs Training)',
    2: 'Proficient (Stable)',
    3: 'Master (Optimized)'
};

// --- DOM Element Constants (Must match IDs in the main_terminal.html) ---
const AI_MASTERY_SPAN = document.getElementById('ai-mastery-level');
const AI_DATA_PROCESSED_SPAN = document.getElementById('ai-data-processed');
const AI_ERROR_RATE_SPAN = document.getElementById('ai-error-rate');
const TRAIN_AI_BUTTON = document.getElementById('train-ai-button');

// Get the main system's error logging function (from index.html)
const showConfirmationModal = window.showConfirmationModal;

/**
 * Exposes the current AI error rate globally so the main verification logic (in index.html)
 * can access it without coupling the modules.
 * @returns {number} The current AI error rate (as a percentage).
 */
window.getCurrentAIErrorRate = function() {
    return errorRate;
};

/**
 * Updates the visual dashboard of the Cognitive Mastery Console (CMC).
 */
function updateCMCDashboard() {
    if (AI_MASTERY_SPAN) {
        AI_MASTERY_SPAN.textContent = MASTERY_MAP[aiMasteryLevel];
        AI_DATA_PROCESSED_SPAN.textContent = totalDataProcessed.toLocaleString() + ' units';
        AI_ERROR_RATE_SPAN.textContent = errorRate.toFixed(2) + '% (' + (aiMasteryLevel === 3 ? 'Low' : 'High') + ')';
        
        // Update color based on status
        AI_ERROR_RATE_SPAN.classList.toggle('text-red-500', aiMasteryLevel < 3);
        AI_ERROR_RATE_SPAN.classList.toggle('text-green-500', aiMasteryLevel === 3);
    }
}

/**
 * Simulates an AI training session, improving mastery and reducing the error rate.
 */
function trainAISimulation() {
    if (!TRAIN_AI_BUTTON) return;

    // 1. Lock the button and provide feedback
    TRAIN_AI_BUTTON.textContent = 'Training... Please Wait';
    TRAIN_AI_BUTTON.disabled = true;
    
    // Simulate training time (e.g., 1.5 seconds)
    setTimeout(() => {
        // Increment metrics based on training success
        totalDataProcessed += 5000;
        
        // Progress the mastery level
        if (aiMasteryLevel === 1) {
            aiMasteryLevel = 2; // Move to Proficient
            errorRate = 0.25; // Reduce error rate significantly
        } else if (aiMasteryLevel === 2) {
            aiMasteryLevel = 3; // Move to Master
            errorRate = 0.05; // Final optimized error rate
        } else if (aiMasteryLevel === 3) {
             // Already maxed, no change
        }

        updateCMCDashboard();
        
        if (aiMasteryLevel === 3) {
            showConfirmationModal(`AI Training Complete! Mastery is now: ${MASTERY_MAP[aiMasteryLevel]}. Maximum efficiency reached.`, true);
        } else {
             showConfirmationModal(`AI Training Complete! Mastery is now: ${MASTERY_MAP[aiMasteryLevel]}`, true);
        }
        
        // Unlock button only if main system is still ON
        const MASTER_TOGGLE = document.getElementById('master-toggle');
        if (MASTER_TOGGLE && MASTER_TOGGLE.checked) {
             TRAIN_AI_BUTTON.textContent = 'TRAIN AI SIMULATION';
             TRAIN_AI_BUTTON.disabled = false;
        }

    }, 1500); // 1.5 seconds simulated training
}

// --- Initialization ---\

/**
 * Initializes the Cognitive Mastery Console by binding events and showing initial state.
 * This function is exposed to the main application (index.html) to be called once its DOM is ready.
 */
window.initializeCMC = () => {
    // Check if the button exists and attach the event listener
    if (TRAIN_AI_BUTTON) {
        TRAIN_AI_BUTTON.addEventListener('click', trainAISimulation);
    }
    // Set the initial state of the dashboard
    updateCMCDashboard();
};

// If the main index.html file loads this module after DOMContentLoaded, we call the initializer immediately.
// Otherwise, the main file will call window.initializeCMC() when the master toggle is turned ON.
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    window.initializeCMC();
}