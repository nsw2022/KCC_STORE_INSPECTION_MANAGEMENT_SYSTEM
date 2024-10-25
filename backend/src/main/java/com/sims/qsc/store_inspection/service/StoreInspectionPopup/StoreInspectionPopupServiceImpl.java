package com.sims.qsc.store_inspection.service.StoreInspectionPopup;

import com.sims.qsc.store_inspection.mapper.StoreInspectionPopupMapper;
import com.sims.qsc.store_inspection.vo.RecentInspectionHistoryResponse;
import com.sims.qsc.store_inspection.vo.StoreInspectionPopupRequest;
import com.sims.qsc.store_inspection.vo.StoreInspectionPopupResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class StoreInspectionPopupServiceImpl implements StoreInspectionPopupService {
    private final StoreInspectionPopupMapper storeInspectionPopupMapper;

    @Override
    public List<StoreInspectionPopupResponse> selectInspectionDetails(Long chklstId, String storeNm, String inspPlanDt) {
        return storeInspectionPopupMapper.selectInspectionDetails(chklstId, storeNm, inspPlanDt);
    }

    @Override
    public List<RecentInspectionHistoryResponse> selectRecentInspectionHistory(String storeNm, String inspSttsCd) {
        return storeInspectionPopupMapper.selectRecentInspectionHistory(storeNm, inspSttsCd);
    }


//    @Override
//    @Transactional
//    public void insertInspectionResult(StoreInspectionPopupRequest request) {
//        log.info("점검 결과 삽입 요청 데이터: {}", request);
//        Long creMbrId = request.getCreMbrId();
//
//        try {
//            log.info("INSP_RESULT 삽입 호출: {}", request);
//            storeInspectionPopupMapper.insertINSP_RESULT(request);
//            log.info("INSP_RESULT 삽입 완료. 생성된 INSP_RESULT_ID: {}", request.getInspResultId());
//        } catch (Exception e) {
//            log.error("INSP_RESULT 삽입 실패: {} - {}", e.getClass().getName(), e.getMessage(), e);
//            throw e; // 트랜잭션 롤백을 위해 예외 재발생
//        }
//
//        log.info("INSP_RESULT 삽입 후 inspResultId: {}", request.getInspResultId());
//
//        for (StoreInspectionPopupRequest.CategoryInspection category : request.getInspections()) {
//            log.info("카테고리 처리 중: {}", category.getCategoryName());
//
//            for (StoreInspectionPopupRequest.SubcategoryInspection subcategory : category.getSubcategories()) {
//                log.info("서브카테고리 처리 중: {}", subcategory.getSubcategoryName());
//
//                try {
//                    // inspResultId 및 creMbrId 설정
//                    subcategory.setCreMbrId(creMbrId);
//                    subcategory.setInspResultId(request.getInspResultId());
//
//                    // EVIT_ANSW 삽입
//                    log.info("EVIT_ANSW 삽입 호출: {}", subcategory);
//                    storeInspectionPopupMapper.insertEVIT_ANSW(subcategory);
//
//                    // EVIT_VLT 삽입
//                    log.info("EVIT_VLT 삽입 호출: {}", subcategory);
//                    storeInspectionPopupMapper.insertEVIT_VLT(subcategory);
//
//                    // EVIT_ANSW_IMG 삽입
//                    if (subcategory.getPhotoPaths() != null && !subcategory.getPhotoPaths().isEmpty()) {
//                        log.info("EVIT_ANSW_IMG 삽입 준비: {}", subcategory.getPhotoPaths());
//                        int seq = 1;
//
//                        for (String photoPath : subcategory.getPhotoPaths()) {
//                            if (photoPath == null || photoPath.isBlank()) {
//                                log.warn("빈 사진 경로 발견, 건너뜁니다.");
//                                continue;
//                            }
//
//                            Map<String, Object> params = new HashMap<>();
//                            params.put("evitId", subcategory.getEvitId());
//                            params.put("inspResultId", subcategory.getInspResultId());
//                            params.put("photoPath", photoPath);
//                            params.put("seq", seq++);
//                            params.put("creMbrId", creMbrId);
//
//                            try {
//                                log.info("EVIT_ANSW_IMG 삽입 호출: {}", params);
//                                storeInspectionPopupMapper.insertEVIT_ANSW_IMG(params);
//                            } catch (Exception e) {
//                                log.error("EVIT_ANSW_IMG 삽입 실패: {}", e.getMessage(), e);
//                                throw e;
//                            }
//                        }
//                    } else {
//                        log.info("사진 경로가 없어 EVIT_ANSW_IMG 삽입을 건너뜁니다.");
//                    }
//
//                } catch (Exception e) {
//                    log.error("EVIT_ID에 대한 검사 데이터 삽입 중 오류: {}", subcategory.getEvitId(), e);
//                    throw e; // 트랜잭션 롤백을 위해 예외 재발생
//                }
//            }
//        }
//    }

    /**
     * INSP_RESULT 삽입 및 생성된 INSP_RESULT_ID 반환
     *
     * @param request 초기 점검 데이터
     * @return 생성된 INSP_RESULT_ID
     */
    @Override
    @Transactional
    public Long insertInspResult(StoreInspectionPopupRequest request) {
        log.info("INSP_RESULT 삽입 요청 데이터: {}", request);
        Long creMbrId = getCurrentUserId(); // 현재 사용자 ID 가져오기

        // creMbrId가 정상적으로 조회되지 않으면 예외 발생
        if (creMbrId == null) {
            log.error("현재 사용자의 MBR_ID를 조회할 수 없습니다.");
            throw new IllegalStateException("현재 사용자의 MBR_ID를 조회할 수 없습니다.");
        }

        // INSP_RESULT 삽입에 필요한 필드만 설정
        StoreInspectionPopupRequest inspRequest = StoreInspectionPopupRequest.builder()
                .inspSchdId(request.getInspSchdId())
//                .inspStartTm(request.getInspStartTm()) // INSP_START_TM 필드 설정
                .inspComplW("N") // 점검 완료 여부 초기화
                .creMbrId(creMbrId)
                .build();

        try {
            log.info("INSP_RESULT 삽입 호출: {}", inspRequest);
            storeInspectionPopupMapper.insertINSP_RESULT(inspRequest);
            log.info("INSP_RESULT 삽입 완료. 생성된 INSP_RESULT_ID: {}", inspRequest.getInspResultId());
            return inspRequest.getInspResultId();
        } catch (Exception e) {
            log.error("INSP_RESULT 삽입 실패: {}", e.getMessage(), e);
            throw e; // 트랜잭션 롤백
        }
    }

    /**
     * 점검 결과 임시저장 (EVIT_ANSW, EVIT_VLT, EVIT_ANSW_IMG 삽입)
     *
     * @param request 점검 결과 데이터
     */
    @Override
    @Transactional
    public void insertInspectionResult(StoreInspectionPopupRequest request) {
        log.info("점검 결과 삽입 요청 데이터: {}", request);
        Long creMbrId = getCurrentUserId(); // 현재 사용자 ID 가져오기
        Long inspResultId = request.getInspResultId();

        if (inspResultId == null) {
            log.error("inspResultId가 설정되지 않았습니다.");
            throw new IllegalArgumentException("inspResultId가 설정되지 않았습니다.");
        }

        try {
            log.info("EVIT_ANSW, EVIT_VLT, EVIT_ANSW_IMG 삽입 시작.");
            for (StoreInspectionPopupRequest.CategoryInspection category : request.getInspections()) {
                log.info("카테고리 처리 중: {}", category.getCategoryName());

                for (StoreInspectionPopupRequest.SubcategoryInspection subcategory : category.getSubcategories()) {
                    log.info("서브카테고리 처리 중: {}", subcategory.getSubcategoryName());

                    try {
                        // inspResultId 및 creMbrId 설정
                        subcategory.setInspResultId(inspResultId);
                        subcategory.setCreMbrId(creMbrId);

                        // EVIT_ANSW 삽입
                        log.info("EVIT_ANSW 삽입 호출: {}", subcategory);
                        storeInspectionPopupMapper.insertEVIT_ANSW(subcategory);

                        // EVIT_VLT 삽입
                        log.info("EVIT_VLT 삽입 호출: {}", subcategory);
                        storeInspectionPopupMapper.insertEVIT_VLT(subcategory);

                        // EVIT_ANSW_IMG 삽입
                        if (subcategory.getPhotoPaths() != null && !subcategory.getPhotoPaths().isEmpty()) {
                            log.info("EVIT_ANSW_IMG 삽입 준비: {}", subcategory.getPhotoPaths());
                            int seq = 1;

                            for (String photoPath : subcategory.getPhotoPaths()) {
                                if (photoPath == null || photoPath.isBlank()) {
                                    log.warn("빈 사진 경로 발견, 건너뜁니다.");
                                    continue;
                                }

                                Map<String, Object> params = new HashMap<>();
                                params.put("evitId", subcategory.getEvitId());
                                params.put("inspResultId", inspResultId);
                                params.put("photoPath", photoPath);
                                params.put("seq", seq++);
                                params.put("creMbrId", creMbrId);

                                try {
                                    log.info("EVIT_ANSW_IMG 삽입 호출: {}", params);
                                    storeInspectionPopupMapper.insertEVIT_ANSW_IMG(params);
                                } catch (Exception e) {
                                    log.error("EVIT_ANSW_IMG 삽입 실패: {}", e.getMessage(), e);
                                    throw e;
                                }
                            }
                        } else {
                            log.info("사진 경로가 없어 EVIT_ANSW_IMG 삽입을 건너뜁니다.");
                        }

                    } catch (Exception e) {
                        log.error("EVIT_ID [{}]에 대한 검사 데이터 삽입 중 오류: {}", subcategory.getEvitId(), e.getMessage(), e);
                        throw e; // 트랜잭션 롤백
                    }
                }
            }
            log.info("EVIT_ANSW, EVIT_VLT, EVIT_ANSW_IMG 삽입 완료.");
        } catch (Exception e) {
            log.error("EVIT_ANSW, EVIT_VLT, EVIT_ANSW_IMG 삽입 중 오류 발생: {}", e.getMessage(), e);
            throw e; // 트랜잭션 롤백
        }
    }



    @Override
    @Transactional
    public Long getOrInsertInspResultId(StoreInspectionPopupRequest request) {
        // 기존 INSP_RESULT가 존재하는지 조회
        Long inspResultId = storeInspectionPopupMapper.selectExistingInspResultId(
                request.getChklstId(),
                request.getStoreNm(),
                request.getInspPlanDt()
        );

        if (inspResultId != null) {
            log.info("기존 INSP_RESULT_ID 발견: {}", inspResultId);
            return inspResultId;
        } else {
            // 존재하지 않으면 새로 삽입
            log.info("새로운 INSP_RESULT 삽입 필요");
            Long newInspResultId = insertInspResult(request);
            log.info("새로운 INSP_RESULT_ID 생성: {}", newInspResultId);
            return newInspResultId;
        }
    }



    /**
     * 현재 인증된 사용자의 MBR_ID 조회
     *
     * @return 현재 사용자의 MBR_ID
     */
    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            log.error("인증된 사용자가 없습니다.");
            throw new IllegalStateException("인증된 사용자가 없습니다.");
        }

        String username = auth.getName();
        log.info("인증된 사용자의 username: {}", username); // 추가된 로그

        if (username == null || username.isEmpty()) {
            log.error("인증된 사용자의 username이 비어 있습니다.");
            throw new IllegalStateException("인증된 사용자의 username이 비어 있습니다.");
        }

        Long mbrId = storeInspectionPopupMapper.selectMbrIdByMbrNo(username);
        if (mbrId == null) {
            log.error("username [{}]에 해당하는 MBR_ID를 찾을 수 없습니다.", username);
            throw new IllegalArgumentException("username에 해당하는 MBR_ID를 찾을 수 없습니다.");
        }

        log.info("현재 사용자의 MBR_ID: {}", mbrId);
        return mbrId;
    }




}
