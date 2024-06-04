const allTopics = document.getElementById('allTopics');
const quizSec = document.getElementById('quiz-section');

const GEN_KNOWLEDGE = 'gen-know';
const ENTERTAINMENT = 'entertain';
const SCIENCE = 'science&tech';
const INFO_TECH = 'info-tech';
const ART = 'art-cate';
const CELEBRITIES = 'celebrities-cate';

let QUIZ_POINTS = 0;
let QUESTIONS_PASSED = 0;
const POINT_PER_QUESTION = 10;


function getQuiz(url){
    return fetch(url).then(response=>{
        if(response.status >= 200 && response.status <=300){
            return response.json();
        }else{
            throw new Error('Something went wrong!')
        }
    }).catch(()=>{
        throw new Error('Sorry, an unexpected error has occurred. Try restarting the page!')
    })
}

function quizTimer(){
    let seconds = 120;
    const countDown = window.setInterval(()=>{
        const timeSec = document.getElementById('quiz-timer');
        timeSec.textContent = seconds;
        seconds--;

        if(seconds < 0){
            const timeExhaustedText = document.getElementById('time-exhausted');
            timeExhaustedText.classList.remove('hidden');
            timeExhaustedText.textContent = '⌛Your time has been exhausted';
            resultPopUp()
            quizResult()
            window.clearInterval(countDown)
            timeSec.textContent = 0;
        }
    }, 1000);
}


function quizBank(response){
    const allQuestions = response.results
    allQuestions.forEach((question, index)=>{
        const questionElement = document.createElement('div');
        questionElement.classList = 'questionElement flex flex-col items-start justify-start gap-4';
        questionElement.innerHTML = `
        <div class="flex items-center gap-2">
        <p class="font-bold">${index+1}.</p>
        <p id="question" class="font-semibold">${question.question}</p>
      </div>
      <!--Options-->
      <div id="Q${index+1}" class="flex flex-col items-start justify-start gap-2">
        <div id="optionA" class="flex items-center gap-4">
          <div class="optionBox flex items-center py-1 px-3 rounded-md border border-black transition-colors delay-100  cursor-pointer select-none">A</div>
          <p></p>
        </div>
        <div id="optionB" class="flex items-center gap-4">
          <div class="optionBox flex items-center py-1 px-3 rounded-md border border-black transition-colors delay-100 cursor-pointer select-none">B</div>
          <p></p>
        </div>
        <div id="optionC" class="flex items-center gap-4">
          <div class="optionBox flex items-center py-1 px-3 rounded-md border border-black transition-colors delay-100 cursor-pointer select-none">C</div>
          <p></p>
        </div>
        <div id="optionD" class="flex items-center gap-4">
          <div class="optionBox flex items-center py-1 px-3 rounded-md border border-black transition-colors delay-100 cursor-pointer select-none">D</div>
          <p></p>
        </div>
      </div>
        `
        //Option A
        const optionA = questionElement.querySelector('#optionA');
        const answerA = optionA.querySelector('p');
        answerA.textContent = question.correct_answer;
        //Option B
        const optionB = questionElement.querySelector('#optionB');
        const answerB = optionB.querySelector('p');
        //Option C
        const optionC = questionElement.querySelector('#optionC');
        const answerC = optionC.querySelector('p');
        //Option D
        const optionD = questionElement.querySelector('#optionD');
        const answerD = optionD.querySelector('p');
        let num = 0;
        for(const ans of question.incorrect_answers){
            num+=1;
            if(num == 1){
                answerB.textContent = ans;
            }else if(num == 2){
                answerC.textContent = ans;
            }else if(num == 3){
                answerD.textContent = ans;
            } 
        }
        quizSec.append(questionElement)
        const element = document.getElementById(`Q${index+1}`)
        quizManager(element, questionElement)
    })

    //Form button
    const formBtn = document.createElement('button');
    formBtn.id = 'submit-quiz-btn';
    formBtn.type = 'button';
    formBtn.classList = 'px-6 py-2 border md:max-w-40 border-black rounded-md flex items-center justify-center hover:bg-green-600 hover:border-none hover:text-white transition-colors delay-100 cursor-pointer select-none';
    formBtn.textContent = 'Submit quiz';
    quizSec.append(formBtn)
    submitQuizModal()
}


async function quizQuestions(category){
    const quizTitle = quizSec.querySelector('#quiz-title');
    if(category === GEN_KNOWLEDGE){
        const response = await getQuiz('https://opentdb.com/api.php?amount=20&category=9&difficulty=easy&type=multiple');
        quizTitle.textContent = 'General Knowledge';
        quizBank(response)
    }else if(category === ENTERTAINMENT){
        const response = await getQuiz('https://opentdb.com/api.php?amount=20&category=11&difficulty=easy&type=multiple');
        quizTitle.textContent = 'Entertainment';
        quizBank(response)
    }else if(category === SCIENCE){
        const response = await getQuiz('https://opentdb.com/api.php?amount=20&category=17&difficulty=easy&type=multiple');
        quizTitle.textContent = 'Science & Nature';
        quizBank(response) 
    }else if(category === INFO_TECH){
        const response = await getQuiz('https://opentdb.com/api.php?amount=20&category=18&difficulty=easy&type=multiple');
        quizTitle.textContent = 'Information Technology';
        quizBank(response) 
    }else if(category === ART){
        const response = await getQuiz('https://opentdb.com/api.php?amount=20&category=21&difficulty=easy&type=multiple');
        quizTitle.textContent = 'Sports';
        quizBank(response) 
    }else if(category === CELEBRITIES){
        const response = await getQuiz('https://opentdb.com/api.php?amount=20&category=22&difficulty=easy&type=multiple');
        quizTitle.textContent = 'Geography';
        quizBank(response) 
    }
}

