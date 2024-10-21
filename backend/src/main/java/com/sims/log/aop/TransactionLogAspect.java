package com.sims.log.aop;

import com.sims.home.member.mapper.MemberMapper;
import com.sims.log.mapper.LogMapper;
import com.sims.log.vo.TransactionLogVo;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.lang.reflect.Method;
import java.util.Arrays;

/**
 * 로깅 관련 AOP 구성
 *
 * @author : 유재원
 * @fileName : TransactionLogAspect
 * @since : 2024/10/18
 */
@Aspect
@Component
@Slf4j
public class TransactionLogAspect {
    private long requestTime;
    private long responseTime;

    @Autowired
    private MemberMapper memberMapper;

    @Autowired
    private LogMapper logMapper;

    @Pointcut("execution(* com.sims..service.*Impl.*(..))")
    public void serviceMethods() {}
//
//    @Before("serviceMethods()")
//    public void beforeServiceMethod(JoinPoint joinPoint) {
//        requestTime = System.currentTimeMillis();
//        log.info("requestTime = {}", requestTime);
//    }

    @Around("serviceMethods()")
    public Object logTransaction(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis(); // 요청 시간
        log.info("requestTime = {}", startTime);

        // 메서드 실행
        Object result = joinPoint.proceed();

        long endTime = System.currentTimeMillis(); // 응답 시간
        log.info("responseTime = {}", endTime);
        log.info("responseTime - requestTime = {}ms", endTime - startTime);

        MethodSignature methodSignature = (MethodSignature) joinPoint.getSignature();
        Method method = methodSignature.getMethod();
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String mbrId = "anonymousUser".equals(auth.getName()) ? auth.getName() : Integer.toString(memberMapper.getMbrIdByMbrNo(auth.getName()));

        TransactionLogVo transactionLogVo = TransactionLogVo.builder()
                .url(request.getRequestURI())
                .requestType(request.getMethod())
                .method(method.getName())
                .pramCount(method.getParameterCount())
                .pramContent(Arrays.toString(joinPoint.getArgs()).replace("[", "").replace("]", ""))
                .regMbrId(mbrId)
                .regMbrIp(request.getRemoteAddr())
                .trgSttsCd("1")
                .resMs(Long.toString(endTime - startTime))
                .build();

        log.info("transactionLogVo = {}", transactionLogVo);

        try {
            logMapper.insertTransactionLog(transactionLogVo);
        } catch (Exception e) {
            log.error("트랜잭션 로그 저장 실패", e);
        }

        return result;
    }
}
