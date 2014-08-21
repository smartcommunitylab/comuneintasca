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

import java.math.BigInteger;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.codehaus.jackson.map.ObjectMapper;

import com.google.protobuf.Message;

import eu.trentorise.smartcampus.service.opendata.data.message.Opendata.I18nRestaurant;
import eu.trentorise.smartcampus.service.opendata.data.message.Opendata.I18nString;

public class RestaurantsScript extends OpenContentScript {

	public Message extractData(String itJson, String enJson, String deJson) throws Exception {
		Map<String, Map<String, Object>> i18n = buildMap(langs, itJson, enJson, deJson);
		I18nRestaurant.Builder builder = I18nRestaurant.newBuilder();

		builder.setId(((String)getRecValue(getMap(i18n,DEFAULT_LANGUAGE), "metadata", "objectRemoteId")));

		builder.setLastModified(((BigInteger)getRecValue(getMap(i18n,DEFAULT_LANGUAGE), "metadata", "dateModified")).longValue() * 1000);
		
		Object url = getRecValue(getMap(i18n,DEFAULT_LANGUAGE), FIELDS, "url", STRING_VALUE);
		if (url != null && url instanceof String) {
			builder.setUrl((String)url);
		}	

		builder.setTitle(getI18NStringValue(i18n, FIELDS, "titolo", VALUE));

		// RestaurantObject -> classification, info
		
//		I18nString cat = getI18NStringValue(i18n, FIELDS, "tipo_locale", STRING_VALUE);
		I18nString cat = getI18NStringValue(i18n, FIELDS, "tipo_locale", VALUE, OBJECT_NAME);
		if (cat.hasIt()) {
			builder.setClassification(cat);
		}

		builder.setSubtitle(getI18NStringValue(i18n, FIELDS, "abstract", VALUE));

		builder.setAddress(getI18NStringValue(i18n, FIELDS, "indirizzo", VALUE));
		
		Object gps = getRecValue(getMap(i18n,DEFAULT_LANGUAGE), FIELDS, "gps", STRING_VALUE);
		if (gps != null && gps instanceof String) {
			double latlon[] = extractGPS((String)gps);
			builder.setLat(latlon[0]);
			builder.setLon(latlon[1]);
		}
		

		Object image = getRecValue(getMap(i18n,DEFAULT_LANGUAGE), FIELDS, "image", STRING_VALUE);
		if (image != null && image instanceof String) {
			builder.setImage((String)image);
		}
		
		Object phone1 = getRecValue(getMap(i18n,DEFAULT_LANGUAGE), FIELDS, "telefono", STRING_VALUE);
		if (phone1 != null && phone1 instanceof String) {
			builder.setPhone((String)phone1);
		}
		Object fax = getRecValue(getMap(i18n,DEFAULT_LANGUAGE), FIELDS, "fax", STRING_VALUE);
		if (fax != null && fax instanceof String) {
			builder.setFax((String)fax);
		}		
		Object email = getRecValue(getMap(i18n,DEFAULT_LANGUAGE), FIELDS, "email", STRING_VALUE);
		if (email != null && email instanceof String) {
			builder.setEmail((String)email);
		}		
		
		builder.setTimetable(getI18NStringValue(i18n, FIELDS, "orario", VALUE));
		
		I18nString name = getI18NStringValue(i18n, FIELDS, "riposo", "name");
		I18nString value = getI18NStringValue(i18n, FIELDS, "riposo", "value");
		I18nString closing = concatI18nString(": ", name, value);		
		builder.setClosing(closing);
		
		name = getI18NStringValue(i18n, FIELDS, "prezzo_medio_in_euro", "name");
		value = getI18NStringValue(i18n, FIELDS, "prezzo_medio_in_euro", "value");
		I18nString price1 = concatI18nString(": ", name, value);
		
		name = getI18NStringValue(i18n, FIELDS, "prezzo_medio_in_euro_bambini", "name");
		value = getI18NStringValue(i18n, FIELDS, "prezzo_medio_in_euro_bambini", "value");
		I18nString price2 = concatI18nString(": ", name, value);			
		
		I18nString prices = concatI18nString("\n", price1, price2);

		builder.setPrices(prices);
		
		I18nString equip = getI18NStringValue(i18n, FIELDS, "servizi_offerti", VALUE, OBJECT_NAME);
		builder.setEquipment(equip);
		
		return builder.build();
	}
	
}