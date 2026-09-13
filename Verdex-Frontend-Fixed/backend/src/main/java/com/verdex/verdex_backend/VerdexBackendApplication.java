package com.verdex.verdex_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class VerdexBackendApplication {
	public static void main(String[] args) {
		// TEMPORARY DEBUG - remove after diagnosing Render env var issue
		String pw = System.getenv("DB_PASSWORD");
		if (pw == null) {
			System.out.println("DEBUG: DB_PASSWORD env var is NULL (not set at all)");
		} else {
			System.out.println("DEBUG: DB_PASSWORD length=" + pw.length()
					+ " first=" + pw.charAt(0)
					+ " last=" + pw.charAt(pw.length() - 1));
		}
		String url = System.getenv("DB_URL");
		System.out.println("DEBUG: DB_URL=" + url);
		String user = System.getenv("DB_USERNAME");
		System.out.println("DEBUG: DB_USERNAME=[" + user + "]");
		// END TEMPORARY DEBUG

		SpringApplication.run(VerdexBackendApplication.class, args);
	}
}