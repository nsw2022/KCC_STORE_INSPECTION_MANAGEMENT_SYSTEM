package com.sims.qsc.store_inspection.controller;

import com.sims.qsc.store_inspection.service.StoreInspectionService;
import com.sims.qsc.store_inspection.vo.StoreInspectionResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;
import java.util.Objects;

@Controller
@RequiredArgsConstructor
@RequestMapping("/qsc")
@Slf4j
public class StoreInspectionController {

    private final StoreInspectionService storeInspectionService;

    @Value("${naver.maps.client.id}")
    private String naverClientId;

    @GetMapping("/store-inspection")
    public String selectInspectionSchedule(Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        log.info("여기는 사용자 이름입니다 = {}", username);

        // 역할 결정 (A: 관리자, P: 품질관리자, S: SV, C: 점검자)
        char roleChar = username.charAt(0);
        String userRole;
        switch(roleChar) {
            case 'A':
                userRole = "ADMIN";
                break;
            case 'P':
                userRole = "QUALITY_MANAGER";
                break;
            case 'S':
                userRole = "SV";
                break;
            case 'C':
                userRole = "INSPECTOR";
                break;
            default:
                userRole = "UNKNOWN";
        }

        model.addAttribute("username", username);
        model.addAttribute("userRole", userRole);

        model.addAttribute("naverClientId", naverClientId);

        return "qsc/store_inspection/store-inspection"; // JSP 경로
    }

    // 점검페이지 -> 점검시작팝업페이지
    @GetMapping("/popup-page")
    public String openPopupPage(
            @RequestParam("chklstId") String chklstId,
            @RequestParam("storeNm") String storeNm,
            @RequestParam("inspPlanDt") String inspPlanDt,
            Model model) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        log.info("팝업 페이지 접근 사용자: {}", username);

        // chklstId로 검사 데이터를 가져옴
        StoreInspectionResponse inspection = storeInspectionService.selectInspectionByChklstId(chklstId, storeNm, inspPlanDt);

        // mbrNo와 username을 비교하여 접근 권한 확인
        String mbrNo = inspection.getMbrNo();
        if (!Objects.equals(username, mbrNo)) {
            log.info("사용자 {}는 chklstId {}에 접근할 권한이 없습니다.", username, chklstId);
            inspection = null;
        }

        // 검사 데이터 모델에 추가
        model.addAttribute("inspection", inspection);
        model.addAttribute("naverClientId", naverClientId);
        model.addAttribute("username", username);

        return "qsc/store_inspection/popup-page"; // popup-page.jsp로 이동
    }

    //점검페이지 -> 점검결과팝업페이지
    @GetMapping("/popup_inspection_result")
    public String showInspectionResult(Model model) {
        // 필요한 데이터 처리 및 모델에 추가
        return "qsc/inspection_result/popup_inspection_result"; // 반환할 뷰의 이름
    }

    @GetMapping("/popup-page-inspection")
    public String nextPage(Model model) {
        // 지금은 데이터가 필요 없으므로 바로 페이지 이동
        return "qsc/store_inspection/popup-page-inspection"; // JSP 경로
    }

    @GetMapping("/popup-middleCheck")
    public String middleCheck(Model model) {

        // popup_middleCheck.jsp로 이동
        return "qsc/store_inspection/popup-middleCheck";
    }


    @GetMapping("/popup-signature")
    public String moveToSignaturePage(Model model) {

        return "qsc/store_inspection/popup-signature";
    }


    @PostMapping("/popup_lastCheck")
    public String lastCheckInspection(Model model, @RequestParam Map<String, String> allParams) {

        // 필요한 데이터를 가져와서 model에 추가
        String inspectionData = allParams.getOrDefault("inspectionData", "");  // 기본 값은 빈 문자열
        model.addAttribute("inspectionData", inspectionData);

        return "qsc/store_inspection/popup_lastCheck";  // JSP 경로
    }
}
