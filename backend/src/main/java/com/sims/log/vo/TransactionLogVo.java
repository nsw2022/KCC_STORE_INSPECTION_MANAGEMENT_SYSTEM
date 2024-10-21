package com.sims.log.vo;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 트랜잭션 로그 정보를 담는 vo 클래스.
 */
@Getter
@Setter
@Builder
@ToString
public class TransactionLogVo {

    /** 트랜잭션 ID */
    private String trgId;

    /** 실행일자 */
    private String execDt;

    /** 요청된 URL */
    private String url;

    /** 요청 방식 (GET, POST 등) */
    private String requestType;

    /** 메서드명 */
    private String method;

    /** 파라미터 개수 */
    private int pramCount; // 파라미터 개수

    /** 파라미터 내용 */
    private String pramContent;

    /** 등록자 ID */
    private String regMbrId; // 등록자 ID

    /** 등록자 IP */
    private String regMbrIp; // 등록자 IP

    /** 트랜잭션 상태 코드 */
    private String trgSttsCd; // 트랜잭션 상태 코드

    /** 응답 시간 (ms) */
    private String resMs; // 응답 시간
}