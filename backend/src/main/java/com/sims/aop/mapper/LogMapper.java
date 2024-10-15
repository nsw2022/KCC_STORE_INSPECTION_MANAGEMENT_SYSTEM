package com.sims.aop.mapper;

import com.sims.aop.vo.LoginLogDao;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface LogMapper {
    public int insertLoginLog(LoginLogDao loginLog);
}
