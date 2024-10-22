package com.sims.qsc.store_inspection_schedule.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.sims.qsc.store_inspection_schedule.mapper.StoreInspectionScheduleMapper;
import com.sims.qsc.store_inspection_schedule.vo.StoreInspectionScheduleRequest;
import com.sims.qsc.store_inspection_schedule.vo.StoreInspectionScheduleResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class StoreInspectionScheduleServiceImpl implements StoreInspectionScheduleService{

	private final StoreInspectionScheduleMapper storeInspectionScheduleMapper;
	
	@Override
	public List<StoreInspectionScheduleResponse> selectScheduleList() throws Exception{
		List<StoreInspectionScheduleResponse> list = storeInspectionScheduleMapper.selectStoreInspectionSchedule();
		if(list.isEmpty()) {
			throw new Exception(" NOT FOUND!!!!!");
		}
		return list;
	}

	@Override
	public List<String> selectInspectorList(){
		List<String> inspectors = storeInspectionScheduleMapper.selectInspectorList();
		return inspectors;
	}

	@Override
	public List<StoreInspectionScheduleRequest> selectScheduleListByStoreNmAndInspPlanDt(String storeNm, String inspPlanDt){
		List<StoreInspectionScheduleRequest> schedules = storeInspectionScheduleMapper.selectStoreInspectionSchedule(storeNm, inspPlanDt);
		return schedules;
	}

	@Override
	public List<String> selectInspectionTypeList() {
		List<String> inspectionTypeList = storeInspectionScheduleMapper.selectInspectionType();
		return inspectionTypeList;
	}

	@Override
	public List<StoreInspectionScheduleRequest> selectScheduleListByMbrNoAndInspTypeCd(String inspMbrNo, String inspTypeCd, String svMbrNo) {
		List<StoreInspectionScheduleRequest> filterSchedules = storeInspectionScheduleMapper.selectStoreInspectionScheduleByFilter(inspMbrNo, inspTypeCd, svMbrNo);
		return filterSchedules;
	}

	@Override
	public List<String> selectInspectorListByMbr(String svMbrNo, String inspMbrNo) {
		List<String> list = storeInspectionScheduleMapper.selectInspectorList(svMbrNo, inspMbrNo);
		return list;
	}

	
}
