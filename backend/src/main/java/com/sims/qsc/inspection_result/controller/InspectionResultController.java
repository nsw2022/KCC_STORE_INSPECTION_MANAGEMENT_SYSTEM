package com.sims.qsc.inspection_result.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequiredArgsConstructor
@RequestMapping("/qsc")
@Slf4j
public class InspectionResultController {

    @GetMapping("/result_list")
    public String inspectionResult() {
        return "qsc/inspection_result/result_list";
    }

    @PostMapping("/popup_inspection_result")
    public String openInspectionPopup(@RequestParam("inspectionContent") String content, Model model) {
        // content 데이터를 모델에 담아 팝업으로 넘김
        model.addAttribute("content", content);
        return "qsc/inspection_result/popup_inspection_result"; // 팝업 창으로 이동
    }
}
