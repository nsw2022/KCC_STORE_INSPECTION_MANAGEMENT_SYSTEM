package com.sims.qsc.inspection_result.mapper;

import com.sims.qsc.inspection_result.vo.InspectionResultRequest;
import com.sims.qsc.inspection_result.vo.InspectionResultResponse;
import com.sims.qsc.inspection_result.vo.InspectorNmsResponse;
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
	public List<InspectionResultResponse> selectInspectionResultList(InspectionResultRequest inspectionResultRequest
																, @Param("currentMbrNo") String currentMbrNo);

	public List<String> selectAllBrandNms();

	public List<String> selectAllStoreNms();

	public List<String> selectAllChklstNms();

	public List<String> selectAllInspTypeNms();

	public List<InspectorNmsResponse> selectAllInspectorNms();
}
