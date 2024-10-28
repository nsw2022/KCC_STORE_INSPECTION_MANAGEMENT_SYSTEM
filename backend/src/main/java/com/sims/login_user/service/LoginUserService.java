package com.sims.login_user.service;

import com.sims.login_user.vo.LoginUserResponse;

public interface LoginUserService {
    LoginUserResponse getLoginUserInfo(String mbrNo);
}
