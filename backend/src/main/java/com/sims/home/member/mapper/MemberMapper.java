package com.sims.home.member.mapper;

import com.sims.home.member.vo.MemberDao;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MemberMapper {
    public MemberDao getMbrByMbrId(String mbrNo);
    public int getMbrIdByMbrNo(String mbrNo);

    public int insertMbr(MemberDao member);

    public int updateLastLoginDate(String mbrNo);


}
