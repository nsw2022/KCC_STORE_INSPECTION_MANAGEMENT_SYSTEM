package com.sims.config.common.aop;



import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
/**
 * @Description 권한 체크 AOP 클래스 - 점검자, SV만 가능
 * @Author 노승우
 * @Date 2024.10.26
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface SVInspectorRolCheck {
}
