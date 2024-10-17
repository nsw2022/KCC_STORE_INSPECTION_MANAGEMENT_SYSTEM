package com.sims.qsc.store_inspection_schedule.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.sims.qsc.store_inspection_schedule.mapper.StoreInspectionScheduleMapper;
import com.sims.qsc.store_inspection_schedule.vo.StoreInspectionScheduleDao;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class StoreInspectionScheduleServiceImpl implements StoreInspectionScheduleService{

	private final StoreInspectionScheduleMapper storeInspectionScheduleMapper;
	
	@Override
	public List<StoreInspectionScheduleDao> getList() throws Exception{
		List<StoreInspectionScheduleDao> list = storeInspectionScheduleMapper.getStoreInspectionSchedule();
		if(list.isEmpty()) {
			throw new Exception(" NOT FOUND EXCEPTION !!!!!");
		}
		return list;
	}
	
}
