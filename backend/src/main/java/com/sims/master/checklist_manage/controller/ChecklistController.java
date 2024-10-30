package com.sims.master.checklist_manage.controller;

import com.sims.master.checklist_manage.service.ChecklistService;
import com.sims.master.checklist_manage.vo.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @Description 체크리스트 관리 컨트롤러 클래스
 * @Author 유재원
 * @Date 2024.10.23
 */
@Controller
@RequestMapping("/master")
@RequiredArgsConstructor
@Slf4j
public class ChecklistController {

    private final ChecklistService checklistService;

    /**
     * 체크리스트 관리 페이지 호출
     * @return 체크리스트 페이지 경로
     */
    @GetMapping("/checklist")
    public String selectChecklistPage(){
        return "master/checklist/list/checklist_list";
    }

    /**
     * 체크리스트 전체 목록 조회
     * @return 체크리스트 전체 목록 리스트
     */
    @PostMapping("/checklist/list")
    @ResponseBody
    public ResponseEntity<List<ChecklistResponse>> selectChecklistList(@RequestBody ChecklistRequest checklistRequest){
        log.info("checklistRequest : {}", checklistRequest);
        return new ResponseEntity<List<ChecklistResponse>>(checklistService.selectChecklistAll(checklistRequest), HttpStatus.OK);
    }
    /**
     * 체크리스트 삭제
     * @param checklistDeleteRequest 체크리스트 삭제 요청 리스트
     * @return 상태코드
     */
    @DeleteMapping("/checklist/delete")
    @ResponseBody
    public ResponseEntity deleteChecklistByChklstId(@RequestBody List<ChecklistDeleteRequest> checklistDeleteRequest) {
        if (checklistService.deleteChecklistByChklstId(checklistDeleteRequest) > 0)
            return new ResponseEntity(HttpStatus.OK);
        else
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
    }
    /**
     * 체크리스트 옵션 목록 조회
     * @return 체크리스트 옵션 리스트(브랜드 이름 리스트, 점검유형 이름 리스트, 체크리스트 이름 리스트)
     */
    @GetMapping("/checklist/options")
    @ResponseBody
    public ResponseEntity<ChecklistOptionsResponse> selectChecklistOptions(){
        return new ResponseEntity<ChecklistOptionsResponse>(checklistService.selectChecklistOptions(), HttpStatus.OK);
    }

    /**
     * 체크리스트 저장 / 수정
     * @return 상태코드
     */
    @PostMapping("/checklist/save")
    public ResponseEntity<?> insertOrUpdateChecklist(@RequestBody List<ChecklistRequest> checklistRequests){

        checklistService.insertOrUpdateChecklist(checklistRequests);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * 체크리스트 미리보기
     * @param chklstNm 체크리스트 이름
     * @return 체크리스트(분류, 평가항목, 선택지)
     */
    @GetMapping("/checklist/detail/{chklst-nm}")
    @ResponseBody
    public ResponseEntity<ChecklistPreviewResponse> selectChecklistDetail(@PathVariable("chklst-nm") String chklstNm){
        log.info("chklstNm = {}", chklstNm);
        return new ResponseEntity<ChecklistPreviewResponse>(checklistService.getComplianceData(chklstNm), HttpStatus.OK);
    }

}
