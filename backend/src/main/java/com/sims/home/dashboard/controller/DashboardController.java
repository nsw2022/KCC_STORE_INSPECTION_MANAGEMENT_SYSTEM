package com.sims.home.dashboard.controller;

import com.sims.home.dashboard.service.DashboardService;
import com.sims.home.dashboard.vo.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
/**
 * @Description 대쉬보드 관련 컨트롤러 클래스
 * @Author 유재원
 * @Date 2024.11.04
 */
@Controller
@RequiredArgsConstructor
@Slf4j
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

    /**
     * 미완료 점검 조회
     * @return 미완료 점검
     */
    @GetMapping("/not-complete")
    @ResponseBody
    public ResponseEntity<List<NotCompleteResponse>> notComplete() {
        return new ResponseEntity<List<NotCompleteResponse>>(dashboardService.selectNotComplete(), HttpStatus.OK);
    }

    /**
     * 최근 점검 조회
     */
    @GetMapping("/recent-inspection")
    @ResponseBody
    public ResponseEntity<List<RecentInspResultResponse>> selectRecentInspResult(@RequestParam (value = "page-number") int pageNumber){
        log.info("pageNumber : {}", pageNumber);
        return new ResponseEntity<List<RecentInspResultResponse>>(dashboardService.selectRecentInspResult(pageNumber), HttpStatus.OK);
    }

}
