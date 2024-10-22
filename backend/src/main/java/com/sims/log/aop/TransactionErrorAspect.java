package com.sims.log.aop;

import com.sims.config.common.ClientInfo;
import com.sims.home.member.mapper.MemberMapper;
import com.sims.log.mapper.LogMapper;
import com.sims.log.vo.TransactionErrorLogVo;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.lang.reflect.Method;
import java.sql.SQLException;
import java.util.Arrays;

@Aspect
@Component
@Slf4j
@RequiredArgsConstructor
public class TransactionErrorAspect {

    private final MemberMapper memberMapper;
    private final LogMapper logMapper;

    @AfterThrowing(pointcut = "execution(* com.sims..service.*Impl.*(..))", throwing = "ex")
    public void TransactionErrorLog(JoinPoint joinPoint, Exception ex) {
        if (ex.getCause() instanceof SQLException) {
            SQLException sqlEx = (SQLException) ex.getCause();
            
            int oracleErrorCode = sqlEx.getErrorCode();
            String oracleErrorMessage = sqlEx.getMessage();
            
            log.error("에러 코드 = {}", "ORA-" + String.valueOf(oracleErrorCode));
            log.error(oracleErrorMessage);

            MethodSignature methodSignature = (MethodSignature) joinPoint.getSignature();
            Method method = methodSignature.getMethod();
            HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();

            String agent = request.getHeader("USER-AGENT");
            String os = ClientInfo.getClientOS(agent);
            String browser = ClientInfo.getClientBrowser(agent);
            log.info("os = {}", os);
            log.info("browser = {}", browser);

            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String mbrId = "anonymousUser".equals(auth.getName()) ? auth.getName() : Integer.toString(memberMapper.selectMbrIdByMbrNo(auth.getName()));

            TransactionErrorLogVo transactionErrorLogVo = TransactionErrorLogVo.builder()
                    .url(request.getRequestURI())
                    .requestType(request.getMethod())
                    .method(method.getName())
                    .pramCount(method.getParameterCount())
                    .pramContent(Arrays.toString(joinPoint.getArgs()).replace("[", "").replace("]", ""))
                    .regMbrId(mbrId)
                    .regMbrIp(request.getRemoteAddr())
                    .errCd("ORA-" + String.valueOf(oracleErrorCode))
                    .errMsg(oracleErrorMessage)
                    .resBrowser(browser)
                    .resOs(os)
                    .build();
            logMapper.insertTransactionErrorLog(transactionErrorLogVo);
        } else {
            log.error("General Error occurred: {}", ex.getMessage());
        }
    }
}
