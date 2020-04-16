package com.lombax;

import com.lombax.service.avatar.AvatarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class LombaxApplication implements CommandLineRunner {

	@Autowired
	AvatarService avatarService;

	public static void main(String[] args) {
		SpringApplication.run(LombaxApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		//avatarService.uploadExample("D:\\Repositorios\\JavaProjects\\lombax\\src\\main\\java\\com\\lombax\\ex.jpg", "ex");
		//avatarService.retrieveExample();
	}

	private void saveSomeGames() {


	}
}
