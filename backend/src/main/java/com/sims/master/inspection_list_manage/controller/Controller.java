package com.sims.master.inspection_list_manage.controller;

import org.springframework.web.bind.annotation.GetMapping;

@org.springframework.stereotype.Controller
public class Controller {

    @GetMapping("/inspection/list/manage")
    public String getInspectionListManagePage(){
        return "master/checklist/inspection_list_manage/inspection_list_manage";
    }
}
