package com.linguabridge.backend.controller.admin;

import com.linguabridge.backend.model.WordHintQuestion;
import com.linguabridge.backend.service.WordHintQuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/wordhint")
@RequiredArgsConstructor
public class AdminWordHintController {

    private final WordHintQuestionService service;

    @GetMapping
    public List<WordHintQuestion> getAll() {
        return service.getAll();
    }

    @PostMapping
    public WordHintQuestion save(@RequestBody WordHintQuestion question) {
        return service.save(question);
    }

    @PutMapping("/{id}")
    public WordHintQuestion update(@PathVariable String id, @RequestBody WordHintQuestion question) {
        question.setId(id);
        return service.save(question);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
