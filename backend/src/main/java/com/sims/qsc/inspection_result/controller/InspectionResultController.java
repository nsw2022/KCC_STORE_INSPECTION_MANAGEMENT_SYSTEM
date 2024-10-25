package com.sims.qsc.inspection_result.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.sims.qsc.inspection_result.service.InspectionResultService;
import com.sims.qsc.inspection_result.vo.InspectionResultResponse;
import com.sims.qsc.store_inspection_schedule.vo.StoreInspectionScheduleRequest;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequiredArgsConstructor
@RequestMapping("/qsc")
@Slf4j
public class InspectionResultController {
	
	private final InspectionResultService inspectionResultService;

	/**
	 * 요구사항 작업 - 가맹점 점검 결과 페이지
	 * @return
	 */
    @GetMapping("/inspection/result")
    public String inspectionResult() {
    	Authentication auth = SecurityContextHolder.getContext().getAuthentication();
  	  	String username = auth.getName();
		
  	  	if(username.equals("anonymousUser")) {
			return "redirect:/login";
		}
		
        return "qsc/inspection_result/result_list";
    }
    
    /**
     * 요구사항 작업 - 가맹점 점검 결과 목록
     * @return List<InspectionResultResponse>
     */
    @ResponseBody
    @GetMapping("/inspection/result/list")
    public ResponseEntity<List<InspectionResultResponse>> selectInspectionResultList() {
    	Authentication auth = SecurityContextHolder.getContext().getAuthentication();
  	  	String username = auth.getName();
  	  	log.info("username = {}", username);
//  	  	String usernameCode = username.substring(0,1);
  	  	
  	  	List<InspectionResultResponse> list = inspectionResultService.selectInspectionResultList(username);
  	  	log.info("list = {} ", list);
  	  	if(list.isEmpty()) {
  	  		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
  	  	} else {
  	  		return new ResponseEntity<>(list, HttpStatus.OK);
  	  	}
  	  
    }

    @PostMapping("/popup_inspection_result")
    public String openInspectionPopup(@RequestParam("inspectionContent") String content, Model model) {
        // content 데이터를 모델에 담아 팝업으로 넘김
        model.addAttribute("content", content);
        return "qsc/inspection_result/popup_inspection_result"; // 팝업 창으로 이동
    }
}
