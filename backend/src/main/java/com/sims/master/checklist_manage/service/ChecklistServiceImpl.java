package com.sims.master.checklist_manage.service;

import com.sims.config.Exception.CustomException;
import com.sims.config.Exception.ErrorCode;
import com.sims.config.common.ClientInfo;
import com.sims.config.common.aop.PRoleCheck;
import com.sims.master.checklist_manage.mapper.ChecklistMapper;
import com.sims.master.checklist_manage.vo.*;
import com.sims.master.inspection_list_manage.mapper.InspectionListManageMapper;
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
    @Transactional(readOnly = true)
    public List<ChecklistResponse> selectChecklistAll(ChecklistRequest checklistRequest) {
        log.info("called ChecklsitServiceImpl checklistRequest = {}", checklistRequest);


        return checklistMapper.selectChecklistAll(checklistRequest);
    }

    /**
     * @Todo 체크리스트 삭제 시 분류 삭제해야 함.
     */
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
    @Transactional(readOnly = true)
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

    @Override
    @PRoleCheck
    @Transactional(rollbackFor = Exception.class)
    public int insertOrUpdateChecklist(List<ChecklistRequest> checklistRequests) {
        String mbrNo = SecurityContextHolder.getContext().getAuthentication().getName();
        int requestDataLength = checklistRequests.size();
        List<String> chklstNm = new ArrayList<String>();
        for(int i = 0; i < checklistRequests.size(); i++) {
            checklistRequests.get(i).setMbrNo(mbrNo);
            chklstNm.add(checklistRequests.get(i).getChklstNm());
            log.info(mbrNo);
        }

        if (checklistMapper.selectChklstCount(chklstNm) > 0) {
            throw new CustomException(ErrorCode.DUPLICATE_CHECKLIST_NAME);
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
    @Transactional(readOnly = true)
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

    /**
     * @Todo 대분류, 중분류 조회까지 끝남
     * 이제 평가항목, 선택지 조회한 후 삽입 해야함.
     * @Todo 중분류 삭제 시 하위 항목 삭제 해야 함.
     */
//    @Override
//    @Transactional(rollbackFor = Exception.class)
//    public int insertMasterChecklistCopy(String newChklstId, String masterChklstNm) {
//        // 마스터 체크리스트 ID 조회
//        Long masterChklstId = checklistMapper.selectMasterChecklistId(masterChklstNm);
//        log.info("masterChklstId = {}", masterChklstId);
//
//        // 마스터 체크리스트 대분류 조회
//        List<Category> masterCtgList = checklistMapper.selectMasterChklstCtg(masterChklstId);
//        log.info("masterCtgList = {}", masterCtgList);
//
//        // 대분류 복사
//        checklistMapper.insertCtgCopy(newChklstId, masterChklstId);
//
//        // 마스터 체크리스트 중분류 조회
//        List<Category> masterSubCtgList = checklistMapper.selectMasterChklstSubCtg(masterChklstId);
//        log.info("masterSubCtgList = {}", masterSubCtgList);
//
//        // 마스터 체크리스트 평가항목 조회
//        List<EvaluationItem> masterEvitList = checklistMapper.selectMasterChklstEvit(masterChklstId);
//        log.info("masterEvitList = {}", masterEvitList);
//
//        // 마스터 체크리스트 선택지 조회
//        List<Choice> masterChclstList = checklistMapper.selectMasterChklstChclst(masterChklstId);
//        log.info("masterChclstList = {}", masterChclstList);
//
//
//        return 0;
//    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int insertMasterChecklistCopy(String newChklstId, String masterChklstNm) {

        // 마스터 체크리스트 ID 조회
        Long masterChklstId = checklistMapper.selectMasterChecklistId(masterChklstNm);
        log.info("masterChklstId = {}", masterChklstId);
        checklistMapper.updateMasterChklst(newChklstId, masterChklstId);
//
//        // 원본 대분류 ID 리스트 조회
//        List<Long> masterCtgIds = checklistMapper.selectMasterCategoryIds(masterChklstId);
//        log.info("masterCtgIds = {}", masterCtgIds);
//
//        // 대분류 복사 및 ID 매핑 저장
//        Map<Long, Long> ctgIdMap = new HashMap<>();
//        int rowsInserted = checklistMapper.insertCtgCopy(newChklstId, masterChklstId);
//        log.info("Rows inserted for Ctg copy: {}", rowsInserted);
//
//        List<Long> newCtgIds = checklistMapper.selectMasterCategoryIds(Long.valueOf(newChklstId)); // 새로 생성된 대분류 ID 리스트 조회
//        for (int i = 0; i < newCtgIds.size(); i++) {
//            ctgIdMap.put(masterCtgIds.get(i), newCtgIds.get(i));  // 원본 대분류 ID와 새 대분류 ID 매핑
//        }
//        log.info("ctgIdMap = {}", ctgIdMap);
//
//        // 중분류 복사
//        Map<Long, Long> subCtgIdMap = new HashMap<>();
//        for (Map.Entry<Long, Long> entry : ctgIdMap.entrySet()) {
//            Long masterCtgId = entry.getKey();
//            Long newCtgId = entry.getValue();
//
//            // 원본 중분류 ID 리스트 조회
//            List<Long> masterSubCtgIds = checklistMapper.selectSubCategoryIds(masterCtgId);
//            log.info("masterSubCtgIds = {}", masterSubCtgIds);
//
//            // 중분류 복사
//            checklistMapper.insertSubCtgCopy(newCtgId, masterCtgId);
//            log.info("중분류 복사 완료");
//
//            // 새로 생성된 중분류 ID 리스트 조회
//            List<Long> newSubCtgIds = checklistMapper.selectSubCategoryIds(newCtgId);
//            log.info("newSubCtgIds = {}", newSubCtgIds);
//
//            for (int i = 0; i < newSubCtgIds.size(); i++) {
//                subCtgIdMap.put(masterSubCtgIds.get(i), newSubCtgIds.get(i));  // 원본 중분류 ID와 새 중분류 ID 매핑
//            }
//            log.info("subCtgIdMap = {}", subCtgIdMap);
//        }
//
//        // 평가항목 복사
//        Map<Long, Long> evitIdMap = new HashMap<>();
//        for (Map.Entry<Long, Long> entry : subCtgIdMap.entrySet()) {
//            Long oldSubCtgId = entry.getKey();
//            Long newSubCtgId = entry.getValue();
//
//            // 원본 평가항목 ID 리스트 조회
//            List<Long> oldEvitIds = checklistMapper.selectEvaluationItemIds(oldSubCtgId);
//            log.info("oldEvitIds = {}", oldEvitIds);
//
//            // 평가항목 복사 후 새로 생성된 평가항목 ID 리스트 반환
//            checklistMapper.insertEvaluationItemCopy(newSubCtgId, oldSubCtgId);
//            log.info("Rows inserted for Evaluation Item copy");
//
//            // 새로 생성된 평가항목 ID 리스트 조회
//            List<Long> newEvitIds = checklistMapper.selectEvaluationItemIds(newSubCtgId);
//            log.info("newEvitIds = {}", newEvitIds);
//
//            for (int i = 0; i < newEvitIds.size(); i++) {
//                evitIdMap.put(oldEvitIds.get(i), newEvitIds.get(i));  // 원본 평가항목 ID와 새 평가항목 ID 매핑
//            }
//            log.info("evitIdMap = {}", evitIdMap);
//        }
//
//        // 선택지 복사
//        for (Map.Entry<Long, Long> entry : evitIdMap.entrySet()) {
//            Long oldEvitId = entry.getKey();
//            Long newEvitId = entry.getValue();
//
//            // 선택지 복사
//            checklistMapper.insertChoiceCopy(newEvitId, oldEvitId);
//            log.info("Rows inserted for Choice copy");
//        }

        return 1; // 성공 반환
    }







}
