package com.sims.home.member.mapper;

import com.sims.home.member.vo.MemberDao;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface MemberMapper {
    public MemberDao getMemberByMbrId(String mbrNo);

    public int insertMember(MemberDao member);

    public int updateLastLoginDate(String mbrNo);
}
