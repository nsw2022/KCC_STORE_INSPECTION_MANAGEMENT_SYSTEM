package com.sims.log.vo;

import lombok.*;

/**
 * @Description 로그인 로그 정보를 담을 VO 클래스
 * @Author 유재원
 * @Date 2024.10.23
 *
 * @Field connectionId 접속 ID
 * @Field connectionIp 접속 IP
 * @Field connectionOs 접속 OS
 * @Field connectionBrowser 접속 Browser
 * @Field errorOccurrenceCd 오류 발생여부 코드
 * @Field errorCode 오류 코드
 */
@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class LoginLogVo {
    private String connectionId; // 접속 ID
    private String connectionIp; // 접속 IP
    private String connectionOs; // 접속 OS
    private String connectionBrowser; // 접속 Browser
    private String errorOccurrenceCd; // 오류 발생여부 코드
    private String errorCode; // 오류 코드
}
