/*******************************************************************************
 * Copyright 2012-2014 Trento RISE
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
package eu.trentorise.smartcampus.service.opendata.scripts;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.codehaus.jackson.map.ObjectMapper;

import com.google.protobuf.Message;

import eu.trentorise.smartcampus.service.opendata.data.message.Opendata.Evento;
import eu.trentorise.smartcampus.service.opendata.data.message.Opendata.Organization;

public class OpenDataScript {

	@SuppressWarnings({ "unchecked", "rawtypes" })
	public List<String> extractLinks(String json) throws Exception {
		List<String> links = new ArrayList<String>();
		ObjectMapper mapper = new ObjectMapper();
		Map<String,Object> map = mapper.readValue(json, Map.class);
		List<Map> list = (List<Map>) map.get("nodes");
		if (list != null) {
			for (Map m : list) {
				links.add(m.get("link").toString());
			}
		}
		return links;
	}
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public Message extractData(String json) throws Exception {
		ObjectMapper mapper = new ObjectMapper();
		Evento.Builder builder = Evento.newBuilder();
		Map<String,Object> map = mapper.readValue(json, Map.class);
		Map<String,Object> e = (Map<String,Object>)map.get("metadata");
		builder.setId(e.get("objectRemoteId").toString());
		builder.setLastModified((Integer)e.get("dateModified")*1000);
		builder.setUrl(e.get("fullUrl").toString());

		map = (Map<String, Object>) map.get("fields");
		
		e = (Map<String, Object>) map.get("special");
		builder.setSpecial(!"0".equals(e.get("value")));
		
		e = (Map<String, Object>) map.get("titolo");
		builder.setTitle(e.get("value").toString());
		e = (Map<String, Object>) map.get("short_title");
		builder.setShortTitle(e.get("value").toString());
		e = (Map<String, Object>) map.get("abstract");
		builder.setSubtitle(e.get("value").toString());
		e = (Map<String, Object>) map.get("text");
		builder.setDescription(e.get("value").toString());
		e = (Map<String, Object>) map.get("from_time");
		builder.setFromTime(Long.parseLong(e.get("value").toString())*1000);
		e = (Map<String, Object>) map.get("to_time");
		builder.setToTime(Long.parseLong(e.get("value").toString())*1000);
		e = (Map<String, Object>) map.get("periodo_svolgimento");
		builder.setEventPeriod(e.get("value").toString());
		e = (Map<String, Object>) map.get("orario_svolgimento");
		builder.setEventTiming(e.get("value").toString());
		e = (Map<String, Object>) map.get("durata");
		builder.setDuration(e.get("value").toString());
		e = (Map<String, Object>) map.get("luogo_svolgimento");
		builder.setAddress(e.get("value").toString());
		e = (Map<String, Object>) map.get("informazioni");
		builder.setInfo(e.get("value").toString());
		e = (Map<String, Object>) map.get("costi");
		builder.setCost(e.get("value").toString());
		e = (Map<String, Object>) map.get("image");
		builder.setImage(e.get("value").toString().trim());
		e = (Map<String, Object>) map.get("tipo_eventi_manifestazioni");
		if (!(e.get("value") instanceof Boolean) || (Boolean)e.get("value")) {
			builder.setEventType(((Map)e.get("value")).get("objectName").toString());
		}
		e = (Map<String, Object>) map.get("iniziativa");
		if (!(e.get("value") instanceof Boolean) || (Boolean)e.get("value")) {
			builder.setParentEventId(e.get("value").toString().trim());
		}
		e = (Map<String, Object>) map.get("tipo_evento");
		builder.setCategory(e.get("value").toString().trim());
		e = (Map<String, Object>) map.get("materia");
		List<Map> list = null;
		if (e.get("value") instanceof Map) {
			list = Collections.singletonList((Map)e.get("value"));
		} else if (e.get("value") instanceof List){
			list = (List<Map>) e.get("value");
		}
		if (list != null) {
			List<String> topics = new ArrayList<String>();
			for (Map m : list) {
				topics.add(m.get("objectName").toString());
			}
			builder.addAllTopics(topics);
		}
		List<Organization> orgs = new ArrayList<Organization>();
		e = (Map<String, Object>) map.get("circoscrizione");
		if (!(e.get("value") instanceof Boolean) || (Boolean)e.get("value")) {
			orgs.add(Organization.newBuilder().setType("circoscrizione").setTitle(e.get("value").toString()).build());
		}
		e = (Map<String, Object>) map.get("servizio_sul_territorio");
		if (!(e.get("value") instanceof Boolean) || (Boolean)e.get("value")) {
			orgs.add(Organization.newBuilder().setType("servizio_sul_territorio").setTitle(e.get("value").toString()).build());
		}
		e = (Map<String, Object>) map.get("associazione");
		if (!(e.get("value") instanceof Boolean) || (Boolean)e.get("value")) {
			orgs.add(Organization.newBuilder().setType("associazione").setTitle(e.get("value").toString()).build());
		}
		e = (Map<String, Object>) map.get("ente");
		if (!(e.get("value") instanceof Boolean) || (Boolean)e.get("value")) {
			orgs.add(Organization.newBuilder().setType("ente").setTitle(e.get("value").toString()).build());
		}
		builder.addAllOrganizations(orgs);
		
		
		return builder.build();
	}


}