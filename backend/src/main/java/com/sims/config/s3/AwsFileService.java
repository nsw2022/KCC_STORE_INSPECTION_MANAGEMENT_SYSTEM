package com.sims.config.s3;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.*;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.util.IOUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AwsFileService {

	private final AmazonS3Client amazonS3Client;

	@Value("${cloud.aws.s3.bucket}")
	private String bucket;

	private String INSPECTION_IMG_DIR = "inspection_img/";

	private String BRD_DIR = "brd/";
	private String SIGN_IMG_DIR = "sign_img/";

	/**
	 * 이미지를 S3에 저장하는 메서드
	 * @param multipartFile 업로드할 파일
	 * @return 업로드된 파일의 S3 URL
	 * @throws IOException 파일 변환 실패 시 예외 발생
	 */
	public String savePhoto(MultipartFile multipartFile) throws IOException {
		File uploadFile = convertAndResize(multipartFile)
				.orElseThrow(() -> new IllegalArgumentException("error: MultipartFile -> File convert fail"));
		String filePath = upload(uploadFile, INSPECTION_IMG_DIR);
		return filePath.substring(filePath.lastIndexOf('/') + 1);
	}

	public String saveBrdFile(MultipartFile multipartFile) throws IOException {
		File uploadFile = convertAndResize(multipartFile)
				.orElseThrow(() -> new IllegalArgumentException("error: MultipartFile -> File convert fail"));
		String filePath = upload(uploadFile, BRD_DIR);
		return filePath.substring(filePath.lastIndexOf('/') + 1);
	}


	/**
	 * 서명 이미지를 S3에 저장하는 메서드 (sign_img 디렉토리)
	 * @param multipartFile 업로드할 파일
	 * @return 업로드된 파일의 S3 키
	 * @throws IOException 파일 변환 실패 시 예외 발생
	 */
	public String saveSignImage(MultipartFile multipartFile) throws IOException {
		File uploadFile = convertAndResize(multipartFile)
				.orElseThrow(() -> new IllegalArgumentException("error: MultipartFile -> File convert fail"));
		String filePath = upload(uploadFile, SIGN_IMG_DIR);
		return filePath.substring(filePath.lastIndexOf('/') + 1);
	}


	/**
	 * S3에 파일을 업로드하는 메서드
	 * @param uploadFile 업로드할 파일
	 * @param dirName 저장 디렉터리 경로
	 * @return 업로드된 파일의 S3 URL
	 */
	private String upload(File uploadFile, String dirName) {
		String fileName = dirName + UUID.randomUUID().toString();
		String uploadImageUrl = putS3(uploadFile, fileName);
		removeNewFile(uploadFile);
		return uploadImageUrl;
	}

	/**
	 * S3에 파일을 업로드하고 Public Read 권한을 설정하는 메서드
	 * @param uploadFile 업로드할 파일
	 * @param fileName S3에 저장할 파일 이름
	 * @return 업로드된 파일의 S3 URL
	 */
	private String putS3(File uploadFile, String fileName) {
		amazonS3Client.putObject(new PutObjectRequest(bucket, fileName, uploadFile));
		return amazonS3Client.getUrl(bucket, fileName).toString();
	}

	/**
	 * 로컬에 임시로 저장된 파일을 삭제하는 메서드
	 * @param targetFile 삭제할 파일
	 */
	private void removeNewFile(File targetFile) {
		if (targetFile.delete()) {
			log.info("File delete success");
			return;
		}
		log.info("File delete fail");
	}

	/**
	 * 이미지를 리사이징하여 File 객체로 변환하는 메서드
	 * @param file 변환할 MultipartFile(사진)
	 * @return 리사이징된 File 객체 (Optional)
	 * @throws IOException 변환 실패 시 예외 발생
	 */
	private Optional<File> convertAndResize(MultipartFile file) throws IOException {
		File convertFile = new File(System.getProperty("user.home") + "/" + file.getOriginalFilename());

		try (FileOutputStream fos = new FileOutputStream(convertFile)) {
			Thumbnails.of(file.getInputStream())
					.size(800, 800)          // 사진 크기 지정
					.outputQuality(0.7)      // 품질 지정
					.toOutputStream(fos);    // FileOutputStream으로 저장
			return Optional.of(convertFile);
		} catch (IOException e) {
			log.error("File conversion failed", e);
			return Optional.empty();
		}
	}

	public void createDir(String bucketName, String folderName) {
		amazonS3Client.putObject(bucketName, folderName + "/", new ByteArrayInputStream(new byte[0]), new ObjectMetadata());
	}

	/**
	 * S3에서 파일 다운로드 메서드
	 * @param path S3에 저장된 파일 이름
	 * @return 파일의 바이트 배열
	 */
	public InputStream downloadFileAsInputStream(String path) {
		S3Object s3Object = amazonS3Client.getObject(new GetObjectRequest(bucket, path));
		return s3Object.getObjectContent();
	}

	/**
	 * S3에서 파일을 삭제하는 메서드
	 * @param path 삭제할 파일의 S3 URL
	 */
	public void deleteFile(String path) {
		amazonS3Client.deleteObject(new DeleteObjectRequest(bucket, path));
	}
}
