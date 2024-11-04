package com.sims.home.dashboard.controller;

import com.sims.home.dashboard.service.DashboardService;
import com.sims.home.dashboard.vo.InspSchdAndResultResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/")
    public String index() {
        return "home/dashboard/dashboard";
    }

    @GetMapping("/InspSchdAndResultResponse")
    @ResponseBody
    public ResponseEntity<InspSchdAndResultResponse> selectInspSchdAndResult() {
        return new ResponseEntity<>(dashboardService.selectInspSchdAndResult(), HttpStatus.OK);
    }

}
