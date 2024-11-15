package com.sims.login_user.service;

import com.sims.login_user.mapper.LoginUserMapper;
import com.sims.login_user.vo.LoginUserResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LoginUserServiceImpl implements LoginUserService {
    @Autowired
    private LoginUserMapper loginUserMapper;

    @Override
    public LoginUserResponse getLoginUserInfo(String mbrNo) {
        return loginUserMapper.selectLoginUser(mbrNo);
    }
}
