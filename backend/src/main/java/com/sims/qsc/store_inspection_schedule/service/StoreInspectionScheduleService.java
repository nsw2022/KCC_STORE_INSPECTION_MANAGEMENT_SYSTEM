package com.sims.qsc.store_inspection_schedule.service;

import java.util.List;

import com.sims.qsc.store_inspection_schedule.vo.StoreInspectionScheduleDao;

public interface StoreInspectionScheduleService {
	public List<StoreInspectionScheduleDao> getList() throws Exception;
}
