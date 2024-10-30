package com.sims.qsc.inspection_result.service;

import java.util.List;

import com.sims.qsc.inspection_result.vo.InspectionResultRequest;
import org.springframework.stereotype.Service;

import com.sims.qsc.inspection_result.mapper.InspectionResultMapper;
import com.sims.qsc.inspection_result.vo.InspectionResultDetailResponse;
import com.sims.qsc.inspection_result.vo.InspectionResultResponse;

import lombok.RequiredArgsConstructor;
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

	@Override
	public List<InspectionResultResponse> selectInspectionResultListBySearch(InspectionResultRequest request, String currentMbrNo) {
		List<InspectionResultResponse> list = inspectionResultMapper.selectInspectionResultBySearch(request, currentMbrNo);
		return list;
	}


}
