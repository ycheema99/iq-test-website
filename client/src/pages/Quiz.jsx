
import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import QuizQuestionOptions from '../QuizQuestionOptions';
import styles from '../Quiz.module.css';

function Quiz() {
    let { id } = useParams(); // This captures the :id from the URL
    let navigate = useNavigate();

    const [quiz, setQuiz] = useState();//holds quiz data
    const [currQuestion, setCurrQuestion] = useState(0); //holds index of question to be currently displayed
    const [answers, setAnswers] = useState([]); //holds user answers to questions for quiz 


    console.log(`answers: ${answers}`)
    useEffect(() => {
        const fetchProblemSets = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/problemsets/${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log(`data for quiz ${data._id}: ${data}`)
                setQuiz(data);
            } catch (err) {
                console.error("Fetch error:", err);
            }
        };

        fetchProblemSets();
    }, [id]);



    const previousQuestion = () => {
        if (currQuestion > 0) {

            setCurrQuestion(currQuestion - 1)
        }
    }

    const nextQuestion = () => {
        if (currQuestion < quiz.questions.length - 1) {

            setCurrQuestion(currQuestion + 1)
        }
    }

    const checkAnswers = () => {

        if (answers.length < quiz.questions.length) {
            alert("must complete all questions before submitting.")
            return null;
        }

        let newScore = 0;

        quiz.questions.forEach((question, index) => {
            // Assuming the 'answers' array stores the index of the selected option
            // And 'question.answer' is the index of the correct answer
            if (parseInt(answers[index]) === question.answer) {
                newScore += 1;
            }
        });


        navigate(`/quiz/${id}/result`, { state: { score: newScore, total: quiz.questions.length } });
        // To see the updated score, use useEffect or another method
    }

    return (
        <div>


            {quiz ? (
                <>
                    <div className={styles.quizContainerParent}>
                        <div className={styles.quizContainer} >
                            <h3>{quiz.questions[currQuestion].question}</h3>

                            <QuizQuestionOptions
                                options={quiz.questions[currQuestion].options}
                                answers={answers}
                                setAnswers={setAnswers}
                                questionIndex={currQuestion}
                            />

                            <div>
                                <button onClick={previousQuestion}>previous question</button>
                                <button onClick={nextQuestion}>next question</button>
                                {currQuestion === quiz.questions.length - 1 ? <button onClick={checkAnswers}>Submit Quiz</button> : null}
                            </div>
                        </div>
                    </div>

                </>
            ) : null
            }




        </div >
    );

}



export default Quiz;