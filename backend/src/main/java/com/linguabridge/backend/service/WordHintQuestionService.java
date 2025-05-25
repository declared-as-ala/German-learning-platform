package com.linguabridge.backend.service;

import com.linguabridge.backend.model.WordHintQuestion;
import com.linguabridge.backend.repository.WordHintQuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WordHintQuestionService {

    private final WordHintQuestionRepository repository;

    public List<WordHintQuestion> getRandomByDifficulty(String difficulty, int num) {
        List<WordHintQuestion> list = repository.findByDifficultyIgnoreCase(difficulty);
        Collections.shuffle(list);
        return list.stream().limit(num).toList();
    }

    public List<WordHintQuestion> getAll() {
        return repository.findAll();
    }

    public WordHintQuestion save(WordHintQuestion question) {
        return repository.save(question);
    }

    public void delete(String id) {
        repository.deleteById(id);
    }
}
