package com.sims.qsc.inspection_result.service;

import java.util.List;

import com.sims.config.Exception.CustomException;
import com.sims.config.Exception.ErrorCode;
import com.sims.qsc.inspection_result.vo.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.sims.qsc.inspection_result.mapper.InspectionResultMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class InspectionResultServiceImpl implements InspectionResultService{
	
	private final InspectionResultMapper inspectionResultMapper;



	@Override
	public List<InspectionResultResponse> selectInspectionResultList(InspectionResultRequest inspectionResultRequest, String currentMbrNo) {
		List<InspectionResultResponse> list = inspectionResultMapper.selectInspectionResultList(inspectionResultRequest, currentMbrNo);
		if(list.isEmpty()) {
			throw new CustomException(ErrorCode.NOT_FOUND);
		} else {
			return list;
		}
	}

	@Override
	public InspectionResultOptionResponse selectInspectionResultOptions() {
		List<String> brandNms = inspectionResultMapper.selectAllBrandNms();
		List<String> storeNms = inspectionResultMapper.selectAllStoreNms();
		List<String> chklstNms = inspectionResultMapper.selectAllChklstNms();
		List<String> inspTypeNms = inspectionResultMapper.selectAllInspTypeNms();
		List<InspectorNmsResponse> inspectorNms = inspectionResultMapper.selectAllInspectorNms();
		InspectionResultOptionResponse inspectionResultOptionResponse = InspectionResultOptionResponse.builder()
				.brandNms(brandNms).storeNms(storeNms).chklstNms(chklstNms).inspTypeNms(inspTypeNms)
				.inspectorNms(inspectorNms).build();
		if(inspectionResultOptionResponse.getBrandNms() == null) {
			throw new CustomException(ErrorCode.BRAND_NOT_FOUND);
		} else if(inspectionResultOptionResponse.getStoreNms() == null) {
			throw new CustomException(ErrorCode.STORE_NOT_FOUND);
		} else if(inspectionResultOptionResponse.getChklstNms() == null) {
			throw new CustomException(ErrorCode.CHKLST_NOT_FOUND);
		} else if(inspectionResultOptionResponse.getInspTypeNms() == null) {
			throw new CustomException(ErrorCode.INSP_TYPE_NOT_FOUND);
		} else if(inspectionResultOptionResponse.getInspectorNms() == null) {
			throw new CustomException(ErrorCode.INSP_NOT_FOUND);
		} else {
			return inspectionResultOptionResponse;
		}
	}
}
