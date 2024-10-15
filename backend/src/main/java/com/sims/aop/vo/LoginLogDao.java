package com.sims.aop.vo;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LoginLogDao {
    private int loginLogId; // 로그인로그 ID
    private int connectionId; // 접속 ID
    private String connectionIp; // 접속 IP
    private boolean errorOccurrenceCd; // 오류 발생여부 코드
    private boolean errorCode; // 오류 코드
}
