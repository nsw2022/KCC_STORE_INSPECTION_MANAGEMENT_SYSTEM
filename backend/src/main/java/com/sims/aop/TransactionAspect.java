package com.sims.aop;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class TransactionAspect {

    @Pointcut("execution(* com.sims..*Impl.*(..))")
    public void transactionPointcut() {}
}
