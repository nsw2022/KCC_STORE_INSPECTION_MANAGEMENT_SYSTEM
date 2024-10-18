package com.sims.master.checklist_manage.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/master")
public class ChecklistController {

    @GetMapping("/checklist/list")
    public String getChecklistListPage(){
        return "master/checklist/list/checklist_list";
    }
}
