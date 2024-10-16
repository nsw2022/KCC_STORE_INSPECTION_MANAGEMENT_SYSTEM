package com.sims.aop.vo;

import lombok.*;

@Getter
@Setter
@Builder
public class LoginLogDao {
    private String connectionId; // 접속 ID
    private String connectionIp; // 접속 IP
    private String connectionOs; // 접속 OS
    private String connectionBrowser; // 접속 Browser
    private String errorOccurrenceCd; // 오류 발생여부 코드
    private String errorCode; // 오류 코드
}
