package web.controller;

import ea.service.res.dto.KlinesDto;
import ea.service.utils.comm.Util;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import web.utils.Md5Util;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping(value = "/app")
public class AppController extends BaseController {

	
	@RequestMapping(value = "/login", method = { RequestMethod.GET, RequestMethod.POST })
	@ResponseBody
	public String getInitData(String name, String pass, HttpServletRequest request) {
		String callback = request.getParameter("callback");
		Map<String, Object> map = new HashMap<String, Object>();

		String passWordMD5 = Md5Util.getMD5Str("1");
		if(passWordMD5.equals(pass)){
			System.out.println("用户：" + name + " : 成功登录 " + Util.getCurrTime());
			map.put("status", 1);
			map.put("id", 12345);
			map.put("msg", "");
		}else{
			System.out.println("用户：" + name + " : 登录失败：密码错误  : " + pass + " " + Util.getCurrTime());
			map.put("status", 0);
			int i = new java.util.Random().nextInt(9);
			if(i > 4){
				map.put("msg", "username not exist");
			}else{
				map.put("msg", "password incorrect");
			}
		}
		String jsonStr = this.obj2Json(map);
		return result(callback, jsonStr);
	}


	@RequestMapping(value = "/test", method =  RequestMethod.POST, consumes = "application/json")
	@ResponseBody
	public String getInitData(@RequestBody KlinesDto dto) {
		//KlinesDto dto = new KlinesDto();
		String jsonStr = this.obj2Json(dto);

		return jsonStr;
	}

}
