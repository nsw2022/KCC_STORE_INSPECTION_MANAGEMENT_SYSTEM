package com.sims.home.member.service;

import com.sims.home.member.vo.MemberRegistRequest;
/**
 * @Description 회원가입 / 로그인 관련 서비스 클래스
 * @Author 유재원
 * @Date 2024.10.23
 */
public interface MemberService {
    /**
     * 회원가입 처리
     * @param member
     * @return 회원가입 성공 1 / 실패 0
     */
    public int insertMember(MemberRegistRequest member);
}
