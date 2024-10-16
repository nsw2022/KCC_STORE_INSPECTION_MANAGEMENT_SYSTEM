package com.sims.config.security;

import com.sims.aop.mapper.LogMapper;
import com.sims.aop.vo.LoginLogDao;
import com.sims.home.member.mapper.MemberMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

import static com.sims.config.common.ClientInfo.getClientBrowser;
import static com.sims.config.common.ClientInfo.getClientOS;

@Slf4j
@Component
@RequiredArgsConstructor
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final MemberMapper memberMapper;
    private final LogMapper logMapper;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        log.info("login ID = {}", authentication.getName());
        log.info("login IP = {}", request.getRemoteAddr());
        log.info("login OS = {}", getClientOS(request.getHeader("USER-AGENT")));
        log.info("login browser = {}", getClientBrowser(request.getHeader("USER-AGENT")));

        memberMapper.updateLastLoginDate(authentication.getName());

        LoginLogDao loginLogDao = LoginLogDao.builder()
                .connectionId(authentication.getName())
                .connectionIp(request.getRemoteAddr())
                .connectionOs(getClientOS(request.getHeader("USER-AGENT")))
                .connectionBrowser(getClientBrowser(request.getHeader("USER-AGENT")))
                .errorOccurrenceCd("0")
                .build();

        logMapper.insertLoginLog(loginLogDao);

        response.sendRedirect("/");
    }
}
