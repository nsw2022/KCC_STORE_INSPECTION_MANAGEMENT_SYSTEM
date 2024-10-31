package com.sims.qsc.inspection_schedule.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/qsc")
public class InspectionScheduleController {

    @GetMapping("/inspection-schedule/schedule-list")
    public String inspectionSchedule() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        if(username.equals("anonymousUser")) {
            return "redirect:/login";
        }

        return "qsc/inspection-schedule/schedule-list";
    }


}
