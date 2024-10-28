package com.sims.login_user.controller;

import com.sims.login_user.service.LoginUserService;
import com.sims.login_user.vo.LoginUserResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginUserRestController {
    @Autowired
    private LoginUserService loginUserService;

    @RequestMapping("/loginUserInfo")
    public LoginUserResponse getLoginUserInfo() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName(); // mbrNo

        LoginUserResponse userInfo = loginUserService.getLoginUserInfo(username);
        return userInfo;
    }
}
