package com.sims.config.security;

import com.sims.aop.mapper.LogMapper;
import com.sims.aop.vo.LoginLogDao;
import com.sims.home.member.mapper.MemberMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final MemberMapper memberMapper;
    private final LogMapper logMapper;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        log.info("login ID = {}", authentication.getName());
        log.info("login PW = {}", authentication.getCredentials());
        log.info("login IP = {}", request.getRemoteAddr());
        log.info("login OS = {}", getClientOS(request.getHeader("USER-AGENT")));
        log.info("login browser = {}", getClientBrowser(request.getHeader("USER-AGENT")));

        memberMapper.updateLastLoginDate(authentication.getName());

        LoginLogDao loginLogDao = LoginLogDao.builder()
                .connectionId(authentication.getName())
                .connectionIp(request.getRemoteAddr())
                .connectionOs(getClientOS(request.getHeader("USER-AGENT")))
                .connectionBrowser(getClientBrowser(request.getHeader("USER-AGENT")))
                .build();


        logMapper.insertLoginLog(loginLogDao);


        response.sendRedirect("/");
    }

    public static String getClientOS(String userAgent) {
        String os = "";
        userAgent = userAgent.toLowerCase();
        if (userAgent.indexOf("windows nt 10.0") > -1) {
            os = "Windows10";
        }else if (userAgent.indexOf("windows nt 6.1") > -1) {
            os = "Windows7";
        }else if (userAgent.indexOf("windows nt 6.2") > -1 || userAgent.indexOf("windows nt 6.3") > -1 ) {
            os = "Windows8";
        }else if (userAgent.indexOf("windows nt 6.0") > -1) {
            os = "WindowsVista";
        }else if (userAgent.indexOf("windows nt 5.1") > -1) {
            os = "WindowsXP";
        }else if (userAgent.indexOf("windows nt 5.0") > -1) {
            os = "Windows2000";
        }else if (userAgent.indexOf("windows nt 4.0") > -1) {
            os = "WindowsNT";
        }else if (userAgent.indexOf("windows 98") > -1) {
            os = "Windows98";
        }else if (userAgent.indexOf("windows 95") > -1) {
            os = "Windows95";
        }else if (userAgent.indexOf("iphone") > -1) {
            os = "iPhone";
        }else if (userAgent.indexOf("ipad") > -1) {
            os = "iPad";
        }else if (userAgent.indexOf("android") > -1) {
            os = "android";
        }else if (userAgent.indexOf("mac") > -1) {
            os = "mac";
        }else if (userAgent.indexOf("linux") > -1) {
            os = "Linux";
        }else{
            os = "Other";
        }
        return os;
    }
    public static String getClientBrowser(String userAgent) {
        String browser = "";

        if (userAgent.indexOf("Trident/7.0") > -1) {
            browser = "ie11";
        }
        else if (userAgent.indexOf("MSIE 10") > -1) {
            browser = "ie10";
        }
        else if (userAgent.indexOf("MSIE 9") > -1) {
            browser = "ie9";
        }
        else if (userAgent.indexOf("MSIE 8") > -1) {
            browser = "ie8";
        }
        else if (userAgent.indexOf("Chrome/") > -1) {
            browser = "Chrome";
        }
        else if (userAgent.indexOf("Chrome/") == -1 && userAgent.indexOf("Safari/") >= -1) {
            browser = "Safari";
        }
        else if (userAgent.indexOf("Firefox/") >= -1) {
            browser = "Firefox";
        }
        else {
            browser ="Other";
        }
        return browser;
    }
}
