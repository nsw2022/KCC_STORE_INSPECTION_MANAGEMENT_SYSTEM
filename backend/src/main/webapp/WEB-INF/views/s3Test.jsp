<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>File Upload</title>
</head>
<body>
<h2>이미지 파일 업로드</h2>
<input type="file" id="fileInput" accept="image/*" />
<br><br>
<button onclick="uploadFile()">파일 업로드</button>
<br><br>
<button onclick="showImage()">이미지 보기</button>
<br><br>
<img id="uploadedImage" src="" alt="Uploaded Image" style="display: none; width: 300px;"/>

<script>
    function uploadFile() {
        // 파일 및 멤버 ID 가져오기
        const fileInput = document.getElementById("fileInput");
        const selectedFile = fileInput.files[0];

        // FormData 생성 후 이미지 파일과 멤버 ID 추가
        const formData = new FormData();
        formData.append("file", selectedFile);

        // 서버에 파일 전송
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                console.log("Upload successful:", data);
                alert("업로드 성공: " + data); // 업로드 성공 시 알림
            })
            .catch(error => {
                console.error("Error uploading file:", error);
                alert("업로드 실패");
            });
    }

    const path = 'inspection_img/' + `15e00eff-fd68-498b-84ee-0e0b5f310ef2`;
    console.log(path);

    function showImage() {
        fetch('/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ path: path })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.blob(); // 바이너리 데이터를 Blob으로 변환
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const img = document.getElementById('uploadedImage');
                img.src = url; // Blob URL을 img 태그의 src로 설정
                img.style.display = 'block'; // 이미지 태그 보이기
            })
    }
</script>
</body>
</html>
