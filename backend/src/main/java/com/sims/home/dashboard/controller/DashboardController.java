package com.sims.home.dashboard.controller;

import com.sims.home.dashboard.service.DashboardService;
import com.sims.home.dashboard.vo.BsnSspnResponse;
import com.sims.home.dashboard.vo.InspSchdAndResultResponse;
import com.sims.home.dashboard.vo.PenaltyResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
/**
 * @Description 대쉬보드 관련 컨트롤러 클래스
 * @Author 유재원
 * @Date 2024.11.04
 */
@Controller
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    /**
     * 대쉬보드 페이지 호출
     * @return 대쉬보드 페이지
     */
    @GetMapping("/")
    public String index() {
        return "home/dashboard/dashboard";
    }

    /**
     * 점검 진행 현황 정보 조회
     * @return 점검 진행 현황
     */
    @GetMapping("/InspSchdAndResultResponse")
    @ResponseBody
    public ResponseEntity<InspSchdAndResultResponse> selectInspSchdAndResult() {
        return new ResponseEntity<>(dashboardService.selectInspSchdAndResult(), HttpStatus.OK);
    }

    /**
     * 패널티 가맹점 / 금액 조회
     * @return 패널티 가맹점, 금액
     */
    @GetMapping("/penalty")
    @ResponseBody
    public ResponseEntity<List<PenaltyResponse>> selectPenalty() {
        return new ResponseEntity<List<PenaltyResponse>>(dashboardService.selectPenalty(), HttpStatus.OK);
    }

    /**
     * 영업정지 가맹점 / 영업정지 일 조회
     * @return 영업정지 가맹점, 영업정지 일
     */
    @GetMapping("/bsnssnp")
    @ResponseBody
    public ResponseEntity<List<BsnSspnResponse>> selectBsnSspn() {
        return new ResponseEntity<List<BsnSspnResponse>>(dashboardService.selectBsnSspn(), HttpStatus.OK);
    }


}
