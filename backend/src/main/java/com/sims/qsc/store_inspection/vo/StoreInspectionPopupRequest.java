package com.sims.qsc.store_inspection.vo;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class StoreInspectionPopupRequest {
    private String storeNm;        // 가맹점명
    private String brandNm;        // 브랜드명
    private String inspPlanDt;     // 점검 예정일
    private String inspSttsCd;     // 점검 상태 코드
    private String openHm;         // 개점 시간
    private String mbrNm;          // 점검자 이름
    private String mbrNo;          // 점검자 번호
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
}
