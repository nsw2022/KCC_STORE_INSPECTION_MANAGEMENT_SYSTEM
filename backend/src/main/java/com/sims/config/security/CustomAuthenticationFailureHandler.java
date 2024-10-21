package com.sims.config.security;

import com.sims.log.mapper.LogMapper;
import com.sims.log.vo.LoginLogVo;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

import static com.sims.config.common.ClientInfo.getClientBrowser;
import static com.sims.config.common.ClientInfo.getClientOS;

@Slf4j
@Component
@RequiredArgsConstructor
public class CustomAuthenticationFailureHandler implements AuthenticationFailureHandler{
    private final LogMapper logMapper;
    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        log.info("login ID = {}", request.getParameter("mbrNo"));
        log.info("login IP = {}", request.getRemoteAddr());
        log.info("login OS = {}", getClientOS(request.getHeader("USER-AGENT")));
        log.info("login browser = {}", getClientBrowser(request.getHeader("USER-AGENT")));

        LoginLogVo loginLogVo = LoginLogVo.builder()
                .connectionId(request.getParameter("mbrNo"))
                .connectionIp(request.getRemoteAddr())
                .connectionOs(getClientOS(request.getHeader("USER-AGENT")))
                .connectionBrowser(getClientBrowser(request.getHeader("USER-AGENT")))
                .errorOccurrenceCd("1")
                .build();

        logMapper.insertLoginLog(loginLogVo);

        response.sendRedirect("/login?error");

    }


}
