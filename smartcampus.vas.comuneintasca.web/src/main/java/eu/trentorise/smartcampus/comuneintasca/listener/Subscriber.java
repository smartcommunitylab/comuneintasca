/*******************************************************************************
 * Copyright 2012-2013 Trento RISE
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
package eu.trentorise.smartcampus.comuneintasca.listener;

import it.sayservice.platform.client.InvocationException;
import it.sayservice.platform.client.ServiceBusClient;

import java.util.Map;
import java.util.TreeMap;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class Subscriber {

	public static final String SERVICE_YMIR = "smartcampus.service.festivaleconomia";
	public static final String SERVICE_OD = "smartcampus.service.opendata";
	public static final String METHOD_EVENTS = "GetEventi";
	
	private Log logger = LogFactory.getLog(getClass());

	public Subscriber(ServiceBusClient client) {
		try {
			System.out.println("SUBSCRIBE");
			Map<String, Object> params = new TreeMap<String, Object>();
			client.subscribeService(SERVICE_OD, METHOD_EVENTS, params);
			client.subscribeService(SERVICE_YMIR, METHOD_EVENTS, params);
		} catch (InvocationException e) {
			logger.error("Failed to subscribe for service events: " + e.getMessage());
		}
	}
}
