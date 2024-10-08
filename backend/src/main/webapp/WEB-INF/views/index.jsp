<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>사이드바 컴포넌트 - 아코디언</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com"/>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
    <link
            href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap"
            rel="stylesheet"
    />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"/>
    <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
          integrity='sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=='
          crossorigin='anonymous'/>

    <link rel="stylesheet" href="/resources/css/store/store_list.css">
    <!-- Iconscout Link For Icons -->
    <link
            rel="stylesheet"
            href="https://unicons.iconscout.com/release/v4.0.0/css/line.css"
    />
    <script src='https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/gsap.min.js'></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

</head>
<body>

<h2>화면설계도 </h2>
<a href="https://docs.google.com/spreadsheets/d/1jUrxwTbg0_H_gdSAI89xL245TaHFSbjgrUxWUyTyKWA/edit?gid=1473716366#gid=1473716366">링크보기</a>
<br>
<br>
<h2>홈페이지</h2>

<h3>마스터관리</h3>
<a href="/master/store_manage/store_list">가맹점 관리</a>
<a href="/checklist/list">체크리스트 관리</a>

<h3>QSC</h3>
<a href="/qsc/inspection_schedule/schedule_list">가맹점 점검 계획 관리</a>
<a href="/qsc/store_inspection">가맹점 점검</a>
<a href="/qsc/store_inspection_schedule">가맹점 점검 일정 조회</a>

</body>
</html>
