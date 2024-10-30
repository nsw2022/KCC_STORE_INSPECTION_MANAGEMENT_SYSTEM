package com.sims.qsc.store_inspection.service.StoreInspectionPopup;

import com.sims.config.s3.AwsFileService;
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

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class StoreInspectionPopupServiceImpl implements StoreInspectionPopupService {

    private final StoreInspectionPopupMapper storeInspectionPopupMapper;
    private final AwsFileService awsFileService;


    @Override
    public List<StoreInspectionPopupResponse> selectInspectionDetails(Long chklstId, String storeNm, String inspPlanDt) {
        return storeInspectionPopupMapper.selectInspectionDetails(chklstId, storeNm, inspPlanDt);
    }

    @Override
    public List<RecentInspectionHistoryResponse> selectRecentInspectionHistory(String storeNm, String inspSttsCd) {
        return storeInspectionPopupMapper.selectRecentInspectionHistory(storeNm, inspSttsCd);
    }



    /**
     * INSP_RESULT 삽입 및 생성된 INSP_RESULT_ID 반환
     *
     * @param request 초기 점검 데이터
     * @return 생성된 INSP_RESULT_ID
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long getOrInsertInspResultId(StoreInspectionPopupRequest request) {
        log.info("getOrInsertInspResultId 메서드 호출됨: inspSchdId={}", request.getInspSchdId());

        // INSP_SCHD_ID를 기반으로 기존 INSP_RESULT 조회
        StoreInspectionPopupRequest existingInspResult = storeInspectionPopupMapper.selectExistingInspResultIdBySchdId(request.getInspSchdId());
        log.debug("selectExistingInspResultIdBySchdId 반환 값: {}", existingInspResult);

        if (existingInspResult != null && existingInspResult.getInspResultId() != null) {
            log.info("기존 INSP_SCHD_ID 발견: {}", existingInspResult.getInspSchdId());
            // INSP_RESULT_ID 반환
            return existingInspResult.getInspResultId();
        } else {
            // 존재하지 않으면 새로 삽입
            log.info("새로운 INSP_RESULT 삽입 필요");
            Long creMbrId = getCurrentUserId(); // 현재 사용자 ID 가져오기

            if (creMbrId == null) {
                log.error("현재 사용자의 MBR_ID를 조회할 수 없습니다.");
                throw new IllegalStateException("현재 사용자의 MBR_ID를 조회할 수 없습니다.");
            }

            // INSP_RESULT 삽입에 필요한 필드만 설정
            StoreInspectionPopupRequest inspRequest = StoreInspectionPopupRequest.builder()
                    .inspSchdId(request.getInspSchdId())
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
    }



    /**
     * 점검 결과 임시저장 (EVIT_ANSW, EVIT_VLT, EVIT_ANSW_IMG 삽입)
     *
     * @param request 점검 결과 데이터
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void insertInspectionResult(StoreInspectionPopupRequest request) {
        log.info("점검 결과 병합 요청 데이터: {}", request);
        Long creMbrId = getCurrentUserId(); // 현재 사용자 ID 가져오기
        Long inspResultId = request.getInspResultId();

        if (inspResultId == null) {
            log.error("inspResultId가 설정되지 않았습니다.");
            throw new IllegalArgumentException("inspResultId가 설정되지 않았습니다.");
        }

        try {
            log.info("EVIT_ANSW, EVIT_VLT, EVIT_ANSW_IMG 병합 시작.");
            for (StoreInspectionPopupRequest.CategoryInspection category : request.getInspections()) {
                log.info("카테고리 처리 중: {}", category.getCategoryName());

                for (StoreInspectionPopupRequest.SubcategoryInspection subcategory : category.getSubcategories()) {
                    log.info("서브카테고리 처리 중: {}", subcategory.getSubcategoryName());

                    try {
                        // inspResultId 및 creMbrId 설정
                        subcategory.setInspResultId(inspResultId);
                        subcategory.setCreMbrId(creMbrId);

                        // EVIT_ANSW 병합
                        log.info("EVIT_ANSW 병합 호출: {}", subcategory);
                        storeInspectionPopupMapper.mergeEVIT_ANSW(subcategory);

                        // EVIT_VLT 병합: 긍정적인 답변이 아닌 경우에만 호출
                        if (!isPositiveAnswer(subcategory.getAnswerContent())) {
                            log.info("EVIT_VLT 병합 호출: {}", subcategory);
                            storeInspectionPopupMapper.mergeEVIT_VLT(subcategory);
                        } else {
                            log.info("긍정적인 답변이므로 EVIT_VLT 병합을 건너뜁니다. evitId: {}", subcategory.getEvitId());
                        }

                        // EVIT_ANSW_IMG 병합 및 삭제 로직 추가
                        if (subcategory.getPhotoPaths() != null && !subcategory.getPhotoPaths().isEmpty()) {
                            log.info("EVIT_ANSW_IMG 병합 준비: {}", subcategory.getPhotoPaths());
                            int seq = 1;
                            List<Integer> seqList = new ArrayList<>();

                            for (String photoPath : subcategory.getPhotoPaths()) {
                                if (photoPath == null || photoPath.isBlank()) {
                                    log.warn("빈 사진 경로 발견, 건너뜁니다.");
                                    continue;
                                }

                                Map<String, Object> params = new HashMap<>();
                                params.put("evitId", subcategory.getEvitId());
                                params.put("creMbrId", creMbrId);
                                params.put("inspResultId", inspResultId);
                                params.put("photoPath", photoPath);
                                params.put("seq", seq);

                                try {
                                    log.info("EVIT_ANSW_IMG 병합 호출: {}", params);
                                    storeInspectionPopupMapper.mergeEVIT_ANSW_IMG(params);
                                    seqList.add(seq);
                                    seq++;
                                } catch (Exception e) {
                                    log.error("EVIT_ANSW_IMG 병합 실패: {}", e.getMessage(), e);
                                    throw e;
                                }
                            }

                            // 불필요한 레코드 삭제
                            if (!seqList.isEmpty()) {
                                Map<String, Object> deleteParams = new HashMap<>();
                                deleteParams.put("evitId", subcategory.getEvitId());
                                deleteParams.put("creMbrId", creMbrId);
                                deleteParams.put("inspResultId", inspResultId);
                                deleteParams.put("seqList", seqList);

                                try {
                                    // 삭제될 이미지 경로 조회
                                    List<String> imgPaths = storeInspectionPopupMapper.selectUnmatchedEVIT_ANSW_IMGPaths(deleteParams);

                                    // S3에서 이미지 삭제
                                    for (String imgPath : imgPaths) {
                                        String s3Key = "inspection_img/" + imgPath;
                                        awsFileService.deleteFile(s3Key);
                                        log.info("S3에서 이미지 삭제 완료: {}", s3Key);
                                    }

                                    // 데이터베이스에서 이미지 레코드 삭제
                                    log.info("EVIT_ANSW_IMG 삭제 호출: {}", deleteParams);
                                    storeInspectionPopupMapper.deleteUnmatchedEVIT_ANSW_IMG(deleteParams);

                                } catch (Exception e) {
                                    log.error("EVIT_ANSW_IMG 삭제 실패: {}", e.getMessage(), e);
                                    throw e;
                                }
                            }
                        } else {
                            log.info("사진 경로가 없어 EVIT_ANSW_IMG 병합을 건너뜁니다.");
                        }

                    } catch (Exception e) {
                        log.error("evitId [{}]에 대한 검사 데이터 병합 중 오류: {}", subcategory.getEvitId(), e.getMessage(), e);
                        throw e; // 트랜잭션 롤백
                    }
                }
            }
            log.info("EVIT_ANSW, EVIT_VLT, EVIT_ANSW_IMG 병합 완료.");
        } catch (Exception e) {
            log.error("EVIT_ANSW, EVIT_VLT, EVIT_ANSW_IMG 병합 중 오류 발생: {}", e.getMessage(), e);
            throw e; // 트랜잭션 롤백
        }
    }

    /**
     * 답변 내용이 긍정적인지 여부를 확인하는 메서드
     *
     * @param answerContent 답변 내용
     * @return 긍정적인 답변인 경우 true, 그렇지 않은 경우 false
     */
    private boolean isPositiveAnswer(String answerContent) {
        if (answerContent == null) {
            return false;
        }
        // 긍정적인 답변 목록
        List<String> positiveAnswers = Arrays.asList("적합", "매우좋음", "좋음", "보통");
        return positiveAnswers.contains(answerContent.trim());
    }


    /**
     * 임시저장된 점검 결과 조회
     *
     * @param inspResultId 점검 결과 ID
     * @return 임시저장된 점검 결과 데이터
     */
//    @Override
//    @Transactional(readOnly = true)
//    public StoreInspectionPopupRequest getTemporaryInspection(Long inspResultId) {
//        Long creMbrId = getCurrentUserId(); // 현재 사용자 ID 가져오기
//        log.info("임시저장된 점검 결과 조회 요청: inspResultId={}, creMbrId={}", inspResultId, creMbrId);
//
//        List<StoreInspectionPopupResponse.EvitAnswImgVO> answImgList = storeInspectionPopupMapper.selectTemporaryAnswImg(inspResultId, creMbrId);
//        List<StoreInspectionPopupResponse.EvitVltVO> vltList = storeInspectionPopupMapper.selectTemporaryVlt(inspResultId, creMbrId);
//
//        // answImgList와 vltList가 모두 null 또는 비어 있으면 임시저장된 데이터가 없는 것으로 판단
//        if ((answImgList == null || answImgList.isEmpty()) && (vltList == null || vltList.isEmpty())) {
//            log.info("임시저장된 데이터가 없습니다.");
//            return null;
//        }
//
//        // StoreInspectionPopupRequest 객체 생성 및 설정
//        StoreInspectionPopupRequest request = StoreInspectionPopupRequest.builder()
//                .inspResultId(inspResultId)
//                .inspComplW("N")
//                .inspections(new ArrayList<>())
//                .build();
//
//        // EVIT_ANSW_IMG 데이터를 SubcategoryInspection에 매핑
//        Map<Long, StoreInspectionPopupRequest.SubcategoryInspection> subcategoryMap = new HashMap<>();
//        if (answImgList != null) {
//            for (StoreInspectionPopupResponse.EvitAnswImgVO dto : answImgList) {
//                if (dto == null) {
//                    log.warn("answImgList에 null 요소가 있습니다. 건너뜁니다.");
//                    continue;
//                }
//
//                StoreInspectionPopupRequest.SubcategoryInspection subcategory = subcategoryMap.get(dto.getEaEvitId());
//                if (subcategory == null) {
//                    subcategory = StoreInspectionPopupRequest.SubcategoryInspection.builder()
//                            .evitId(dto.getEaEvitId())
//                            .answerContent(dto.getEvitAnswContent())
//                            .creMbrId(dto.getEaCreMbrId())
//                            .photoPaths(new ArrayList<>())
//                            .build();
//                    subcategoryMap.put(dto.getEaEvitId(), subcategory);
//                }
//                if (dto.getEvitAnswImgPath() != null) {
//                    subcategory.getPhotoPaths().add(dto.getEvitAnswImgPath());
//                }
//            }
//        }
//
//        // EVIT_VLT 데이터를 SubcategoryInspection에 매핑
//        if (vltList != null) {
//            for (StoreInspectionPopupResponse.EvitVltVO dto : vltList) {
//                if (dto == null) {
//                    log.warn("vltList에 null 요소가 있습니다. 건너뜁니다.");
//                    continue;
//                }
//
//                StoreInspectionPopupRequest.SubcategoryInspection subcategory = subcategoryMap.get(dto.getEvitId());
//                if (subcategory == null) {
//                    subcategory = StoreInspectionPopupRequest.SubcategoryInspection.builder()
//                            .evitId(dto.getEvitId())
//                            .answerContent(dto.getEvitAnswContent())
//                            .creMbrId(dto.getCreMbrId())
//                            .photoPaths(new ArrayList<>())
//                            .build();
//                    subcategoryMap.put(dto.getEvitId(), subcategory);
//                }
//
//                // EVIT_VLT 필드 설정
//                subcategory.setPdtNmDtplc(dto.getPdtNmDtplc());
//                subcategory.setVltContent(dto.getVltContent());
//                subcategory.setVltCnt(dto.getVltCnt());
//                subcategory.setCaupvdCd(dto.getCaupvdCd());
//                subcategory.setVltCause(dto.getVltCause());
//                subcategory.setInstruction(dto.getInstruction());
//                subcategory.setVltPlcCd(dto.getVltPlcCd());
//                subcategory.setInspResultId(dto.getInspResultId());
//            }
//        }
//
//        // subcategoryMap이 비어 있지 않은 경우에만 카테고리를 추가
//        if (!subcategoryMap.isEmpty()) {
//            StoreInspectionPopupRequest.CategoryInspection category = StoreInspectionPopupRequest.CategoryInspection.builder()
//                    .categoryName("임시카테고리") // 실제 카테고리 이름으로 대체 필요
//                    .subcategories(new ArrayList<>(subcategoryMap.values()))
//                    .build();
//
//            request.getInspections().add(category);
//        }
//
//        // inspections 리스트가 비어 있는지 확인
//        if (request.getInspections().isEmpty()) {
//            log.info("임시저장된 데이터가 없습니다. inspections 리스트가 비어 있습니다.");
//            return null;
//        }
//
//        return request;
//    }
    @Override
    @Transactional(readOnly = true)
    public StoreInspectionPopupRequest getTemporaryInspection(Long inspResultId) {
        Long creMbrId = getCurrentUserId(); // 현재 사용자 ID 가져오기
        log.info("임시저장된 점검 결과 조회 요청: inspResultId={}, creMbrId={}", inspResultId, creMbrId);

        List<StoreInspectionPopupResponse.EvitAnswImgVO> answImgList = storeInspectionPopupMapper.selectTemporaryAnswImg(inspResultId, creMbrId);
        List<StoreInspectionPopupResponse.EvitVltVO> vltList = storeInspectionPopupMapper.selectTemporaryVlt(inspResultId, creMbrId);

        // answImgList와 vltList가 모두 null 또는 비어 있으면 임시저장된 데이터가 없는 것으로 판단
        if ((answImgList == null || answImgList.isEmpty()) && (vltList == null || vltList.isEmpty())) {
            log.info("임시저장된 데이터가 없습니다.");
            return null;
        }

        // StoreInspectionPopupRequest 객체 생성 및 설정
        StoreInspectionPopupRequest request = StoreInspectionPopupRequest.builder()
                .inspResultId(inspResultId)
                .inspComplW("N")
                .inspections(new ArrayList<>())
                .build();

        // EVIT_ANSW_IMG 데이터를 composite key (evitId-inspResultId-creMbrId)로 매핑
        Map<String, StoreInspectionPopupRequest.SubcategoryInspection> subcategoryMap = new HashMap<>();
        if (answImgList != null) {
            for (StoreInspectionPopupResponse.EvitAnswImgVO dto : answImgList) {
                if (dto == null) {
                    log.warn("answImgList에 null 요소가 있습니다. 건너뜁니다.");
                    continue;
                }

                String compositeKey = dto.getEaEvitId() + "-" + inspResultId + "-" + dto.getEaCreMbrId();
                StoreInspectionPopupRequest.SubcategoryInspection subcategory = subcategoryMap.get(compositeKey);
                if (subcategory == null) {
                    subcategory = StoreInspectionPopupRequest.SubcategoryInspection.builder()
                            .evitId(dto.getEaEvitId())
                            .answerContent(dto.getEvitAnswContent())
                            .creMbrId(dto.getEaCreMbrId())
                            .inspResultId(inspResultId)
                            .photoPaths(new ArrayList<>())
                            .build();
                    subcategoryMap.put(compositeKey, subcategory);
                }
                if (dto.getEvitAnswImgPath() != null) {
                    subcategory.getPhotoPaths().add(dto.getEvitAnswImgPath());
                }
            }
        }

        // EVIT_VLT 데이터를 composite key (evitId-inspResultId-creMbrId)로 매핑
        if (vltList != null) {
            for (StoreInspectionPopupResponse.EvitVltVO dto : vltList) {
                if (dto == null) {
                    log.warn("vltList에 null 요소가 있습니다. 건너뜁니다.");
                    continue;
                }

                String compositeKey = dto.getEvitId() + "-" + dto.getInspResultId() + "-" + dto.getCreMbrId();
                StoreInspectionPopupRequest.SubcategoryInspection subcategory = subcategoryMap.get(compositeKey);
                if (subcategory == null) {
                    subcategory = StoreInspectionPopupRequest.SubcategoryInspection.builder()
                            .evitId(dto.getEvitId())
                            .answerContent(dto.getEvitAnswContent())
                            .creMbrId(dto.getCreMbrId())
                            .inspResultId(dto.getInspResultId())
                            .photoPaths(new ArrayList<>())
                            .build();
                    subcategoryMap.put(compositeKey, subcategory);
                }

                // EVIT_VLT 필드 설정
                subcategory.setPdtNmDtplc(dto.getPdtNmDtplc());
                subcategory.setVltContent(dto.getVltContent());
                subcategory.setVltCnt(dto.getVltCnt());
                subcategory.setCaupvdCd(dto.getCaupvdCd());
                subcategory.setVltCause(dto.getVltCause());
                subcategory.setInstruction(dto.getInstruction());
                subcategory.setVltPlcCd(dto.getVltPlcCd());
            }
        }

        // subcategoryMap이 비어 있지 않은 경우에만 카테고리를 추가
        if (!subcategoryMap.isEmpty()) {
            StoreInspectionPopupRequest.CategoryInspection category = StoreInspectionPopupRequest.CategoryInspection.builder()
                    .categoryName("임시카테고리") // 실제 카테고리 이름으로 대체 필요
                    .subcategories(new ArrayList<>(subcategoryMap.values()))
                    .build();

            request.getInspections().add(category);
        }

        // inspections 리스트가 비어 있는지 확인
        if (request.getInspections().isEmpty()) {
            log.info("임시저장된 데이터가 없습니다. inspections 리스트가 비어 있습니다.");
            return null;
        }

        return request;
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

