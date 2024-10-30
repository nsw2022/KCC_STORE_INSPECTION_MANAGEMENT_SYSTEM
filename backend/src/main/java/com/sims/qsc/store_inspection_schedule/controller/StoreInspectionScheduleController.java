package com.sims.qsc.store_inspection_schedule.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.sims.qsc.store_inspection_schedule.service.StoreInspectionScheduleService;
import com.sims.qsc.store_inspection_schedule.vo.StoreInspectionScheduleRequest;
import com.sims.qsc.store_inspection_schedule.vo.StoreInspectionScheduleResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("/qsc")
@Slf4j
@RequiredArgsConstructor

/**
 * @Description 가맹점 점검 일정 Controller
 * @author 원승언
 * @Date 2024.10.21
 *
 */
public class StoreInspectionScheduleController {
   
   private final StoreInspectionScheduleService storeInspectionScheduleService;

   /**
    * 요구사항 작업 - 가맹점 점검 일정 조회 페이지
    * @return 
    */
   @GetMapping("/store-inspection-schedule")
   public String store_inspection_schedule(Model model) {
	  Authentication auth = SecurityContextHolder.getContext().getAuthentication();
	  String username = auth.getName();
	  model.addAttribute("username", username);
	  if(username.equals("anonymousUser")) {
		  return "redirect:/login";
	  }
      return "qsc/store_inspection_schedule/store_inspection_schedule";
   }

   /**
    * 요구사항 작업 - 점검 일정 조회
    * 점검자들의 일정을 달력에서 볼 수 있게끔 한다.
    * @return 점검 일정 표시	
    * @throws Exception
    */
   @ResponseBody
   @GetMapping("/store-inspection-schedule/schedules")
   public ResponseEntity<?> storeInspectionScheduleList() throws Exception {
	   Authentication auth = SecurityContextHolder.getContext().getAuthentication();
	   String username = auth.getName();
	   String usernameCode = username.substring(0,1);
	   
	   if(usernameCode.equals("S")) {
		   List<StoreInspectionScheduleRequest> list = storeInspectionScheduleService.selectScheduleListByMbrNoAndInspTypeCd(null, null, username);
		   if(list.isEmpty()) {
			   return new ResponseEntity<>(HttpStatus.NOT_FOUND);		   
		   } else {
			   return new ResponseEntity<>(list, HttpStatus.OK);
		   }
	   } else if(usernameCode.equals("C")) {
		   List<StoreInspectionScheduleRequest> list = storeInspectionScheduleService.selectScheduleListByMbrNoAndInspTypeCd(username, null, null);
		   if(list.isEmpty()) {
			   return new ResponseEntity<>(HttpStatus.NOT_FOUND);		   
		   } else {
			   return new ResponseEntity<>(list, HttpStatus.OK);
		   }
	   } else {
		   List<StoreInspectionScheduleResponse> list = storeInspectionScheduleService.selectScheduleList();
		   if(list.isEmpty()) {
			   return new ResponseEntity<>(HttpStatus.NOT_FOUND);		   
		   } else {
			   return new ResponseEntity<>(list, HttpStatus.OK);
		   }
	   }
	   
   }
   
   /**
    * 요구사항 작업 - 점검자 조회
    * 모든 점검자들을 검색하는 필터에서 모든 점검자들을 보여준다.
    * @return 점검자 목록 표시
    * @throws Exception
    */
   @ResponseBody
   @GetMapping("/store-inspection-schedule/inspectors")
   public ResponseEntity<List<String>> inspectorsList() {
	   Authentication auth = SecurityContextHolder.getContext().getAuthentication();
	   String username = auth.getName();
	   String usernameCode = username.substring(0,1);
	   
	   if(usernameCode.equals("S")) {
		   List<String> list = storeInspectionScheduleService.selectInspectorListByMbr(username, null);
		   if(list.isEmpty()) {
			   return new ResponseEntity<>(HttpStatus.NOT_FOUND);		   
		   } else {
			   return new ResponseEntity<>(list, HttpStatus.OK);
		   }
	   } else if(usernameCode.equals("C")) {
		   List<String> list = storeInspectionScheduleService.selectInspectorListByMbr(null, username);
		   if(list.isEmpty()) {
			   return new ResponseEntity<>(HttpStatus.NOT_FOUND);		   
		   } else {
			   return new ResponseEntity<>(list, HttpStatus.OK);
		   }
	   } else {
		   List<String> list = storeInspectionScheduleService.selectInspectorList();
		   if(list.isEmpty()) {
			   return new ResponseEntity<>(HttpStatus.NOT_FOUND);		   
		   } else {
			   return new ResponseEntity<>(list, HttpStatus.OK);
		   }
	   }
	   
   }
   
   /**
    * 요구사항 작업 - 가맹점의 점검할 체크리스트 조회
    * 가맹점명과 점검일정을 통해 해당 가맹점의 점검 체크리스트들을 볼 수 있다.
    * @param storeNm			// 가맹점명
    * @param inspPlanDt			// 점검일정
    * @return 가맹점 & 점검일정을 통해서 점검사항 목록 표시
    */
   @ResponseBody
   @PostMapping("/store-inspection-schedule/chklst/{storeNm}/{inspPlanDt}")
   public ResponseEntity<List<StoreInspectionScheduleRequest>> storeChklstSchedule(@PathVariable("storeNm") String storeNm, @PathVariable("inspPlanDt") String inspPlanDt) {
	   List<StoreInspectionScheduleRequest> storeChklstSchdList = storeInspectionScheduleService.selectScheduleListByStoreNmAndInspPlanDt(storeNm, inspPlanDt);
	   if(storeChklstSchdList.isEmpty()) {
		   return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	   } else {
		   return new ResponseEntity<>(storeChklstSchdList, HttpStatus.OK);
	   }
   }
   
