package com.sims.log.vo;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * @Description 트랜잭션 로그를 담을 VO 클래스
 * @Author 유재원
 * @Date 2024.10.23
 *
 * @Field trgId 트랜잭션 ID
 * @Field execDt 실행일자
 * @Field url 요청된 URL
 * @Field HTTP 요청 방식 (GET, POST 등)
 * @Field method 메서드명 (service)
 * @Field pramCount 파라미터 개수
 * @Field pramContent 파라미터 내용
 * @Field regMbrId 등록자 ID
 * @Field regMbrIp 등록자 IP
 * @Field trgSttsCd 트랜잭션 상태 코드
 * @Field resMs 응답 시간 (ms)
 * @Field resBrowser 요청 브라우저
 * @Field resOs 요청 OS
 */
@Getter
@Setter
@Builder
@ToString
public class TransactionLogVo {
    private String trgId;
    private String execDt;
    private String url;
    private String requestType;
    private String method;
    private int pramCount;
    private String pramContent;
    private String regMbrId;
    private String regMbrIp;
    private String trgSttsCd;
    private String resMs;
    private String resBrowser;
    private String resOs;
}