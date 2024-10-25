package com.sims.qsc.inspection_result.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.sims.qsc.inspection_result.vo.InspectionResultResponse;

@Mapper
public interface InspectionResultMapper {
	
	/**
	 * 사용자에 따라 점검 결과 목록을 다르게 보여준다.
	 * @param inspMbrNo 점검자 사원번호
	 * @param svMbrNo	SV 사원번호
	 * @return List<InspectionResultResponse>
	 */
	public List<InspectionResultResponse> selectInspectionResultList(@Param("currentMbrNo") String currentMbrNo);
}

