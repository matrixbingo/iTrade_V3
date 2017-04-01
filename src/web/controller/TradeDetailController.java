package web.controller;

import data.jsoup.dto.BigTradeCondtionDto;
import data.jsoup.dto.BigTradeDto;
import ea.service.res.db.dao.DBComm;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import test.ArrayList;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping(value = "/trade")
public class TradeDetailController extends BaseController {


    @RequestMapping(value = "/stock/buysel", produces = "application/json;charset=utf-8", method = {RequestMethod.GET, RequestMethod.POST})
    @ResponseBody
    public String stock(@RequestParam(value = "type", defaultValue = "0") int type,
                         @RequestParam(value = "code", defaultValue = "") String code,
                        @RequestParam(value = "time", defaultValue = "0") int time
                         ) {
        Map<String, Object> rs = new HashMap<String, Object>();
        Map<String, Object> map = new HashMap<String, Object>();
        BigTradeCondtionDto dto = new BigTradeCondtionDto();
        dto.setType(type);
        dto.setCode(code);
        dto.setTime(time);
        List<BigTradeDto> list = this.search(dto);
        map.put("list", list);
        rs.put("code", 200);
        rs.put("msg", map);
        String jsonStr = this.obj2Json(rs);
        return jsonStr;
    }

    private List<BigTradeDto> search(BigTradeCondtionDto cdition) {
        List<BigTradeDto> list = new ArrayList<BigTradeDto>();
        String sql = getSearchSql(cdition);
        System.out.println(sql);
        ResultSet rs = DBComm.executeQuery(sql);
        try {
            while (rs.next()) {
                BigTradeDto dto = new BigTradeDto();
                dto.setTime(rs.getInt("time"));
                dto.setCode(rs.getString("code"));
                dto.setName(rs.getString("name"));
                dto.setBuy(rs.getInt("buy"));
                dto.setSel(rs.getInt("sel"));
                list.add(dto);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    private String getSearchSql(BigTradeCondtionDto cdition){
        StringBuffer sql = new StringBuffer("select time,code,name,buy,sel from s_big_trade");
        sql.append(" where code = " + cdition.getCode() + " and type = " + cdition.getType());
        sql.append(" and type <= " + cdition.getTime());
        sql.append(" order by time desc limit 30");
        return sql.toString();
    }
}
