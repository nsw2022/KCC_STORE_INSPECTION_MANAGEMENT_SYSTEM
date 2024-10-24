package com.sims.qsc.store_inspection.vo;

import lombok.*;
/**
 * @Description 가맹점 전체보기
 * @Author 노승우
 * @Date 2024.10.24
 *
 */
@Getter
@Setter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StoreAllLocationResponse {
    private String storeNm;
    private String storeId;
    private Double latitude;
    private Double longitude;
    private String mbrNo;
    private String brandNm;
    private String inspectorName;
    private String supervisorName;
}
