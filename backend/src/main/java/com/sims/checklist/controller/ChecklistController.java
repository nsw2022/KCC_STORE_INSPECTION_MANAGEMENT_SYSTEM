package com.sims.checklist.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ChecklistController {

    @GetMapping("/checklist/list")
    public String getChecklistListPage(){
        return "checklist/list/checklist_list";
    }
}
