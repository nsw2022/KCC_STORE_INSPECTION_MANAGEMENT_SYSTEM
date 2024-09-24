<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>Login</title>
<style>
body {
	font-family: Arial, sans-serif;
	background-color: #f4f4f4;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	margin: 0;
}

.login-container {
	display: flex;
	width: 900px; /* Adjust the width as needed */
	background-color: white;
	border-radius: 8px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	overflow: hidden;
}

.signin-section {
	flex: 1;
	padding: 60px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background-color: #ffffff;
}

.signin-section h2 {
	margin: 0;
	font-size: 28px;
	color: #0044cc;
	font-weight: bold;
}

.signin-section .social-buttons {
	display: flex;
	margin: 20px 0;
}

.signin-section .social-buttons a {
	margin: 0 10px;
	font-size: 18px;
	color: #555;
	text-decoration: none;
}

.signin-section .social-buttons a:hover {
	color: #0044cc;
}

.signin-section input[type="text"], .signin-section input[type="password"]
	{
	width: 100%;
	padding: 12px;
	margin: 8px 0;
	border: 1px solid #ddd;
	border-radius: 4px;
	box-sizing: border-box;
	font-size: 14px;
}

.signin-section a {
	color: #666;
	font-size: 14px;
	text-decoration: none;
	margin-top: 10px;
	display: inline-block;
}

.signin-section a:hover {
	text-decoration: underline;
}

.signin-section button {
	width: 100%;
	padding: 12px;
	background: #8E2DE2; /* fallback for old browsers */ background :
	-webkit-linear-gradient( to left, #4A00E0, #8E2DE2);
	/* Chrome 10-25, Safari 5.1-6 */ background : linear-gradient( to left,
	#4A00E0, #8E2DE2);
	/* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	font-size: 16px;
	margin-top: 20px;
	background: -webkit-linear-gradient(to left, #4A00E0, #8E2DE2);
	/* Chrome 10-25, Safari 5.1-6 */
	background: linear-gradient(to left, #4A00E0, #8E2DE2);
}

.signin-section button:hover {
	background-color: #003bb3;
}

.welcome-section {
	flex: 1;
	background: #8E2DE2; /* fallback for old browsers */
	background: -webkit-linear-gradient(to left, #4A00E0, #8E2DE2);
	/* Chrome 10-25, Safari 5.1-6 */
	background: linear-gradient(to left, #4A00E0, #8E2DE2);
	/* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
	color: white;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 60px;
}

.welcome-section h2 {
	font-size: 28px;
	margin-bottom: 20px;
}

.welcome-section p {
	font-size: 16px;
	margin-bottom: 40px;
	text-align: center;
}

.welcome-section button {
	padding: 12px 30px;
	background-color: transparent;
	color: white;
	border: 2px solid white;
	border-radius: 4px;
	font-size: 16px;
	cursor: pointer;
}

.welcome-section button:hover {
	background-color: rgba(255, 255, 255, 0.2);
}
</style>
</head>
<script>
	this.window =open()
</script>
<body>
	<div class="login-container">
		<div class="signin-section">
			<h2>로그인</h2>
			<div class="social-buttons">
				<a href="#"><i class="fa fa-facebook"></i> Facebook</a> <a href="#"><i
					class="fa fa-google"></i> Google</a> <a href="#"><i
					class="fa fa-linkedin"></i> LinkedIn</a>
			</div>
			<form action="/loginProcess" method="post">
				<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>
				<input type="text" name="username" placeholder="ID" required>
				<input type="password" name="password" placeholder="Password" required>
				<c:if test="${error}">
					<p id="valid" class="alert alert-danger">${exception}</p>
				</c:if>
				<a href="#">비밀번호를 잊으셨습니까?</a>
				<button type="submit">Sign In</button>
			</form>
		</div>
		<div class="welcome-section">
			<h2>Hello, Friends!</h2>
			<p>Enter your personal details and start your journey with us</p>
			<button
				onclick="location.href='${pageContext.request.contextPath}/join'">Sign
				Up</button>
		</div>
	</div>
</body>
</html>
