package com.sims.home.dashboard.mapper;

import com.sims.home.dashboard.vo.MemberDao;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface MemberMapper {
    public MemberDao getMemberByMbrId(@Param("mbrNo") String mbrNo);

    public int insertTestMember(MemberDao member);
}
