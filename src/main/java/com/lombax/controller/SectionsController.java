package com.lombax.controller;

import com.lombax.data.SectionModel;
import com.lombax.service.sections.SectionsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
@RequestMapping("/sections")
public class SectionsController {

    private static final Logger LOGGER = LoggerFactory.getLogger(SectionsController.class);

    @Autowired
    private SectionsService sectionsService;

    @GetMapping(value = "")
    ResponseEntity<?> getSections(@RequestParam(value = "userId", defaultValue = "") String userId, @RequestParam(value = "genre", defaultValue = "0") int genre) {
        ArrayList<SectionModel> result = sectionsService.getSections(userId, genre);
        return ResponseEntity.ok(result);
    }
}
