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
public class StoreInspectionScheduleController {
   
   private final StoreInspectionScheduleService storeInspectionScheduleService;

   /**
    * 가맹점 점검 일정 조회 페이지
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
    * 점검자들의 일정을 달력에서 볼 수 있게끔 한다.
    * @return List<StoreInspectionSchedule>	
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
    * 모든 점검자들을 검색하는 필터에서 모든 점검자들을 보여준다.
    * @return List<String>
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
    * 가맹점명과 점검일정을 통해 해당 가맹점의 점검 체크리스트들을 볼 수 있다.
    * @param storeNm
    * @param inspPlanDt
    * @return List<StoreInspectionSchedule>
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
    * 일정이 잡혀있는 체크리스트 들의 점검유형을 가져와 검색 영역에 보여줌
    * @return List<String> 
    */
   @ResponseBody
   @GetMapping("/store-inspection-schedule/inspection-types")
   public ResponseEntity<List<String>> inspectionTypeList() {
	   List<String> inspectionTypes =storeInspectionScheduleService.selectInspectionTypeList();
	   if(inspectionTypes.isEmpty()) {
		   return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	   } else {
		   return new ResponseEntity<>(inspectionTypes, HttpStatus.OK);
	   }
   }
   
   /**
    * 점검자를 검색하면 그 점검자의 점검 일정을 조회해준다. 
    * @param {string} mbrNo 사원번호
    * @return List<StoreInspectionSchedule>
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
    * 점검유형을 검색하면 그 점검 유형에 해당하는 점검 일정을 보여준다.
    * @param {string}inspTypeCd 점검유형코드
    * @return List<StoreInspectionSchedule>
    */
   @ResponseBody
   @PostMapping("/store-inspection-schedule/type/{inspTypeCd}")
   public ResponseEntity<List<StoreInspectionScheduleRequest>> storeInspectionScheduleByInspTypeCd(@PathVariable("inspTypeCd") String inspTypeCd) {
	   List<StoreInspectionScheduleRequest> list = storeInspectionScheduleService.selectScheduleListByMbrNoAndInspTypeCd(null, inspTypeCd, null);
	   if(list.isEmpty()) {
		   return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	   } else {
		   return new ResponseEntity<>(list, HttpStatus.OK);
	   }
   }
   
   /**
    * 점검자와 점검유형을 검색하여 그 조건에 맞는 점검 일정을 보여준다.
    * @param {string} mbrNo 사원번호 
    * @param {string} inspTypeCd 점검유형코드
    * @return List<StoreInspectionSchedule>
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
	
