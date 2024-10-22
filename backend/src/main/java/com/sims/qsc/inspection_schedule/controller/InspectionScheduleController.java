package com.sims.qsc.inspection_schedule.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/qsc")
public class InspectionScheduleController {

    @GetMapping("/inspection-schedule/schedule-list")
    public void inspectionSchedule() {

    }


}
