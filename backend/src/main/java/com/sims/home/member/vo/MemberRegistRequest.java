package com.sims.home.member.vo;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class MemberRegistRequest {
    private String mbrNo; // 사번
    private String mbrPw; // 비밀번호
    private String mbrNm; // 사용자명
    private String mbrRoleCd; // 사용자 권한 코드
    private String tel; // 전화번호
    private String hireDt; // 입사일자
    private int creMbrId; // 등록자 ID
}
