package com.sims.home.dashboard.mapper;

import com.sims.home.dashboard.domain.Member;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface MemberMapper {
    public Member getMemberByMbrId(@Param("mbrNo") String mbrNo);

    public int insertTestMember(Member member);
}
