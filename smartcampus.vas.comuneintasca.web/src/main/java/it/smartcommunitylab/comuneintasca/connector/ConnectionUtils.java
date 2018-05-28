/*******************************************************************************
 * Copyright 2015 Fondazione Bruno Kessler
 * 
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 * 
 *        http://www.apache.org/licenses/LICENSE-2.0
 * 
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 ******************************************************************************/
package it.smartcommunitylab.comuneintasca.connector;

import java.io.IOException;
import java.net.URI;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.stream.Collectors;

import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.web.client.RestTemplate;

/**
 * @author raman
 *
 */
public class ConnectionUtils {

	private static RestTemplate restTemplate = new RestTemplate();
	private static ObjectMapper mapper = new ObjectMapper();
	
	public static <T> T call(String url, Class<T> cls) throws IOException {
		URL urlObj = new URL(url);
		if ("file".equalsIgnoreCase(urlObj.getProtocol())) {
			String string = Files.readAllLines(Paths.get(URI.create(url))).stream().collect(Collectors.joining("\n"));
			return mapper.convertValue(string, cls);
		} else {
			return restTemplate.getForObject(url, cls);
		}
	} 
}
