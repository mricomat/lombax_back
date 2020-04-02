package com.lombax.controller;

import com.lombax.data.CoverModel;
import com.lombax.service.cover.CoverService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.util.UriComponents;

@RestController
@RequestMapping("/covers")
public class CoverController {

    private static final Logger LOGGER = LoggerFactory.getLogger(CoverController.class);

    @Autowired
    private CoverService coverService;

    @RequestMapping(method = RequestMethod.POST, value = "/save", produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<?> saveCover(@RequestBody CoverModel coverModel) {
        CoverModel cover = coverService.save(coverModel);
        final UriComponents uriComponents = ServletUriComponentsBuilder
                .fromCurrentServletMapping().path("/covers/{id}").buildAndExpand(cover.getId());
        return ResponseEntity.created(uriComponents.toUri()).body(cover);
    }

    @RequestMapping(method = RequestMethod.POST, value = "/update", produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<?> updateCover(@RequestParam String id, @RequestParam String key, @RequestParam Object value) {
        CoverModel result = coverService.update(id, key, value);
        return ResponseEntity.ok(result);
    }

}
