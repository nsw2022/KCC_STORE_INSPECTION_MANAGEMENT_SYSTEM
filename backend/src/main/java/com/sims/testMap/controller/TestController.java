package com.sims.testMap.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@RequiredArgsConstructor
@Slf4j
public class TestController {
    @Value("${naver.maps.client.id}")
    private String naverClientId;

    @GetMapping("/test")
    public String test(Model model) {
        model.addAttribute("naverClientId", naverClientId);
        return "test";
    }

    @GetMapping("/pdfTest")
    public String pdfTest(Model model) {
        return "pdfTest";
    }

}
