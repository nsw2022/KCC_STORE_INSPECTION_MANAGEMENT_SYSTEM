package com.sims.qsc.inspection_result.service.inspectionResultPopup;

import com.sims.qsc.inspection_result.vo.InspectionResultCategoryDetailResponse;
import com.sims.qsc.inspection_result.vo.InspectionResultDetailResponse;

import java.util.List;

public interface InspectionResultPopupService {

    /**
     * 점검결과 ID에 따라 점검결과 내용을 다르게 보여줌
     * @param inspResultId 점검결과 ID
     * @return 점검결과 ID에 따라 분류별 내용 및 최종 점수를 제외한 정보를 보여준다.
     */
    public InspectionResultDetailResponse selectInspectionResultDetailByInspResultId(int inspResultId);

    /**
     * 점검결과 ID에 따라 점검결과 카테고리 보여줌
     * @param inspResultId 점검결과ID
     * @return 점검결과 ID를 가지고 분류별 내용을 보여준다
     */
    public List<InspectionResultCategoryDetailResponse> selectInspectionResultCategoryDetailByInspResultId(int inspResultId);


}
