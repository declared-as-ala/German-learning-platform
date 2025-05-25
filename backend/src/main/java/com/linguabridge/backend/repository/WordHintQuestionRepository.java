package com.linguabridge.backend.repository;

import com.linguabridge.backend.model.WordHintQuestion;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface WordHintQuestionRepository extends MongoRepository<WordHintQuestion, String> {
    List<WordHintQuestion> findByDifficultyIgnoreCase(String difficulty);
}
