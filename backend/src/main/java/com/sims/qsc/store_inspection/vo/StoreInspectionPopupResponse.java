package com.sims.qsc.store_inspection.vo;

import lombok.*;

/**
 * @Description 점검 팝업
 * @Author 이지훈
 * @Date 2024.10.21
 *
 * @field  String storeNm - 가맹점명
 * @field  String brandNm - 브랜드명
 * @field  String inspPlanDt - 점검 예정일
 * @field  String inspSttsCd - 점검 상태 코드
 * @field  String openHm - 개점 시간
 * @field  String mbrNm - 점검자 이름
 * @field  String mbrNo - 점검자 번호
 * @field  String chklstNm - 체크리스트 이름
 * @field  Integer totalScore - 총 점수
 *
 * @field  Long ctgId - 분류ID
 * @field  String ctgNm - 분류명
 * @field  Long chklstId - 체크리스트ID
 * @field  Long masterCtgId - 마스터분류ID
 * @field  Integer stndScore - 기준 점수
 * @field  String evitContent - 평가항목내용
 * @field  String evitTypeCd - 평가항목유형코드
 * @field  Integer scoreChklstEvit - 대분류점수
 * @field  String chclstContent - 선택지 내용
 * @field  String evitId - 평가항목ID
 * @field  String nprfsCd - 부적합강도코드
 * @field  Integer penalty - 과태료
 * @field  Integer scoreEvitChclst - 문항점수
 */

@Getter
@Setter
@Builder
public class StoreInspectionPopupResponse {
    private String storeNm;        // 가맹점명
    private String brandNm;        // 브랜드명
    private Long inspSchdId;       // INSP_SCHD_ID
    private String inspPlanDt;     // 점검 예정일
    private String inspSttsCd;     // 점검 상태 코드
    private String openHm;         // 개점 시간
    private String mbrNm;          // 점검자 이름
    private String mbrNo;          // 점검자 번호
    private Long mbrId;          // 점검자 ID
    private String chklstNm;       // 체크리스트 이름
    private Integer totalScore;    // 총 점수


    // 추가 필드
    private Long ctgId;                // CTG_ID
    private String ctgNm;              // CTG_NM
    private Long chklstId;             // CHKLST_ID
    private Long masterCtgId;          // MASTER_CTG_ID
    private Integer stndScore;         // STND_SCORE
    private String evitContent;        // EVIT_CONTENT
    private String evitTypeCd;         // EVIT_TYPE_CD
    private Integer scoreChklstEvit;   // SCORE(CHKLST_EVIT)
    private String chclstContent;      // CHCLST_CONTENT
    private String evitId;             // EVIT_ID
    private String nprfsCd;            // NPRFS_CD
    private Integer penalty;           // PENALTY
    private Integer scoreEvitChclst;   // SCORE(EVIT_CHCLST)


//    @Getter
//    @Setter
//    @NoArgsConstructor
//    @ToString
//    public static class EvitAnswImgVO {
//        private String evitAnswContent;
//        private Long eaEvitId;
//        private Long eaCreMbrId;
//        private String evitAnswImgPath;
//        private Long eaiEvitId;
//        private Long eaiCreMbrId;
//        private Integer seq;
//    }
//
//    @Getter
//    @Setter
//    @NoArgsConstructor
//    @ToString
//    public static class EvitVltVO {
//        private Long vltId;
//        private Long evitId;
//        private Long inspResultId;
//        private String pdtNmDtplc;
//        private String vltContent;
//        private Integer vltCnt;
//        private String caupvdCd;
//        private String vltCause;
//        private String instruction;
//        private String vltPlcCd;
//        private Long creMbrId;
//        private String creTm;
//        private String evitAnswContent;
//        private String evitAnswImgPath;
//        private Integer seq;
//    }

    @Getter
    @Setter
    @NoArgsConstructor
    @ToString
    public static class TemporaryInspectionDetailsVO{
        private Long vltId;
        private Long evitId;
        private Long inspResultId;
        private String pdtNmDtplc;
        private String vltContent;
        private Integer vltCnt;
        private String caupvdCd;
        private String vltCause;
        private String instruction;
        private String vltPlcCd;
        private Long creMbrIdEvVLT; // EVIT_VLT의 CRE_MBR_ID
        private String creTmEvVLT;   // EVIT_VLT의 CRE_TM
        private String evitAnswContent;
        private String evitAnswImgPath;
        private Integer seq;
        private Long creMbrId; // INSP_RESULT의 CRE_MBR_ID
    }
}
