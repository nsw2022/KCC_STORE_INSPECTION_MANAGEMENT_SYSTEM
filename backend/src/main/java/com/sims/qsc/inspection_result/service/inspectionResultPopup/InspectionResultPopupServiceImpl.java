package com.sims.qsc.inspection_result.service.inspectionResultPopup;

import com.sims.qsc.inspection_result.mapper.InspectionResultPopupMapper;
import com.sims.qsc.inspection_result.vo.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class InspectionResultPopupServiceImpl implements InspectionResultPopupService {
    private final InspectionResultPopupMapper inspectionResultPopupMapper;

    @Override
    public InspectionResultDetailResponse selectInspectionResultDetailByInspResultId(int inspresultId) {
        InspectionResultDetailResponse inspResult =
                inspectionResultPopupMapper.selectInspectionResultDetailByInspResultId(inspresultId);
        return inspResult;
    }

//    @Transactional(readOnly = true)
    @Override
    public List<InspectionResultCategoryDetailResponse> selectInspectionResultCategoryDetailByInspResultId(int inspResultId) {
        long startTime1 = System.currentTimeMillis();
        /**
         * list = 대분류명 / 대분류 점수 / 받은 점수 / 적합 문항 수 / 부적합 문항 수 / 총 문항 수로 이루어짐 9
         */
        List<InspectionResultCategoryDetailResponse> list =
                inspectionResultPopupMapper.selectInspectionResultCategoryContentByInspResultId(inspResultId);
        long endTime1 = System.currentTimeMillis();
        long duration1 = endTime1 - startTime1;
        log.info("duration1 / selectInspectionResultCategoryContentByInspResultId = {}", duration1);
        /**
         * uniqueCategoryNm = 대분류명을 list에서 가져와 중복되는 것은 제외하여 중복되지 않은 String을 가져온다
         */
        List<Integer> uniqueCategoryNm = list.stream().map(InspectionResultCategoryDetailResponse::getCategoryId)
                .distinct().collect(Collectors.toList());
        for (int categoryNm : uniqueCategoryNm) {

            /**
             * subList = 중복되지 않은 대분류명과 점검결과 ID를 통해서 중분류 / 각 항목 / 각각의 점수 등을 가져온다.
             */
            long startTime2 = System.currentTimeMillis();
            List<InspectionResultSubCategoryDetailResponse> subList =
                    inspectionResultPopupMapper.selectInspectionResultSubCategoryContentByInspResultId(inspResultId, categoryNm);
            long endTime2 = System.currentTimeMillis();
            long duration2 = endTime2 - startTime2;
            log.info("duration2 / selectInspectionResultSubCategoryContentByInspResultId = {}", duration2);
            /**
             * subList들을 list 안에 넣어준다.
             */
            for (InspectionResultCategoryDetailResponse response : list) {
                if (response.getCategoryId() == categoryNm) {
                    response.setSubcategories(subList);
                }
            }

            List<Integer> uniqueSubCategoryNm = subList.stream().map(InspectionResultSubCategoryDetailResponse::getCtgId)
                    .distinct().collect(Collectors.toList());

            for (int subCategoryNm : uniqueSubCategoryNm) {
                long startTime3 = System.currentTimeMillis();
                List<InspectionResultSubCategoriesQuestionsResponse> evalList =
                        inspectionResultPopupMapper.selectInspResultEvaluationByCategoryNms(inspResultId, categoryNm, subCategoryNm);
                long endTime3 = System.currentTimeMillis();
                long duration3 = endTime3 - startTime3;
                log.info("duration3 / selectInspResultEvaluationByCategoryNms = {}", duration3);
                for (InspectionResultSubCategoryDetailResponse subResponse : subList) {
                    if (subResponse.getCtgId() == subCategoryNm) {
                        subResponse.setQuestions(evalList);
                    }
                }
            }

            /**
             * subList 안에서 questions 리스트를 가져와 준 다음에 questions의 evit_id 와 evit_answ_img의 evit_id가 일치하는 경우
             * questions 리스트 안에 evit_answ_img 가 들어간다.
             *
             */
            for (InspectionResultSubCategoryDetailResponse response : subList) {
                for (InspectionResultSubCategoriesQuestionsResponse questions : response.getQuestions()) {
                    List<InspectionResultAnswImgResponse> matchedImages = new ArrayList<>();
                    long startTime4 = System.currentTimeMillis();
                    List<InspectionResultAnswImgResponse> images = inspectionResultPopupMapper.selectAnswImgByInspResultId(inspResultId);
                    long endTime4 = System.currentTimeMillis();
                    long duration4 = endTime4 - startTime4;
                    log.info("duration4 = {}", duration4);
                    for (InspectionResultAnswImgResponse answImg : images) {
                        if (questions.getEvitId() == answImg.getEvitId()) {
                            matchedImages.add(answImg);
                        }
                    }
                    questions.setImages(matchedImages);
                }
            }

        }

        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime1;
        log.info("duration = {}", duration);

        return list;
    }

}

