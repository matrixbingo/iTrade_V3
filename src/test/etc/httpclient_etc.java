package test.etc;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map.Entry;

import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;
//import css.common.etc;

public class httpclient_etc {
/*
	*//**
	 * 功能:用http提交一个post请求
	 * @param 链接 argUrl
	 * @param 参数表  HashMap<String,String> argParas
	 * 
	 * 
	 * *//*
	public boolean post(String argUrl, HashMap<String,String> argParas){

		boolean rtn = false;
		int code = 0;
		String strResult = "";
		try {

			//创建请求的链接
			HttpPost httpRequest = new HttpPost(argUrl); 
			
			//添加参数
			List <NameValuePair> params = new ArrayList <NameValuePair>();
	        
			for(Entry<String, String> entry : argParas.entrySet()){
				
				String key = entry.getKey();
				String val = entry.getValue();
				params.add(new BasicNameValuePair(key, val));

			}

	        httpRequest.setEntity(new UrlEncodedFormEntity(params, HTTP.UTF_8));
	        
	        //发送请求
	        HttpResponse httpResponse = new DefaultHttpClient().execute(httpRequest);

	        //查看结果
	        code = httpResponse.getStatusLine().getStatusCode();
	        
	        strResult = EntityUtils.toString(httpResponse.getEntity());
	        
	        if(code == 200){
	        	
	        	etc.debug("response::" + strResult);
	        	rtn = true;
	        }

		} catch (Exception e) {
			e.printStackTrace();
		}
		
		if(!rtn){
			etc.debug("get code::" + code);
			etc.debug("get rtn::" + strResult);
		}
		return rtn;

	}

	*//**
	 * 功能:用http提交一个post请求
	 * @param 链接 argUrl
	 * @param 参数表  HashMap<String,String> argParas
	 * 
	 * 
	 * *//*
	public String getResponse(String argUrl, HashMap<String,String> argParas){

		String rtn = "";
		
		try {

			//创建请求的链接
			HttpPost httpRequest = new HttpPost(argUrl); 
			
			//添加参数
			List <NameValuePair> params = new ArrayList <NameValuePair>();
	        
			for(Entry<String, String> entry : argParas.entrySet()){
				
				String key = entry.getKey();
				String val = entry.getValue();
				params.add(new BasicNameValuePair(key, val));

			}

	        httpRequest.setEntity(new UrlEncodedFormEntity(params, HTTP.UTF_8));
	        
	        //发送请求
	        HttpResponse httpResponse = new DefaultHttpClient().execute(httpRequest);

	        //查看结果
	        if(httpResponse.getStatusLine().getStatusCode() == 200){
	        	String strResult = EntityUtils.toString(httpResponse.getEntity());
	        	if (!etc.isEmpty(strResult)){
		        	rtn = strResult;
	        	}

	        }

		} catch (Exception e) {
			e.printStackTrace();
		}
		return rtn;

	}
	*/
}
