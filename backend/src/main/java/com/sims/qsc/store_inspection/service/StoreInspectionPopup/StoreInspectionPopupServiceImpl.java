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



//    /**
//     * 점검 결과 임시저장 (EVIT_ANSW, EVIT_VLT, EVIT_ANSW_IMG 삽입)
//     *
//     * @param request 점검 결과 데이터
//     */
//    @Override
//    @Transactional(rollbackFor = Exception.class)
//    public void insertInspectionResult(StoreInspectionPopupRequest request) {
//        log.info("점검 결과 병합 요청 데이터: {}", request);
//        Long creMbrId = getCurrentUserId(); // 현재 사용자 ID 가져오기
//        Long inspResultId = request.getInspResultId();
//
//        if (inspResultId == null) {
//            log.error("inspResultId가 설정되지 않았습니다.");
//            throw new IllegalArgumentException("inspResultId가 설정되지 않았습니다.");
//        }
//
//        try {
//            log.info("EVIT_ANSW, EVIT_VLT, EVIT_ANSW_IMG 병합 시작.");
//            for (StoreInspectionPopupRequest.CategoryInspection category : request.getInspections()) {
//                log.info("카테고리 처리 중: {}", category.getCategoryName());
//
//                for (StoreInspectionPopupRequest.SubcategoryInspection subcategory : category.getSubcategories()) {
//                    log.info("서브카테고리 처리 중: {}", subcategory.getSubcategoryName());
//
//                    try {
//                        // inspResultId 및 creMbrId 설정
//                        subcategory.setInspResultId(inspResultId);
//                        subcategory.setCreMbrId(creMbrId);
//
//                        // 조건부 필드 설정
//                        List<String> negativeAnswers = Arrays.asList("부적합", "나쁨", "매우나쁨");
//                        subcategory.setShouldMergeVLT(negativeAnswers.contains(subcategory.getAnswerContent()));
//                        subcategory.setShouldMergeAnswImg(subcategory.getPhotoPaths() != null && !subcategory.getPhotoPaths().isEmpty());
//
//                        // EVIT_ANSW 병합
//                        log.info("EVIT_ANSW 병합 호출: {}", subcategory);
//                        storeInspectionPopupMapper.mergeEVIT_ANSW(subcategory);
//
//                        // EVIT_VLT 병합: 부적합, 나쁨, 매우나쁨일 때만 호출
//                        if (subcategory.isShouldMergeVLT()) {
//                            log.info("EVIT_VLT 병합 호출: {}", subcategory);
//                            storeInspectionPopupMapper.mergeEVIT_VLT(subcategory);
//                        } else {
//                            log.info("적합한 답변이므로 EVIT_VLT 병합을 건너뜁니다. evitId: {}", subcategory.getEvitId());
//                        }
//
//                        // EVIT_ANSW_IMG 병합 및 삭제 로직 추가: 이미지가 있을 때만 호출
//                        if (subcategory.isShouldMergeAnswImg()) {
//                            log.info("EVIT_ANSW_IMG 병합 준비: {}", subcategory.getPhotoPaths());
//                            int seq = 1;
//                            List<Integer> seqList = new ArrayList<>();
//
//                            for (String photoPath : subcategory.getPhotoPaths()) {
//                                if (photoPath == null || photoPath.isBlank()) {
//                                    log.warn("빈 사진 경로 발견, 건너뜁니다.");
//                                    continue;
//                                }
//
//                                Map<String, Object> params = new HashMap<>();
//                                params.put("evitId", subcategory.getEvitId());
//                                params.put("creMbrId", creMbrId);
//                                params.put("inspResultId", inspResultId);
//                                params.put("photoPath", photoPath);
//                                params.put("seq", seq);
//
//                                try {
//                                    log.info("EVIT_ANSW_IMG 병합 호출: {}", params);
//                                    storeInspectionPopupMapper.mergeEVIT_ANSW_IMG(params);
//                                    seqList.add(seq);
//                                    seq++;
//                                } catch (Exception e) {
//                                    log.error("EVIT_ANSW_IMG 병합 실패: {}", e.getMessage(), e);
//                                    throw e;
//                                }
//                            }
//
//                            // 불필요한 레코드 삭제
//                            if (!seqList.isEmpty()) {
//                                Map<String, Object> deleteParams = new HashMap<>();
//                                deleteParams.put("evitId", subcategory.getEvitId());
//                                deleteParams.put("creMbrId", creMbrId);
//                                deleteParams.put("inspResultId", inspResultId);
//                                deleteParams.put("seqList", seqList);
//
//                                try {
//                                    // 삭제될 이미지 경로 조회
//                                    List<String> imgPaths = storeInspectionPopupMapper.selectUnmatchedEVIT_ANSW_IMGPaths(deleteParams);
//
//                                    // S3에서 이미지 삭제
//                                    for (String imgPath : imgPaths) {
//                                        // 'inspection_img/'가 이미 포함되어 있는지 확인
//                                        String s3Key = imgPath.startsWith("inspection_img/") ? imgPath : "inspection_img/" + imgPath;
//                                        awsFileService.deleteFile(s3Key);
//                                        log.info("S3에서 이미지 삭제 완료: {}", s3Key);
//                                    }
//
//                                    // 데이터베이스에서 이미지 레코드 삭제
//                                    log.info("EVIT_ANSW_IMG 삭제 호출: {}", deleteParams);
//                                    storeInspectionPopupMapper.deleteUnmatchedEVIT_ANSW_IMG(deleteParams);
//
//                                } catch (Exception e) {
//                                    log.error("EVIT_ANSW_IMG 삭제 실패: {}", e.getMessage(), e);
//                                    throw e;
//                                }
//                            }
//                        } else {
//                            log.info("사진 경로가 없어 EVIT_ANSW_IMG 병합을 건너뜁니다.");
//                        }
//
//                    } catch (Exception e) {
//                        log.error("evitId [{}]에 대한 검사 데이터 병합 중 오류: {}", subcategory.getEvitId(), e.getMessage(), e);
//                        throw e; // 트랜잭션 롤백
//                    }
//                }
//            }
//            log.info("EVIT_ANSW, EVIT_VLT, EVIT_ANSW_IMG 병합 완료.");
//        } catch (Exception e) {
//            log.error("EVIT_ANSW, EVIT_VLT, EVIT_ANSW_IMG 병합 중 오류 발생: {}", e.getMessage(), e);
//            throw e; // 트랜잭션 롤백
//        }
//    }
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
                log.info("서브카테고리 처리 중: evitId={}, answerContent={}", subcategory.getEvitId(), subcategory.getAnswerContent());

                try {
                    // inspResultId 및 creMbrId 설정
                    subcategory.setInspResultId(inspResultId);
                    subcategory.setCreMbrId(creMbrId);

                    // 조건부 필드 설정
                    List<String> negativeAnswers = Arrays.asList("부적합", "나쁨", "매우나쁨");
                    boolean wasNegative = false;

                    // 기존 EVIT_VLT가 부정적이었는지 확인
                    StoreInspectionPopupRequest.SubcategoryInspection existingSubcategory =
                            storeInspectionPopupMapper.selectExistingEVIT_VLT(subcategory.getEvitId(), inspResultId, creMbrId);

                    if (existingSubcategory != null && negativeAnswers.contains(existingSubcategory.getAnswerContent())) {
                        wasNegative = true;
                    }

                    // **shouldMergeAnswImg 설정 추가**
                    subcategory.setShouldMergeAnswImg(subcategory.getPhotos() != null && !subcategory.getPhotos().isEmpty());

                    // EVIT_ANSW 병합
                    log.info("EVIT_ANSW 병합 호출: {}", subcategory);
                    storeInspectionPopupMapper.mergeEVIT_ANSW(subcategory);

                    // 현재 답변이 부정적인지 확인
                    boolean isNegative = negativeAnswers.contains(subcategory.getAnswerContent());

                    if (wasNegative && !isNegative) {
                        // 이전에 부정적이었으나 현재는 긍정적이면 EVIT_VLT 삭제
                        log.info("답변이 부정적에서 긍정적으로 변경됨. EVIT_VLT 삭제 호출: evitId={}, inspResultId={}, creMbrId={}",
                                subcategory.getEvitId(), inspResultId, creMbrId);
                        storeInspectionPopupMapper.deleteEVIT_VLT(subcategory.getEvitId(), inspResultId, creMbrId);
                    }

                    // EVIT_VLT 병합: 부적합, 나쁨, 매우나쁨일 때만 호출
                    if (isNegative) {
                        log.info("EVIT_VLT 병합 호출: {}", subcategory);
                        storeInspectionPopupMapper.mergeEVIT_VLT(subcategory);
                    } else {
                        log.info("적합한 답변이므로 EVIT_VLT 병합을 건너뜁니다. evitId: {}", subcategory.getEvitId());
                    }

                    // EVIT_ANSW_IMG 병합 및 삭제 로직 유지
                    if (subcategory.isShouldMergeAnswImg()) {
                        log.info("EVIT_ANSW_IMG 병합 준비: {}", subcategory.getPhotos());
                        List<Integer> seqList = new ArrayList<>();

                        for (StoreInspectionPopupRequest.Photo photo : subcategory.getPhotos()) {
                            if (photo.getPhotoPath() == null || photo.getPhotoPath().isBlank()) {
                                log.warn("빈 사진 경로 발견, 건너뜁니다.");
                                continue;
                            }

                            Map<String, Object> params = new HashMap<>();
                            params.put("evitId", subcategory.getEvitId());
                            params.put("creMbrId", creMbrId);
                            params.put("inspResultId", inspResultId);
                            params.put("photoPath", photo.getPhotoPath());
                            params.put("seq", photo.getSeq());

                            try {
                                log.info("EVIT_ANSW_IMG 병합 호출: {}", params);
                                storeInspectionPopupMapper.mergeEVIT_ANSW_IMG(params);
                                seqList.add(photo.getSeq());
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
                                    // 'inspection_img/'가 이미 포함되어 있는지 확인
                                    String s3Key = imgPath.startsWith("inspection_img/") ? imgPath : "inspection_img/" + imgPath;
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
//        Map<String, Object> params = new HashMap<>();
//        params.put("inspResultId", inspResultId);
//        params.put("creMbrId", creMbrId);
//
//        List<StoreInspectionPopupResponse.TemporaryInspectionDetailsVO> tempDetails =
//                storeInspectionPopupMapper.selectTemporaryInspectionDetails(params);
//
//        if (tempDetails == null || tempDetails.isEmpty()) {
//            log.info("임시저장된 데이터가 없습니다.");
//            return null;
//        }
//
//        StoreInspectionPopupRequest request = StoreInspectionPopupRequest.builder()
//                .inspResultId(inspResultId)
//                .inspComplW("N")
//                .inspections(new ArrayList<>())
//                .build();
//
//        StoreInspectionPopupRequest.CategoryInspection category = StoreInspectionPopupRequest.CategoryInspection.builder()
//                .categoryName("임시카테고리")
//                .subcategories(new ArrayList<>())
//                .build();
//
//        Map<String, StoreInspectionPopupRequest.SubcategoryInspection> subcategoryMap = new HashMap<>();
//
//        for (StoreInspectionPopupResponse.TemporaryInspectionDetailsVO detail : tempDetails) {
//
//            Long evitId = detail.getEvitId();
//            Long detailInspResultId = detail.getInspResultId(); // 변수 이름 변경
//            Long creMbrIdFromResult = detail.getCreMbrId();
//
//            String key = evitId + "-" + detailInspResultId + "-" + creMbrIdFromResult;
//
//            StoreInspectionPopupRequest.SubcategoryInspection subcategory = subcategoryMap.get(key);
//
//            if (subcategory == null) {
//                subcategory = StoreInspectionPopupRequest.SubcategoryInspection.builder()
//                        .evitId(evitId)
//                        .answerContent(detail.getEvitAnswContent())
//                        .creMbrId(creMbrIdFromResult)
//                        .inspResultId(detailInspResultId)
//                        .photoPaths(new ArrayList<>())
//                        .pdtNmDtplc(detail.getPdtNmDtplc())
//                        .vltContent(detail.getVltContent())
//                        .vltCnt(detail.getVltCnt())
//                        .caupvdCd(detail.getCaupvdCd())
//                        .vltCause(detail.getVltCause())
//                        .instruction(detail.getInstruction())
//                        .vltPlcCd(detail.getVltPlcCd())
//                        .build();
//
//                subcategoryMap.put(key, subcategory);
//                category.getSubcategories().add(subcategory);
//            }
//
//            if (detail.getEvitAnswImgPath() != null) {
//                subcategory.getPhotoPaths().add(detail.getEvitAnswImgPath());
//            }
//        }
//
//        request.getInspections().add(category);
//        return request;
//    }
    @Override
    @Transactional(readOnly = true)
    public StoreInspectionPopupRequest getTemporaryInspection(Long inspResultId) {
        Long creMbrId = getCurrentUserId(); // 현재 사용자 ID 가져오기
        log.info("임시저장된 점검 결과 조회 요청: inspResultId={}, creMbrId={}", inspResultId, creMbrId);

        Map<String, Object> params = new HashMap<>();
        params.put("inspResultId", inspResultId);
        params.put("creMbrId", creMbrId);

        List<StoreInspectionPopupResponse.TemporaryInspectionDetailsVO> tempDetails =
                storeInspectionPopupMapper.selectTemporaryInspectionDetails(params);

        if (tempDetails == null || tempDetails.isEmpty()) {
            log.info("임시저장된 데이터가 없습니다.");
            return null;
        }

        StoreInspectionPopupRequest request = StoreInspectionPopupRequest.builder()
                .inspResultId(inspResultId)
                .inspComplW("N")
                .inspections(new ArrayList<>())
                .build();

        StoreInspectionPopupRequest.CategoryInspection category = StoreInspectionPopupRequest.CategoryInspection.builder()
                .categoryName("임시카테고리")
                .subcategories(new ArrayList<>())
                .build();

        Map<String, StoreInspectionPopupRequest.SubcategoryInspection> subcategoryMap = new HashMap<>();

        for (StoreInspectionPopupResponse.TemporaryInspectionDetailsVO detail : tempDetails) {

            Long evitId = detail.getEvitId();
            Long detailInspResultId = detail.getInspResultId();
            Long creMbrIdFromResult = detail.getCreMbrId();

            String key = evitId + "-" + detailInspResultId + "-" + creMbrIdFromResult;

            StoreInspectionPopupRequest.SubcategoryInspection subcategory = subcategoryMap.get(key);

            if (subcategory == null) {
                subcategory = StoreInspectionPopupRequest.SubcategoryInspection.builder()
                        .evitId(evitId)
                        .answerContent(detail.getEvitAnswContent())
                        .creMbrId(creMbrIdFromResult)
                        .inspResultId(detailInspResultId)
                        .photos(new ArrayList<>()) // 변경된 부분
                        .pdtNmDtplc(detail.getPdtNmDtplc())
                        .vltContent(detail.getVltContent())
                        .vltCnt(detail.getVltCnt())
                        .caupvdCd(detail.getCaupvdCd())
                        .vltCause(detail.getVltCause())
                        .instruction(detail.getInstruction())
                        .vltPlcCd(detail.getVltPlcCd())
                        .build();

                subcategoryMap.put(key, subcategory);
                category.getSubcategories().add(subcategory);
            }

            if (detail.getEvitAnswImgPath() != null) {
                // Photo 객체 생성 및 추가
                StoreInspectionPopupRequest.Photo photo = StoreInspectionPopupRequest.Photo.builder()
                        .seq(detail.getSeq())
                        .photoPath(detail.getEvitAnswImgPath())
                        .build();
                subcategory.getPhotos().add(photo);
            }
        }

        request.getInspections().add(category);
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

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateTotalValues(StoreInspectionPopupRequest request) {
        log.info("updateTotalValues 호출 - 총점: {}, 총과태료: {}, 총영업정지일수: {}", request.getTotalScore(), request.getTotalPenalty(), request.getTotalClosureDays());
        try {
            storeInspectionPopupMapper.updateINSP_RESULTTotals(request);
        } catch (Exception e) {
            log.error("총점, 총과태료, 총영업정지일수 업데이트 중 오류 발생: {}", e.getMessage(), e);
            throw e;
        }
    }


    /**
     * 점검 완료 정보 저장 (서명 이미지 경로와 총평)
     *
     * @param inspResultId  점검 결과 ID
     * @param signImgPath   서명 이미지 경로
     * @param totalReview   총평
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void completeInspection(Long inspResultId, String signImgPath, String totalReview) {
        log.info("completeInspection 호출됨: inspResultId={}, signImgPath={}, totalReview={}", inspResultId, signImgPath, totalReview);

        if (inspResultId == null) {
            log.error("inspResultId가 null입니다.");
            throw new IllegalArgumentException("inspResultId는 필수입니다.");
        }

        // INSP_RESULT 업데이트
        StoreInspectionPopupRequest updateRequest = StoreInspectionPopupRequest.builder()
                .inspResultId(inspResultId)
                .signImgPath(signImgPath)
                .totalReview(totalReview)
                .build();

        try {
            storeInspectionPopupMapper.updateInspResultCompletion(updateRequest);
            log.info("INSP_RESULT 업데이트 완료: inspResultId={}", inspResultId);
        } catch (Exception e) {
            log.error("INSP_RESULT 업데이트 실패: {}", e.getMessage(), e);
            throw e; // 트랜잭션 롤백
        }

        // INSP_SCHD 업데이트
        try {
            storeInspectionPopupMapper.updateInspSchdStatus(updateRequest);
            log.info("INSP_SCHD 업데이트 완료: inspResultId={}", inspResultId);
        } catch (Exception e) {
            log.error("INSP_SCHD 업데이트 실패: {}", e.getMessage(), e);
            throw e; // 트랜잭션 롤백
        }
    }

}

