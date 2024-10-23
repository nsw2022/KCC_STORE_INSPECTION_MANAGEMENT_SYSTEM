package com.sims.config.common.aop;

import com.sims.config.Exception.CustomException;
import com.sims.config.Exception.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * @Description 권한 체크 AOP 클래스
 * @Author 유재원
 * @Date 2024.10.23
 */
@Aspect
@Component
@Slf4j
public class RoleCheckAspect {
    /**
     * 관리자 권한 체크
     * @param joinPoint
     * @throws Throwable
     */
    @Around("@annotation(com.sims.config.common.aop.ARoleCheck)")
    public Object checkAdminRole(ProceedingJoinPoint joinPoint) throws Throwable {
        GrantedAuthority role = (GrantedAuthority) SecurityContextHolder.getContext().getAuthentication().getAuthorities().iterator().next();
        String roleName = role.getAuthority();

        if (!"MR001".equals(roleName)) {
            throw new CustomException(ErrorCode.HANDLE_ACCESS_DENIED);
        }

        return joinPoint.proceed();
    }

    /**
     * 품질 관리자 권한 체크
     * @param joinPoint
     * @throws Throwable
     */
    @Around("@annotation(com.sims.config.common.aop.PRoleCheck)")
    public Object checkProductManagerRole(ProceedingJoinPoint joinPoint) throws Throwable {
        GrantedAuthority role = (GrantedAuthority) SecurityContextHolder.getContext().getAuthentication().getAuthorities().iterator().next();
        String roleName = role.getAuthority();

        if (!"MR002".equals(roleName) && !"MR001".equals(roleName)) {
            throw new CustomException(ErrorCode.HANDLE_ACCESS_DENIED);
        }

        return joinPoint.proceed();
    }

    /**
     * SV 권한 체크
     * @param joinPoint
     * @throws Throwable
     */
    @Around("@annotation(com.sims.config.common.aop.SRoleCheck)")
    public Object checkSupervisorRole(ProceedingJoinPoint joinPoint) throws Throwable {
        GrantedAuthority role = (GrantedAuthority) SecurityContextHolder.getContext().getAuthentication().getAuthorities().iterator().next();
        String roleName = role.getAuthority();

        if (!"MR003".equals(roleName) && !"MR002".equals(roleName) && !"MR001".equals(roleName)) {
            throw new CustomException(ErrorCode.HANDLE_ACCESS_DENIED);
        }

        return joinPoint.proceed();
    }

    /**
     * 점검자 권한 체크
     * @param joinPoint
     * @throws Throwable
     */
    @Around("@annotation(com.sims.config.common.aop.CRoleCheck)")
    public Object checkInspectorRole(ProceedingJoinPoint joinPoint) throws Throwable {
        GrantedAuthority role = (GrantedAuthority) SecurityContextHolder.getContext().getAuthentication().getAuthorities().iterator().next();
        String roleName = role.getAuthority();

        if (!"MR004".equals(roleName) && !"MR003".equals(roleName) && !"MR002".equals(roleName) && !"MR001".equals(roleName)) {
            throw new CustomException(ErrorCode.HANDLE_ACCESS_DENIED);
        }

        return joinPoint.proceed();
    }

    /**
     * 점검자 전용 권한 체크
     * @param joinPoint
     * @throws Throwable
     */
    @Around("@annotation(com.sims.config.common.aop.IRoleCheck)")
    public Object checkInspectorOnlyRole(ProceedingJoinPoint joinPoint) throws Throwable {
        GrantedAuthority role = (GrantedAuthority) SecurityContextHolder.getContext().getAuthentication().getAuthorities().iterator().next();
        String roleName = role.getAuthority();

        if (!"MR004".equals(roleName)) {
            throw new CustomException(ErrorCode.HANDLE_ACCESS_DENIED);
        }

        return joinPoint.proceed();
    }
}
