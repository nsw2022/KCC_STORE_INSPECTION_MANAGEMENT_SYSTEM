package com.sims.aop.mapper;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface LogMapper {
    public int insertLoginLog();
}
