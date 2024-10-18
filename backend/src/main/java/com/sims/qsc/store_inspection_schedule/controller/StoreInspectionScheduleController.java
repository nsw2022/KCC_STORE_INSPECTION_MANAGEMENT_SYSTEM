package com.sims.qsc.store_inspection_schedule.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.sims.qsc.store_inspection_schedule.service.StoreInspectionScheduleService;
import com.sims.qsc.store_inspection_schedule.vo.StoreInspectionScheduleDao;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("/qsc")
@Slf4j
@RequiredArgsConstructor
public class StoreInspectionScheduleController {
   
	private final StoreInspectionScheduleService storeInspectionScheduleService;
	
   @GetMapping("/store_inspection_schedule")
   public String store_inspection_schedule() {
      return "qsc/store_inspection_schedule/store_inspection_schedule";
   }

   @ResponseBody
   @GetMapping("/schedule")
   public ResponseEntity<List<StoreInspectionScheduleDao>> storeInspectionScheduleList() throws Exception {
	   List<StoreInspectionScheduleDao> list = storeInspectionScheduleService.getList();
	   if(list.isEmpty()) {
		   return new ResponseEntity<List<StoreInspectionScheduleDao>>(HttpStatus.BAD_REQUEST);
	   } else {
		   return new ResponseEntity<>(list, HttpStatus.OK);
	   }	
	   
   }
}
	


