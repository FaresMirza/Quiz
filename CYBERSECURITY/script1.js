// Fetch questions from Quiz2.json
fetch('Chapter1.json')
  .then(response => response.json())
  .then(data => {
    const questionsArray = Object.values(data);
    questionsArray.sort(() => Math.random() - 0.5); // Shuffle questions

    let currentQuestionIndex = 0;
    let correctAnswersCount = 0;
    let hasAnswered = false; // Track if the user has selected an answer
    let quizFinished = false; // Ensure the quiz is marked as finished only once

    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const progressElement = document.getElementById('progress');
    const messageElement = document.getElementById('message');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');

    // Load a question
    function loadQuestion(index) {
      if (quizFinished) return; // Prevent loading questions if the quiz is finished

      const questionData = questionsArray[index];
      hasAnswered = false; // Reset the answered state for the new question

      // Display question text without numbers or symbols at the beginning
      questionElement.textContent = questionData.question_text.replace(/^\d+[-.]\s*/, ''); // Remove numbers like "1-", "2.", etc.
      const options = Object.values(questionData.options).map(option =>
        option.replace(/^\d+[-.]\s*/, '') // Remove numbers and symbols from answers
      );

      options.sort(() => Math.random() - 0.5); // Shuffle options

      optionsElement.innerHTML = '';
      options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option; // Keep underscores as is
        button.addEventListener('click', () => {
          hasAnswered = true; // Mark as answered
          checkAnswer(option, questionData.correct_answer.replace(/^\d+[-.]\s*/, '')); // Remove numbers from correct answer
        });
        optionsElement.appendChild(button);
      });

      updateProgress();
      messageElement.textContent = ''; // Clear the message for the next question
    }

    // Update progress
    function updateProgress() {
      progressElement.textContent = `سؤال ${currentQuestionIndex + 1} من ${questionsArray.length}`;
    }

    // Check the answer
    function checkAnswer(selectedOption, correctAnswer) {
      const buttons = optionsElement.querySelectorAll('button');
      buttons.forEach(button => {
        if (button.textContent === correctAnswer) {
          button.classList.add('correct');
          if (button.textContent === selectedOption) {
            correctAnswersCount++;
            showEncouragement("أحسنتِ يا منمن! إجابة صحيحة 💪", "success");
          }
        } else if (button.textContent === selectedOption) {
          button.classList.add('incorrect');
          showEncouragement("لا بأس يا منمن، جربي مرة أخرى! ✨", "error");
        }
        button.disabled = true; // Disable all buttons
      });
    }

    // Show encouragement message
    function showEncouragement(message, type) {
      messageElement.textContent = message;
      if (type === "success") {
        messageElement.style.color = "#38ef7d"; // Green for correct answers
        messageElement.classList.add("bounce");
      } else if (type === "error") {
        messageElement.style.color = "#f85032"; // Red for incorrect answers
        messageElement.classList.add("shake");
      }

      // Remove animation class after it finishes
      setTimeout(() => {
        messageElement.classList.remove("bounce");
        messageElement.classList.remove("shake");
      }, 1000);
    }

    // Add navigation for next button
    nextButton.addEventListener('click', () => {
      if (!hasAnswered) {
        // Prevent moving forward if no answer is selected
        showEncouragement("يا منمن ❤️ يرجى الإجابة قبل الانتقال للسؤال التالي", "error");
        return;
      }
      if (currentQuestionIndex < questionsArray.length - 1) {
        currentQuestionIndex++;
        loadQuestion(currentQuestionIndex);
      } else {
        finishQuiz();
      }
    });

    // Add navigation for previous button
    prevButton.addEventListener('click', () => {
      if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion(currentQuestionIndex);
      } else {
        showEncouragement("لا يمكنك العودة أكثر من ذلك! 😊", "error");
      }
    });

    // Finish the quiz
    function finishQuiz() {
      if (quizFinished) return; // Prevent running this function multiple times
      quizFinished = true;

      // Clear the quiz interface
      questionElement.textContent = "اختبار منمن ❤️ انتهى!";
      optionsElement.innerHTML = '';
      progressElement.textContent = `إجاباتك الصحيحة: ${correctAnswersCount}`;
      messageElement.textContent = "منمن، أنتِ مبدعة! نحن فخورون بكِ جدًا! ❤️";
      messageElement.style.color = "#ff4e50";

      // Show animated heart only at the end of the quiz
    
    }

    // Start the quiz
    loadQuestion(currentQuestionIndex);
  })
  .catch(error => console.error('Error loading JSON:', error));