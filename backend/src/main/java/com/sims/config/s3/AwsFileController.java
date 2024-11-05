package com.sims.config.s3;

import com.amazonaws.services.s3.model.AmazonS3Exception;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequiredArgsConstructor
@Slf4j
public class AwsFileController {

    private final AwsFileService awsFileService;

    @GetMapping("/s3-test")
    public String s3Test() {
        return "s3Test";
    }


    @PostMapping("/upload")
    @ResponseBody
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        log.info("파일 업로드 시작");
        log.info("파일 이름 : " + file.getOriginalFilename());
        try {
            String s3Key = awsFileService.savePhoto(file); // S3 키 반환
            log.info("파일 업로드 성공 : " + s3Key);
            Map<String, String> response = new HashMap<>();
            response.put("path", s3Key); // S3 키 반환
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("파일 업로드 실패", e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "파일 업로드에 실패했습니다.");
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @PostMapping("/upload/brdPath")
    @ResponseBody
    public ResponseEntity<Map<String, String>> uploadBrdFile(@RequestParam("file") MultipartFile file) {

        log.info("파일 업로드 시작");
        log.info("파일 이름 : " + file.getOriginalFilename());
        try {
            String s3Key = awsFileService.saveBrdFile(file); // S3 키 반환
            log.info("파일 업로드 성공 : " + s3Key);
            Map<String, String> response = new HashMap<>();
            response.put("path", s3Key); // S3 키 반환
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("파일 업로드 실패", e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "파일 업로드에 실패했습니다.");
            return ResponseEntity.status(500).body(errorResponse);
        }
    }


    /**
     * 새로운 서명 이미지 업로드 엔드포인트 (sign_img 디렉토리)
     */
    @PostMapping("/sign_img")
    @ResponseBody
    public ResponseEntity<Map<String, String>> uploadSignImg(@RequestParam("file") MultipartFile file) {
        log.info("서명 이미지 업로드 시작");
        log.info("파일 이름 : " + file.getOriginalFilename());
        try {
            String s3Key = awsFileService.saveSignImage(file); // sign_img 디렉토리에 저장
            log.info("서명 이미지 업로드 성공 : " + s3Key);
            Map<String, String> response = new HashMap<>();
            response.put("path", s3Key); // S3 키 반환
            return ResponseEntity.ok(response); // S3 키 반환 (단순 문자열)
        } catch (Exception e) {
            log.error("서명 이미지 업로드 실패", e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "파일 업로드에 실패했습니다.");
            return ResponseEntity.status(500).body(errorResponse);
        }
    }



    @PostMapping("/download")
    @ResponseBody
    public ResponseEntity<InputStreamResource> downloadFile(@RequestBody Map<String, String> request) {
        String path = request.get("path");
        log.info("파일 다운로드 요청 경로: {}", path); // 디버깅 로그
        try {
            // S3에서 파일 다운로드
            InputStream inputStream = awsFileService.downloadFileAsInputStream(path);

            // Content-Type 설정
            String contentType = "application/octet-stream"; // 파일 확장자가 없으므로 기본값 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(contentType));

            // 파일 이름 설정
            String fileName = path.substring(path.lastIndexOf('/') + 1);
            headers.setContentDispositionFormData("attachment", fileName);

            log.info("파일 다운로드 성공: {}", path); // 디버깅 로그
            return new ResponseEntity<>(new InputStreamResource(inputStream), headers, HttpStatus.OK);
        } catch (AmazonS3Exception e) {
            log.error("파일 다운로드 실패: S3에서 파일을 찾을 수 없습니다. 경로: {}", path, e);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 404
        } catch (Exception e) {
            log.error("파일 다운로드 실패: {}", path, e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/delete")
    @ResponseBody
    public ResponseEntity<Map<String, String>> deleteFile(@RequestBody Map<String, String> request) {

        String path = request.get("path");
        log.info("파일 삭제 시작: " + path);
        if (path == null || path.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "경로는 null이나 비어 있을 수 없습니다."));
        }

        try {
            awsFileService.deleteFile(path);
            Map<String, String> response = new HashMap<>();
            response.put("success", "파일이 성공적으로 삭제되었습니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("파일 삭제 실패", e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "파일 삭제에 실패했습니다.");
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

}

