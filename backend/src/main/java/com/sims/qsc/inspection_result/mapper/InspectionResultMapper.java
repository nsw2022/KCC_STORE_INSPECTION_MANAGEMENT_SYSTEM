package com.sims.qsc.inspection_result.mapper;

import com.sims.qsc.inspection_result.vo.InspectionResultRequest;
import com.sims.qsc.inspection_result.vo.InspectionResultResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @Description 점검결과 페이지
 * @author 원승언
 * @Date 2024-10-25
 */

@Mapper
public interface InspectionResultMapper {
	
	/**
	 * 사용자에 따라 점검 결과 목록을 다르게 보여준다.
	 * @param currentMbrNo 사용자 사원번호
	 * @return List<InspectionResultResponse>
	 */
	public List<InspectionResultResponse> selectInspectionResultList(@Param("currentMbrNo") String currentMbrNo);

	/**
	 * 검색에 따라 점검 결과를 다르게 보여준다.
	 * @param request
	 * @param currentMbrNo
	 * @return 검색에 다른 점검결과 List 반환
	 */
	public List<InspectionResultResponse> selectInspectionResultBySearch(InspectionResultRequest request,
																		 @Param("currentMbrNo") String currentMbrNo);

}
