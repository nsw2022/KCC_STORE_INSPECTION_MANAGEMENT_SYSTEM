package com.sims.master.checklist_manage.controller;

import com.sims.master.checklist_manage.service.ChecklistService;
import com.sims.master.checklist_manage.vo.ChecklistVo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@RequestMapping("/master")
@RequiredArgsConstructor
public class ChecklistController {

    private final ChecklistService checklistService;

    @GetMapping("/checklist")
    public String getChecklistPage(){
        return "master/checklist/list/checklist_list";
    }

    @GetMapping("/checklist/list")
    @ResponseBody
    public ResponseEntity<List<ChecklistVo>> getChecklistList(){

        return new ResponseEntity<List<ChecklistVo>>(checklistService.getChecklistAll(), HttpStatus.OK);
    }
}
