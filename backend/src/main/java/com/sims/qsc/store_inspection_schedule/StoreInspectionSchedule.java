package com.sims.qsc.store_inspection_schedule;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("/qsc")
@Slf4j
public class StoreInspectionSchedule {
	
	@GetMapping("/store_inspection_schedule")
	public String store_inspection_schedule() {
		return "qsc/store_inspection_schedule/store_inspection_schedule";
	}

}
