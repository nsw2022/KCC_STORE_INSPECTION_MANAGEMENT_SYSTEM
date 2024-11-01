package com.sims.master.checklist_manage.service;

import com.sims.config.Exception.CustomException;
import com.sims.config.Exception.ErrorCode;
import com.sims.config.common.aop.PRoleCheck;
import com.sims.master.checklist_manage.mapper.ChecklistMapper;
import com.sims.master.checklist_manage.vo.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @Author 유재원
 * @Classname ChecklistServiceImpl
 * @Date 2024.10.23
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ChecklistServiceImpl implements ChecklistService{

    private final ChecklistMapper checklistMapper;

    @Override
    public List<ChecklistResponse> selectChecklistAll(ChecklistRequest checklistRequest) {
        log.info("called ChecklsitServiceImpl checklistRequest = {}", checklistRequest);
        log.info("service 결과 = {}", checklistMapper.selectChecklistAll(checklistRequest));
        return checklistMapper.selectChecklistAll(checklistRequest);
    }

    @Override
    @PRoleCheck
    @Transactional(rollbackFor = Exception.class)
    public int deleteChecklistByChklstId(List<ChecklistDeleteRequest> checklistDeleteRequest) {
        if (checklistMapper.selectChklstIdByChklstIdAndChklstUseW(checklistDeleteRequest).size() > 0) {
            throw new CustomException(ErrorCode.CHECKLIST_IN_USE);
        }
        return checklistMapper.deleteChecklistByChklstId(checklistDeleteRequest);
    }

    @Override
    public ChecklistOptionsResponse selectChecklistOptions() {
        List<String> brandOptions = checklistMapper.selectBrandOptions();
        List<String> inspTypeOptions = checklistMapper.selectInspTypeOptions();
        List<String> checklistOptions = checklistMapper.selectChecklistOptions();

        return ChecklistOptionsResponse.builder()
                .brandOptions(brandOptions)
                .inspTypeOptions(inspTypeOptions)
                .checklistOptions(checklistOptions)
                .build();
    }


    /**
     * @Todo 체크리스트명 중복 체크
     */
    @Override
    @PRoleCheck
    @Transactional(rollbackFor = Exception.class)
    public int insertOrUpdateChecklist(List<ChecklistRequest> checklistRequests) {
        String mbrNo = SecurityContextHolder.getContext().getAuthentication().getName();
        int requestDataLength = checklistRequests.size();

        for(int i = 0; i < checklistRequests.size(); i++) {
            checklistRequests.get(i).setMbrNo(mbrNo);
            log.info(mbrNo);
        }

        int resultDataLength = checklistMapper.insertOrUpdateChecklist(checklistRequests);

        log.info("requestDatsLength = {}", requestDataLength);
        log.info("resultDataLength = {}", resultDataLength);

        if (requestDataLength == resultDataLength)
            return resultDataLength;
        else
            throw new CustomException(ErrorCode.SAVE_FAIL);
    }

    @Override
    public ChecklistPreviewResponse getComplianceData(String chklstNm) {
        List<Map<String, Object>> results = checklistMapper.selectChecklistPreview(chklstNm);
        ChecklistPreviewResponse complianceData = new ChecklistPreviewResponse();
        Map<String, Map<String, Map<String, List<String>>>> dataMap = new HashMap<>();

        if (results.isEmpty()) {
            System.out.println("No results found for checklist name: " + chklstNm);
            return complianceData; // 빈 데이터 반환
        }
        log.info("results = {}", results.toString());

        for (Map<String, Object> row : results) {
            Object categoryObj = row.get("CATEGORY");
            Object subCategoryObj = row.get("SUBCATEGORY");
            Object evitContentObj = row.get("EVITCONTENT");
            Object checkListContentObj = row.get("CHECKLISTCONTENT");

            if (categoryObj == null || subCategoryObj == null || evitContentObj == null || checkListContentObj == null) {
                continue;
            }

            String category = categoryObj.toString();
            String subCategory = subCategoryObj.toString();
            String evitContent = evitContentObj.toString();
            String checkListContent = checkListContentObj.toString();

            dataMap.putIfAbsent(category, new HashMap<>());
            dataMap.get(category).putIfAbsent(subCategory, new HashMap<>());
            dataMap.get(category).get(subCategory).putIfAbsent(evitContent, new ArrayList<>());

            List<String> checkList = dataMap.get(category).get(subCategory).get(evitContent);
            checkList.add(checkListContent);
        }

        complianceData.setData(dataMap);

        return complianceData;
    }
}