function quizManager(element, parentElement){
    const allOptions = element.querySelectorAll('.optionBox');
    allOptions.forEach((option)=>{
        option.addEventListener('click', ()=>{
            allOptions.forEach((button)=>{
                button.classList.remove('changeColor')
                button.parentElement.classList.remove('chosen-answer')
                parentElement.classList.remove('question-answered')
            })
            option.parentElement.classList.add('chosen-answer')
            option.classList.add('changeColor')
            parentElement.classList.add('question-answered')

            //Quiz response
            quizResponse(option)
        })
    })
}

function quizResponse(optionBox){
    const chosenOption = optionBox.parentElement;
    if(chosenOption.id === 'optionA' && chosenOption.classList.contains('chosen-answer')){
        QUIZ_POINTS +=POINT_PER_QUESTION
        QUESTIONS_PASSED +=1
    }else if(chosenOption.id === 'optionA' && chosenOption.classList.contains('chosen-answer') == false){
        QUIZ_POINTS -=POINT_PER_QUESTION
        QUESTIONS_PASSED -=1
    }

}

function startQuiz(){
    const allStartQuizBtn = document.querySelectorAll('.start-quiz');
    const startTimer = document.getElementById('start-quiz-btn');
    const endQuizBtn = document.getElementById('end-quiz-btn');
    allStartQuizBtn.forEach((startQuizBtn)=>{
        startQuizBtn.addEventListener('click', ()=>{
            //Quiz questions to display
            const category = startQuizBtn.parentElement.id
            quizQuestions(category).then(()=>{
                allTopics.classList.toggle('hidden');
                quizSec.classList.toggle('hidden');
                quizSec.classList.toggle('flex');
                startTimer.addEventListener('click', ()=>{
                    quizTimer()
                    startTimer.classList.remove('flex');
                    startTimer.classList.add('hidden');
                    endQuizBtn.classList.remove('hidden');
                    endQuizBtn.classList.add('flex');
                })
            }).catch((error)=>{
                alert(error)
            })
        })
    })
}
startQuiz()

function questionsAnsweredChecker(){
    let result;
    const allQuestions = document.querySelectorAll('.questionElement');
    allQuestions.forEach((question)=>{
        if(question.classList.contains('question-answered')){
            result = true;
        }else{
            question.classList.add('errorColor')
            result = false;
        }
    })
    return result;
}

function submitPopUp(){
    const checker = questionsAnsweredChecker()
    if(checker == true){
        const submitModal = document.getElementById('submit-modal');
        submitModal.classList.toggle('hidden');
        submitModal.classList.toggle('flex');
    }else{
        alert('Sorry, you need to answer all questions before submiting the quiz!')
    }

}

function resultPopUp(){
    const resultModal = document.getElementById('result-modal');
    resultModal.classList.toggle('hidden');
    resultModal.classList.toggle('flex');

}

function submitQuizModal(){
    const submitBtn = document.getElementById('submit-quiz-btn');
    const endQuizBtn = document.getElementById('end-quiz-btn');
    submitBtn.addEventListener('click', submitPopUp)
    endQuizBtn.addEventListener('click', submitPopUp)
}


function cancelSubmitQuiz(){
    const cancelBtn = document.getElementById('cancel-submit');
    cancelBtn.addEventListener('click', submitPopUp)
}
cancelSubmitQuiz()

function quizResult(){
    const quizScore = document.getElementById('quiz-score');
    const questionsPassed = document.getElementById('questions-passed');
    const quizRemark = document.getElementById('quiz-remark');
    
    //Show quiz score
    const totalQuizPoints = POINT_PER_QUESTION * 20;
    quizScore.innerHTML = `You scored <b>${QUIZ_POINTS}pts</b> out of <b>${totalQuizPoints}pts</b>`
    questionsPassed.textContent = `Questions passed: ${QUESTIONS_PASSED}/20`

    //Quiz Remark Conditions
    const excellentPoint = 70 / 100 * totalQuizPoints;
    const averagePoint = 50 / 100 * totalQuizPoints;
    let remark;
    if(QUIZ_POINTS >= excellentPoint){
        remark = '🎉Congratulations! Excellent performance';
        quizRemark.textContent = remark;
    }else if(QUIZ_POINTS >= averagePoint && QUIZ_POINTS < excellentPoint){
        remark = '🎉Congratulations! Average performance';
        quizRemark.textContent = remark;
    }else{
        remark = '😣Fair performance!';
        quizRemark.textContent = remark;
    }
}

function confirmSubmitQuiz(){
    const confirmBtn = document.getElementById('confirm-submit');
    confirmBtn.addEventListener('click', ()=>{
        resultPopUp()
        quizResult()
    })
}
confirmSubmitQuiz()





//function shuffleArray(array) {
//    for (let i = array.length - 1; i > 0; i--) {
//        const j = Math.floor(Math.random() * (i + 1));
//        [array[i], array[j]] = [array[j], array[i]];
//    }
//    return array;
//}