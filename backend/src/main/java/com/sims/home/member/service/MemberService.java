package com.sims.home.member.service;

import com.sims.home.member.vo.MemberRegistRequest;

public interface MemberService {
    /**
     * 회원가입 처리
     * @param member
     * @return
     */
    public int insertMember(MemberRegistRequest member);
}
