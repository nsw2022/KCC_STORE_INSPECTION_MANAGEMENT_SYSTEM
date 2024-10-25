<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>가맹점 점검 팝업</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
            href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap"
            rel="stylesheet"
    />
    <link
            href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css"
            rel="stylesheet"
    />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
    <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css' integrity='sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==' crossorigin='anonymous'/>

    <link rel="stylesheet" href="/resources/css/qsc/store_inspection/store_inspection_popup.css">
    <script src='https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/gsap.min.js'></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script type="text/javascript">
        document.addEventListener('DOMContentLoaded', function() {
            // 'inspection' 모델 속성이 없는 경우 (권한 없음)
            var authorized = <c:out value="${inspection != null}" />;
            if (!authorized) {
                Swal.fire({
                    title: "권한이 없습니다.",
                    text: "문제가 발생했습니다. 다시 시도해주세요.",
                    icon: "error",
                    confirmButtonText: "확인",
                }).then(() => {
                    window.close(); // 사용자가 확인을 누르면 창을 닫습니다.
                });
            }
        });
    </script>
</head>
<body>
<c:if test="${inspection != null}">
<section class="inspection-detail">
    <div class="inspection-header">
        <h2>점검 가맹점 상세조회</h2>
    </div>
    <div class="inspection-info">
        <table class="inspection-table" id="inspection-detail-table">
            <!-- JavaScript를 통해 테이블 헤더와 바디를 생성 -->
        </table>
    </div>
</section>

<section class="inspection-results-section">
    <table class="inspection-results-table">
        <thead>
        <tr>
            <th>유형</th>
            <th>점검일자</th>
            <th>점검자</th>
            <th>점수</th>
            <th>이력</th>
        </tr>
        </thead>
        <tbody id="inspection-results-body">
        <!-- JavaScript를 통해 동적으로 행을 추가합니다 -->
        </tbody>
    </table>
</section>
<div id="go-inspection-wrap">
    <button id="go-inspection" onclick="startInspection(this)">점검시작</button>
</div>
</c:if>
<script src="/resources/js/qsc/store_inspection/store_inspection_popup.js"></script>
</body>
</html>
