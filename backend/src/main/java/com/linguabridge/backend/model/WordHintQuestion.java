package com.linguabridge.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Document(collection = "word_hint_questions")
public class WordHintQuestion {

    @Id
    private String id;

    @Field("sentence")
    private String sentence;

    @Field("translation")
    private String translation;

    @Field("scrambled_sentence")
    private String scrambledSentence;

    @Field("question_text")
    private String questionText;

    @Field("correct_answer")
    private String correctAnswer;

    @Field("wrong_answers")
    private List<String> wrongAnswers;

    @Field("difficulty")
    private String difficulty;

    @Field("score_value")
    private Integer scoreValue;

    public WordHintQuestion() {}

    public WordHintQuestion(String sentence, String translation, String scrambledSentence,
                             String questionText, String correctAnswer, List<String> wrongAnswers,
                             String difficulty, Integer scoreValue) {
        this.sentence = sentence;
        this.translation = translation;
        this.scrambledSentence = scrambledSentence;
        this.questionText = questionText;
        this.correctAnswer = correctAnswer;
        this.wrongAnswers = wrongAnswers;
        this.difficulty = difficulty;
        this.scoreValue = scoreValue;
    }

    // Getters & Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSentence() { return sentence; }
    public void setSentence(String sentence) { this.sentence = sentence; }

    public String getTranslation() { return translation; }
    public void setTranslation(String translation) { this.translation = translation; }

    public String getScrambledSentence() { return scrambledSentence; }
    public void setScrambledSentence(String scrambledSentence) { this.scrambledSentence = scrambledSentence; }

    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }

    public String getCorrectAnswer() { return correctAnswer; }
    public void setCorrectAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; }

    public List<String> getWrongAnswers() { return wrongAnswers; }
    public void setWrongAnswers(List<String> wrongAnswers) { this.wrongAnswers = wrongAnswers; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public Integer getScoreValue() { return scoreValue; }
    public void setScoreValue(Integer scoreValue) { this.scoreValue = scoreValue; }
}
