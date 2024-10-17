package com.sims.qsc.store_inspection_schedule.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.sims.qsc.store_inspection_schedule.vo.StoreInspectionScheduleDao;



@Mapper
public interface StoreInspectionScheduleMapper {
	public List<StoreInspectionScheduleDao> getStoreInspectionSchedule();
}
