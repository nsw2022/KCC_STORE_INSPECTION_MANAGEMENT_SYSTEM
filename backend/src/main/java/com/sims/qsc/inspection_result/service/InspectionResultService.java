package com.sims.qsc.inspection_result.service;

import java.util.List;

import com.sims.qsc.inspection_result.vo.*;

/**
 * @Description 가맹점 점검 결과 서비스
 * @author 원승언
 * @Date 2024-10-25
 *
 */

public interface InspectionResultService {

	/**
	 * 사용자에 따라 점검 결과 목록을 다르게 보여준다.
	 * @param currentMbrNo		// 로그인한 사용자의 사원번호
	 * @return 점검 결과 목록 표시 
	 */
	public List<InspectionResultResponse> selectInspectionResultList(InspectionResultRequest inspectionResultRequest, String currentMbrNo);

	public InspectionResultOptionResponse selectInspectionResultOptions();
}
