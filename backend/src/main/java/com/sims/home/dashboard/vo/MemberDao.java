package com.sims.home.dashboard.vo;

import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Builder
@ToString
public class MemberDao {
    private int mbrId; // 사용자ID
    private String mbrNo; // 사번
    private String mbrPw; // 비밀번호
    private String mbrNm; // 사용자명
    private List<String> mbrRoleCd; // 사용자 권한 코드
    private int mbrSttsCd; // 사용자 상태 코드
    private String tel; // 전화번호
    private String hireDt; // 입사일자
    private String quitDt; // 퇴사일자
    private int creMbrId; // 등록자 ID
    private int updMbrId; // 수정자 ID
    private String creTm; // 등록 시간
    private String updTm; // 수정 시간
    private String lastLoginTm; // 마지막 로그인 시간

    @Builder
    public MemberDao(int mbrId, String mbrNo, String mbrPw, String mbrNm,
                     List<String> mbrRoleCd, int mbrSttsCd, String tel,
                     String hireDt, String quitDt, int creMbrId,
                     int updMbrId, String creTm, String updTm, String lastLoginTm) {
        this.mbrId = mbrId;
        this.mbrNo = mbrNo;
        this.mbrPw = mbrPw;
        this.mbrNm = mbrNm;
        this.mbrRoleCd = mbrRoleCd != null ? mbrRoleCd : new ArrayList<>(); // null 체크
        this.mbrSttsCd = mbrSttsCd;
        this.tel = tel;
        this.hireDt = hireDt;
        this.quitDt = quitDt;
        this.creMbrId = creMbrId;
        this.updMbrId = updMbrId;
        this.creTm = creTm;
        this.updTm = updTm;
        this.lastLoginTm = lastLoginTm;
    }

}