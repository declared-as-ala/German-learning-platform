package com.linguabridge.backend.controller;

import com.linguabridge.backend.model.WordHintQuestion;
import com.linguabridge.backend.service.WordHintQuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wordhint")
@RequiredArgsConstructor
public class WordHintController {

    private final WordHintQuestionService service;

    @GetMapping
    public List<WordHintQuestion> getByLevel(
            @RequestParam String level,
            @RequestParam(defaultValue = "10") int num
    ) {
        return service.getRandomByDifficulty(level, num);
    }
}
