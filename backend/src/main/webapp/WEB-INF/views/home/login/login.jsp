<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html lang="ko">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link
	href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
	rel="stylesheet"
	integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
	crossorigin="anonymous">
<script
	src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
	integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
	crossorigin="anonymous"></script>
<link
	href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css"
	rel="stylesheet" />
<!-- Font Awesome (아이콘 사용 시) -->
<link rel="stylesheet"
	href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
<link rel="stylesheet"
	href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
	integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg=="
	crossorigin="anonymous" referrerpolicy="no-referrer" />
<!-- Option 1: Include in HTML -->
<link rel="stylesheet"
	href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css">
<script
	src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"
	integrity="sha512-v2CJ7UaYy4JwqLDIrZUI/4hqeoQieOmAZNXBeQyjo21dadnwR+8ZaIJVT8EE2iyI61OV8e6M8PP2/4hpQINQ/g=="
	crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<link rel="stylesheet" href="/resources/css/home/login/login.css">
<title>점포점검관리시스템</title>
</head>
<!-- SweetAlert2 JS -->
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="/resources/js/home/login/login.js">
    
  </script>
<body>
	<div class="container-fluid">
		<div class="row">
			<div
				class="col-md-6 login_area border d-flex justify-content-center align-items-center">
				<div
					class="container-fluid d-flex flex-column sub_container align-items-center">
					<div class="header_text text-center">점포점검관리시스템</div>
					<div class="header_sub_text text-center">Store Inspection
						Management System</div>
					<div
						class="line_area d-flex justify-content-between my-4 align-items-center">
						<div class="line"></div>
						<div class="line_text">로그인이 필요합니다</div>
						<div class="line"></div>
					</div>

					<form class="input_area" action="/loginprocess" method="post">
						<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>
						<div class="empno_area d-flex border mb-2 align-items-center">
							<i class="fa-regular fa-lg fa-envelope mx-2"
								style="color: #c4c9ed;"></i> <input type="text" name="mbrNo"
								class="empno_input" placeholder="사번">
						</div>
						<div class="password_area d-flex border align-items-center">
							<i class="bi bi-shield fa-lg mx-2" style="color: #c4c9ed;"></i> <input
								type="password" name="mbrPw" class="password_input" placeholder="비밀번호" autocomplete="current-password">
							<i class="fa-regular fa-lg fa-eye-slash mx-4"
								style="color: #c4c9ed;"></i>
						</div>
						<div class="extra_area mt-3 d-flex align-items-center">
							<input type="checkbox" class="me-2">
							<p class="remember_text mb-0">사번 기억하기</p>
							<p class="find_password_text mb-0">비밀번호 찾기</p>
						</div>
						<div class="login_btn_area mt-4">
							<button type="submit" class="login_btn">로그인</button>
						</div>
					</form>
				</div>
			</div>
			<div class="col-md-6 design_area border"></div>
		</div>
	</div>
</body>

</html>
