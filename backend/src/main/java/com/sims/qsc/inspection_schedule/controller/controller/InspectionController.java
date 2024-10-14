package com.sims.qsc.inspection_schedule.controller.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/qsc")
public class InspectionController {

    @GetMapping("/inspection_schedule/schedule_list")
    public void inspectionSchedule() {

    }


}
