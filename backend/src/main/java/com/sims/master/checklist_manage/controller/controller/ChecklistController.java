package com.sims.master.checklist_manage.controller.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ChecklistController {

    @GetMapping("/checklist/list")
    public String getChecklistListPage(){
        return "master/checklist/list/checklist_list";
    }
}