   /**
    * 요구사항 작업 - 점검유형 조회
    * 일정이 잡혀있는 체크리스트 들의 점검유형을 가져와 검색 영역에 보여줌
    * @return 점검유형 목록 표시 
    */
   @ResponseBody
   @GetMapping("/store-inspection-schedule/inspection-types")
   public ResponseEntity<List<String>> inspectionTypeList() {
	   Authentication auth = SecurityContextHolder.getContext().getAuthentication();
	   String username = auth.getName();
	   String usernameCode = username.substring(0,1);
	   
	   if(usernameCode.equals("S")) {
		   List<String> list = storeInspectionScheduleService.selectInspectionTypeList(username, null);
		   if(list.isEmpty()) {
			   return new ResponseEntity<>(HttpStatus.NOT_FOUND);		   
		   } else {
			   return new ResponseEntity<>(list, HttpStatus.OK);
		   }
	   } else if(usernameCode.equals("C")) {
		   List<String> list = storeInspectionScheduleService.selectInspectionTypeList(null, username);
		   if(list.isEmpty()) {
			   return new ResponseEntity<>(HttpStatus.NOT_FOUND);		   
		   } else {
			   return new ResponseEntity<>(list, HttpStatus.OK);
		   }
	   } else {
		   List<String> list = storeInspectionScheduleService.selectInspectionTypeList(null, null);
		   if(list.isEmpty()) {
			   return new ResponseEntity<>(HttpStatus.NOT_FOUND);		   
		   } else {
			   return new ResponseEntity<>(list, HttpStatus.OK);
		   }
	   }
   }
   
   /**
    * 요구사항 작업 - 점검자 검색
    * 점검자를 검색하면 그 점검자의 점검 일정을 조회해준다. 
    * @param  mbrNo	// 사원번호
    * @return 점검자 검색에 따라 일정 표시
    */
   @ResponseBody
   @PostMapping("/store-inspection-schedule/no/{mbrNo}")
   public ResponseEntity<List<StoreInspectionScheduleRequest>> storeInspectionScheduleByMbrNo(@PathVariable("mbrNo") String mbrNo) {
	   List<StoreInspectionScheduleRequest> list = storeInspectionScheduleService.selectScheduleListByMbrNoAndInspTypeCd(mbrNo, null, null);
	   if(list.isEmpty()) {
		 return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	   } else {
		   return new ResponseEntity<>(list, HttpStatus.OK);
	   }
   }
   
   /**
    * 요구사항 작업 - 점검유형 검색
    * 점검유형을 검색하면 그 점검 유형에 해당하는 점검 일정을 보여준다.
    * @param inspTypeCd		// 점검유형코드
    * @return 점검 유형에 따라 일정을 다르게 표시
    */
   @ResponseBody
   @PostMapping("/store-inspection-schedule/type/{inspTypeCd}")
   public ResponseEntity<List<StoreInspectionScheduleRequest>> storeInspectionScheduleByInspTypeCd(@PathVariable("inspTypeCd") String inspTypeCd) {
	   
	   Authentication auth = SecurityContextHolder.getContext().getAuthentication();
	   String username = auth.getName();
	   String usernameCode = username.substring(0,1);
	   
	   if(usernameCode.equals("S")) {
		   List<StoreInspectionScheduleRequest> list = storeInspectionScheduleService.selectScheduleListByMbrNoAndInspTypeCd(null, inspTypeCd, username);
		   if(list.isEmpty()) {
			   return new ResponseEntity<>(HttpStatus.NOT_FOUND);		   
		   } else {
			   return new ResponseEntity<>(list, HttpStatus.OK);
		   }
	   } else if(usernameCode.equals("C")) {
		   List<StoreInspectionScheduleRequest> list = storeInspectionScheduleService.selectScheduleListByMbrNoAndInspTypeCd(username, inspTypeCd, null);
		   if(list.isEmpty()) {
			   return new ResponseEntity<>(HttpStatus.NOT_FOUND);		   
		   } else {
			   return new ResponseEntity<>(list, HttpStatus.OK);
		   }
	   } else {
		   List<StoreInspectionScheduleRequest> list = storeInspectionScheduleService.selectScheduleListByMbrNoAndInspTypeCd(null, inspTypeCd, null);
		   if(list.isEmpty()) {
			   return new ResponseEntity<>(HttpStatus.NOT_FOUND);		   
		   } else {
			   return new ResponseEntity<>(list, HttpStatus.OK);
		   }
	   }
   }
   
   /**
    * 요구사항 작업 - 점검 유형 & 점검자 검색
    * 점검자와 점검유형을 검색하여 그 조건에 맞는 점검 일정을 보여준다.
    * @param mbrNo			// 사원번호 
    * @param inspTypeCd		// 점검유형코드
    * @return 점검유형과 점검자에 따라 점검 일정 다르게 표시
    */
   @ResponseBody
   @PostMapping("/store-inspection-schedule/search/{mbrNo}/{inspTypeCd}")
   public ResponseEntity<List<StoreInspectionScheduleRequest>> storeInspectionScheduleByInspTypeCd(@PathVariable("mbrNo") String mbrNo, @PathVariable("inspTypeCd") String inspTypeCd) {
	   List<StoreInspectionScheduleRequest> list = storeInspectionScheduleService.selectScheduleListByMbrNoAndInspTypeCd(mbrNo, inspTypeCd, null);
	   if(list.isEmpty()) {
		   return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	   } else {
		   return new ResponseEntity<>(list, HttpStatus.OK);
	   }
   }
   
   
}
	
