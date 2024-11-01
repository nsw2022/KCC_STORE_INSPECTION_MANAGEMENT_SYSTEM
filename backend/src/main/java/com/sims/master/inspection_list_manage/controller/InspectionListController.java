package com.sims.master.inspection_list_manage.controller;

import com.sims.master.inspection_list_manage.service.InspectionListManageService;
import com.sims.master.inspection_list_manage.vo.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.Response;
import org.apache.ibatis.annotations.Delete;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import retrofit2.http.Path;

import java.util.List;

/**
 * @Description 점검 항목 관리 컨트롤러 클래스
 * @Author 유재원
 * @Date 2024.10.31
 */
@Controller
@RequestMapping("/master")
@RequiredArgsConstructor
@Slf4j
public class InspectionListController {

    private final InspectionListManageService inspectionListService;

    /**
     * 점검 항목 관리 페이지 호출
     * @param chklstId
     * @param model
     * @return 점검 항목 관리 페이지
     */
    @GetMapping("/inspection-list-manage")
    public String getInspectionListManagePage(@RequestParam (value = "chklst-id", required = false)String chklstId, Model model){
        if(chklstId != null){
            model.addAttribute("chklstId", chklstId);

            InspectionPageResponse response = inspectionListService.selectChklstNmByChklstId(chklstId);

            model.addAttribute("chklstNm", response.getChklstNm());
            model.addAttribute("masterChklstNm", response.getMasterChklstNm());
        }

        return "master/checklist/inspection_list_manage/inspection_list_manage";
    }

    /**
     * 대분류 목록 조회
     * @param chklistId
     * @return 대분류 목록
     */
    @GetMapping("/inspection-list-manage/ctg/{chklst-id}")
    @ResponseBody
    public ResponseEntity<List<CtgResponse>> selectCtg(@PathVariable (value = "chklst-id")String chklistId){
        log.info("chklistId : {}", chklistId);

        return new ResponseEntity<List<CtgResponse>>(inspectionListService.selectCtgByChklstId(chklistId), HttpStatus.OK);
    }

    /**
     * 중분류 목록 조회
     * @param chklistId
     * @param ctgNm
     * @return 중분류 목록
     */
    @GetMapping("/inspection-list-manage/sub-ctg/{chklst-id}")
    @ResponseBody
    public ResponseEntity<List<SubCtgResponse>> selectSubCtg(@PathVariable (value = "chklst-id")String chklistId, @RequestParam (value = "ctg-nm")String ctgNm){
        log.info("chklistId : {}", chklistId);
        log.info("ctgNm : {}", ctgNm);


        log.info("result = {}", inspectionListService.selectSubCtgByChklstIdAndCtgNm(chklistId, ctgNm));
        return new ResponseEntity<List<SubCtgResponse>>(inspectionListService.selectSubCtgByChklstIdAndCtgNm(chklistId, ctgNm), HttpStatus.OK);
    }

    /**
     * 평가항목 목록 조회
     * @param ctgId
     * @param ctgNm
     */
    @GetMapping("/inspection-list-manage/chklst-evit")
    @ResponseBody
    public ResponseEntity<List<EvitResponse>> selectEvit(@RequestParam (value = "ctg-id")String ctgId, @RequestParam (value = "ctg-nm")String ctgNm){
        log.info("ctgId : {}", ctgId);
        log.info("ctgNm : {}", ctgNm);

        return new ResponseEntity<>(inspectionListService.selectEvitByCtgNmAndCtgId(ctgId, ctgNm), HttpStatus.OK);
    }

    /**
     * 선택지 목록 조회
     * @param ctgId
     * @param evitNm
     * @return 선택지 목록
     */
    @GetMapping("/inspection-list-manage/evit-chclst")
    public ResponseEntity<List<ChclstResponse>> selectChclst(@RequestParam (value = "ctg-id")String ctgId, @RequestParam (value = "evit-nm")String evitNm){
        log.info("ctgId : {}", ctgId);
        log.info("evitNm : {}", evitNm);
        return new ResponseEntity<List<ChclstResponse>>(inspectionListService.selectEvitChclstByCtgIdAndEvitNm(ctgId, evitNm), HttpStatus.OK);
    }

    /**
     * 대분류 저장 / 수정
     * @param request
     * @return 대분류 저장 / 수정 결과
     */
    @PostMapping("/inspection-list-manage/ctg/submit")
    public ResponseEntity<?> insertOrUpdateCtg(@RequestBody List<CtgRequest> request){
        log.info("@@@@@@@@@@@@@@@@@@@@@@@@@request : {}", request.toString());

        if(inspectionListService.insertOrUpdateCtg(request) > 0) {
            return new ResponseEntity<>(HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 대분류 삭제
     * @param ctgId
     * @return 대분류 삭제 결과
     */
    @DeleteMapping("/inspection-list-manage/ctg/delete")
    public ResponseEntity<?> deleteCtg(@RequestParam (value = "ctg-id") List<String> ctgId){
        log.info("ctgId : {}", ctgId);
        if(inspectionListService.deleteCtg(ctgId) > 0) {
            return new ResponseEntity<>(HttpStatus.OK);
        } else{
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
