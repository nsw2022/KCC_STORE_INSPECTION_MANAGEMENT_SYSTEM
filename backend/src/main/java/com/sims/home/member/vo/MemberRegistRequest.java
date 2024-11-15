package com.sims.home.member.vo;

import lombok.*;

/**
 * @Description 회원가입 request 정보를 담는 VO 클래스
 * @Author 유재원
 * @Date 2024.10.23
 *
 * @Field mbrNo 사번
 * @Field mbrPw 비밀번호
 * @Field mbrNm 사용자명
 * @Field mbrRoleCd 사용자 권한 코드
 * @Field tel 전화번호
 * @Field hireDt 입사일자
 * @Field creMbrId 등록자 ID
 */
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
