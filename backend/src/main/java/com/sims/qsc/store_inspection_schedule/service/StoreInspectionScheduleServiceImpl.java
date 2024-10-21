package com.sims.qsc.store_inspection_schedule.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.sims.qsc.store_inspection_schedule.mapper.StoreInspectionScheduleMapper;
import com.sims.qsc.store_inspection_schedule.vo.StoreInspectionSchedule;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class StoreInspectionScheduleServiceImpl implements StoreInspectionScheduleService{

	private final StoreInspectionScheduleMapper storeInspectionScheduleMapper;
	
	@Override
	public List<StoreInspectionSchedule> getScheduleList() throws Exception{
		List<StoreInspectionSchedule> list = storeInspectionScheduleMapper.getStoreInspectionSchedule();
		if(list.isEmpty()) {
			throw new Exception(" NOT FOUND!!!!!");
		}
		return list;
	}

	@Override
	public List<String> getInspectorList(){
		List<String> inspectors = storeInspectionScheduleMapper.getInspectorList();
		return inspectors;
	}

	@Override
	public List<StoreInspectionSchedule> getScheduleListByStoreNmAndInspPlanDt(String storeNm, String inspPlanDt){
		List<StoreInspectionSchedule> schedules = storeInspectionScheduleMapper.getStoreInspectionSchedule(storeNm, inspPlanDt);
		return schedules;
	}

	@Override
	public List<String> getInspectionTypeList() {
		List<String> inspectionTypeList = storeInspectionScheduleMapper.getInspectionType();
		return inspectionTypeList;
	}

	@Override
	public List<StoreInspectionSchedule> getScheduleListByMbrNoAndInspTypeCd(String inspMbrNo, String inspTypeCd, String svMbrNo) {
		List<StoreInspectionSchedule> filterSchedules = storeInspectionScheduleMapper.getStoreInspectionScheduleByFilter(inspMbrNo, inspTypeCd, svMbrNo);
		return filterSchedules;
	}

	@Override
	public List<String> getInspectorListByMbr(String svMbrNo, String inspMbrNo) {
		List<String> list = storeInspectionScheduleMapper.getInspectorList(svMbrNo, inspMbrNo);
		return list;
	}

	
}
