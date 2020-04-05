package com.lombax;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lombax.data.game.GameModel;
import kong.unirest.HttpResponse;
import kong.unirest.JsonNode;
import kong.unirest.Unirest;
import okhttp3.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import javax.print.attribute.standard.Media;
import java.io.IOException;
import java.io.Reader;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.Objects;

@SpringBootApplication
public class LombaxApplication implements CommandLineRunner {

	// one instance, reuse
	private final OkHttpClient httpClient = new OkHttpClient();

	public static void main(String[] args) {
		SpringApplication.run(LombaxApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {

	}

	private void saveSomeGames() {

		HttpResponse<GameModel[]> jsonResponse = Unirest.post("https://api-v3.igdb.com/games")
				.header("user-key", "21d29cc297bbf1bf047a0a840b69fdfc")
				.header("Accept", "application/json")
				.body("fields name;")
				.asObject(GameModel[].class);

		System.out.println(jsonResponse.getBody());


	}
}
