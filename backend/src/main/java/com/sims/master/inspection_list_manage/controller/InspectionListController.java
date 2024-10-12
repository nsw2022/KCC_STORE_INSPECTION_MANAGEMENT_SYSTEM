package com.sims.master.inspection_list_manage.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
@RequestMapping("/master")
public class InspectionListController {

    @GetMapping("/inspection/list/manage")
    public String getInspectionListManagePage(){
        return "master/checklist/inspection_list_manage/inspection_list_manage";
    }


}
