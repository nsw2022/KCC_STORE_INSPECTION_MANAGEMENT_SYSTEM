package com.sims.login_user.vo;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginUserResponse {
    private String mbrRoleCd;
    private String mbrNm;
    private String mbrNo;
}
