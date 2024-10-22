package com.sims.master.checklist_manage.controller;

import com.sims.master.checklist_manage.service.ChecklistService;
import com.sims.master.checklist_manage.vo.ChecklistResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@RequestMapping("/master")
@RequiredArgsConstructor
@Slf4j
public class ChecklistController {

    private final ChecklistService checklistService;

    @GetMapping("/checklist")
    public String selectChecklistPage(){
        return "master/checklist/list/checklist_list";
    }

    @GetMapping("/checklist/list")
    @ResponseBody
    public ResponseEntity<List<ChecklistResponse>> selectChecklistList(){

        return new ResponseEntity<List<ChecklistResponse>>(checklistService.selectChecklistAll(), HttpStatus.OK);
    }
<<<<<<< Updated upstream
=======

    @DeleteMapping("/checklist/delete/{chklstId}")
    public ResponseEntity<Integer> deleteChecklistByChklstId(@PathVariable int chklstId){
        return new ResponseEntity<Integer>(checklistService.deleteChecklistByChklstId(chklstId), HttpStatus.OK);
    }

>>>>>>> Stashed changes
}
