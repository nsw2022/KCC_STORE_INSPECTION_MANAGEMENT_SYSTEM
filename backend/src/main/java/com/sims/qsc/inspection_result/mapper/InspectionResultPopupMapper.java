package com.sims.qsc.inspection_result.mapper;

import com.sims.qsc.inspection_result.vo.*;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @Description 점검결과 페이지
 * @author 원승언
 * @Date 2024-10-27
 */

@Mapper
public interface InspectionResultPopupMapper {

	/**
	 * 점검결과 상세보기
	 * @param inspResultId 점검결과ID
	 * @return 최종 점수와 분류별 내용을 제외한 점검결과를 상세하게 보여준다.
	 */
	public InspectionResultDetailResponse selectInspectionResultDetailByInspResultId
																	(@Param("inspResultId") int inspResultId);

	/**
	 * 점검 결과에서 대분류 카테고리별로 자세한 내용 보여주기
	 * @param inspResultId 점검결과ID
	 * @return 점검결과ID를 통해서 각 분류별 점수와 항목개수, 적합여부 개수, 부적합여부 개수 등을 알 수 있다.
	 */
	public List<InspectionResultCategoryDetailResponse> selectInspectionResultCategoryContentByInspResultId
																	(@Param("inspResultId") int inspResultId);

	/**
	 * 점검 결과에서 중분류 / 항목 별로 자세히 보여주기
	 * @param inspResultId 점검결과ID
	 * @param ctgId 대분류 카테고리명
	 * @return 대분류 카테고리명과 점검결과로 점검할 때 항목과 분류 점수 등을 자세히 알아보기
	 */
	public List<InspectionResultSubCategoryDetailResponse> selectInspectionResultSubCategoryContentByInspResultId
																		(@Param("inspResultId") int inspResultId,
																		 @Param("ctgId") int ctgId);

	public List<InspectionResultSubCategoriesQuestionsResponse> selectInspResultEvaluationByCategoryNms
																		(@Param("inspResultId") int inspResultId,
																		 @Param("ctgId") int ctgId,
																		 @Param("subCtgId") int subCtgId);

	public List<InspectionResultAnswImgResponse> selectAnswImgByInspResultId(@Param("inspResultId") int inspResultId);
}
