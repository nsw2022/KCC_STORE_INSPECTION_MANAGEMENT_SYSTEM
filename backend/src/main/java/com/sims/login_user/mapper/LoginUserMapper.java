package com.sims.login_user.mapper;

import com.sims.login_user.vo.LoginUserResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface LoginUserMapper {
    LoginUserResponse selectLoginUser(@Param("mbrNo") String mbrNo);
}
