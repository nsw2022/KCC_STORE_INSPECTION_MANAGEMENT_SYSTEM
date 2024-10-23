package com.sims.home.member.vo;

import lombok.*;

/**
 * @Description 회원 정보를 담는 VO 클래스
 * @Author 유재원
 * @Date 2024.10.23
 *
 * @Field mbrId 사용자 ID
 * @Field mbrNo 사번
 * @Field mbrPw 비밀번호
 * @Field mbrNm 사용자명
 * @Field mbrRoleCd 사용자 권한 코드
 * @Field mbrSttsCd 사용자 상태 코드
 * @Field tel 전화번호
 * @Field hireDt 입사일자
 * @Field quitDt 퇴사일자
 * @Field creMbrId 등록자 ID
 * @Field updMbrId 수정자 ID
 * @Field creTm 등록 시간
 * @Field updTm 수정 시간
 * @Field lastLoginTm 마지막 로그인 시간
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Member {
    private int mbrId; // 사용자 ID
    private String mbrNo; // 사번
    private String mbrPw; // 비밀번호
    private String mbrNm; // 사용자명
    private String mbrRoleCd; // 사용자 권한 코드
    private String mbrSttsCd; // 사용자 상태 코드
    private String tel; // 전화번호
    private String hireDt; // 입사일자
    private String quitDt; // 퇴사일자
    private int creMbrId; // 등록자 ID
    private int updMbrId; // 수정자 ID
    private String creTm; // 등록 시간
    private String updTm; // 수정 시간
    private String lastLoginTm; // 마지막 로그인 시간
}