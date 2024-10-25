package com.sims.qsc.inspection_result.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.sims.qsc.inspection_result.mapper.InspectionResultMapper;
import com.sims.qsc.inspection_result.vo.InspectionResultResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class InspectionResultServiceImpl implements InspectionResultService{
	
	private final InspectionResultMapper inspectionResultMapper;

	@Override
	public List<InspectionResultResponse> selectInspectionResultList(String currentMbrNo) {
		log.info("currentMbrNo = {}" , currentMbrNo);
		List<InspectionResultResponse> list = inspectionResultMapper.selectInspectionResultList(currentMbrNo);
		return list;
		
	}
	
	
}
