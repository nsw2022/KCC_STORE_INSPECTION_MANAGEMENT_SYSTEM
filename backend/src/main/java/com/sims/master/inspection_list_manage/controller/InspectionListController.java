package com.sims.master.inspection_list_manage.controller;

import com.sims.master.inspection_list_manage.service.InspectionListManageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
@RequestMapping("/master")
@RequiredArgsConstructor
@Slf4j
public class InspectionListController {

    private final InspectionListManageService inspectionListService;

    @GetMapping("/inspection-list-manage/{chklst-id}")
    public String getInspectionListManagePage(@PathVariable (value = "chklst-id")String chklistId, Model model){
        model.addAttribute("chklstId", chklistId);
        model.addAttribute("chklstNm", inspectionListService.selectChklstNmByChklstId(chklistId));

        return "master/checklist/inspection_list_manage/inspection_list_manage";
    }
    @GetMapping("/inspection-list-manage")
    public String getInspectionListManagePage(){

        return "master/checklist/inspection_list_manage/inspection_list_manage";
    }


}
