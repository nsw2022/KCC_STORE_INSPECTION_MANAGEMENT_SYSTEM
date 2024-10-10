package com.sims.qsc.store_inspection.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;

@Controller
@RequiredArgsConstructor
@RequestMapping("/qsc")
@Slf4j
public class StoreInspectionController {

    @Value("${naver.maps.client.id}")
    private String naverClientId;

    @GetMapping("/store_inspection")
    public String showInspectionSchedule(Model model) {
        model.addAttribute("naverClientId", naverClientId);
        return "qsc/store_inspection/store_inspection"; // JSP 경로
    }


    @GetMapping("/popup_page")
    public String openPopupPage() {
        return "qsc/store_inspection/popup_page"; // popup_page.jsp로 이동
    }

    @PostMapping("/popup_page_inspection")
    public String nextPage(Model model) {
        // 지금은 데이터가 필요 없으므로 바로 페이지 이동
        return "qsc/store_inspection/popup_page_inspection"; // JSP 경로
    }

    @PostMapping("/popup_middleCheck")
    public String middleCheck(Model model, @RequestParam("textareaData") String textareaData) {
        // 받은 textarea 데이터를 로그로 출력하거나 필요한 로직을 처리
        log.info("Received textarea data: " + textareaData);

        // model에 데이터를 담아 다음 페이지로 전달
        model.addAttribute("textareaData", textareaData);

        // popup_middleCheck.jsp로 이동
        return "qsc/store_inspection/popup_middleCheck";
    }


    @PostMapping("/popup_signature")
    public String moveToSignaturePage(Model model, @RequestParam Map<String, String> allParams) {
//        log.info("Received parameters: " + allParams);

        // 필드 값이 없을 때 기본값 설정
        String textareaData = allParams.getOrDefault("textareaData", "");
        model.addAttribute("textareaData", textareaData);

        // 다른 필요한 필드도 같은 방식으로 기본값 설정
        // model.addAttribute("otherField", allParams.getOrDefault("otherField", "default"));

        // popup_signature.jsp로 이동
        return "qsc/store_inspection/popup_signature";
    }


    @PostMapping("/popup_lastCheck")
    public String lastCheckInspection(Model model, @RequestParam Map<String, String> allParams) {
//        log.info("Received parameters for last check inspection: " + allParams);

        // 필요한 데이터를 가져와서 model에 추가
        String inspectionData = allParams.getOrDefault("inspectionData", "");  // 기본 값은 빈 문자열
        model.addAttribute("inspectionData", inspectionData);

        // 필요한 경우 추가적인 데이터를 처리하거나 model에 담기
        // model.addAttribute("otherData", "value");

        return "qsc/store_inspection/popup_lastCheck";  // JSP 경로
    }





}
