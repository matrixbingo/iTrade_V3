package web.controller;

import data.jsoup.dto.BigTradeCondtionDto;
import data.jsoup.dto.BigTradeDto;
import ea.service.res.db.dao.DBComm;
import org.apache.commons.lang.StringUtils;
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
public class TradeListController extends BaseController {


    @RequestMapping(value = "/search", produces = "application/json;charset=utf-8", method = {RequestMethod.GET, RequestMethod.POST})
    @ResponseBody
    public String search(@RequestParam(value = "page", defaultValue = "1") int page,
                         @RequestParam(value = "pageSize", defaultValue = "10") int pageSize,
                         @RequestParam(value = "type", defaultValue = "0") int type,
                         @RequestParam(value = "code", defaultValue = "") String code,
                         @RequestParam(value = "name", defaultValue = "") String name,
                         @RequestParam(value = "bin", defaultValue = "0") int bin,
                         @RequestParam(value = "end", defaultValue = "0") int end,
                         @RequestParam(value = "nums", defaultValue = "0") int nums,
                         @RequestParam(value = "rabin", defaultValue = "0") int rabin,
                         @RequestParam(value = "raend", defaultValue = "0") int raend,
                         @RequestParam(value = "sort", defaultValue = "") String sort,
                         @RequestParam(value = "sortType", defaultValue = "true") boolean sortType
                         ) {
        Map<String, Object> rs = new HashMap<String, Object>();
        Map<String, Object> map = new HashMap<String, Object>();
        BigTradeCondtionDto dto = new BigTradeCondtionDto();
        dto.setType(type);
        dto.setCode(code);
        dto.setName(name);
        dto.setPage(page);
        dto.setBin(bin);
        dto.setEnd(end);
        dto.setNums(nums);
        dto.setRabin(rabin);
        dto.setRaend(raend);
        dto.setRabin(rabin);
        dto.setSort(sort);
        dto.setSortType(sortType);
        dto.setPageSize(pageSize);
        List<BigTradeDto> list = this.search(dto);
        long totalCount = this.getTotalCount(dto);
        map.put("list", list);
        map.put("totalCount", totalCount);
        map.put("page", page);
        map.put("pageSize", pageSize);
        rs.put("code", 200);
        rs.put("msg", map);
        String jsonStr = this.obj2Json(rs);
        return jsonStr;
    }

    private List<BigTradeDto> search(BigTradeCondtionDto cdition) {
        List<BigTradeDto> list = new ArrayList<BigTradeDto>();
        int bin = (cdition.getPage() - 1) * cdition.getPageSize();
        int end = cdition.getPageSize();
        String sql = getSearchSql(cdition);
        System.out.println(sql);
        ResultSet rs = DBComm.executeQuery(sql);
        try {
            while (rs.next()) {
                BigTradeDto dto = new BigTradeDto();
                dto.setId(rs.getInt("id"));
                dto.setType(rs.getInt("type"));
                dto.setTime(rs.getInt("time"));
                dto.setCode(rs.getString("code"));
                dto.setName(rs.getString("name"));
                dto.setPrice(rs.getDouble("price"));
                dto.setRange(rs.getDouble("range"));
                dto.setSpeed(rs.getDouble("speed"));
                dto.setStock(rs.getDouble("stock"));
                dto.setBuy(rs.getInt("buy"));
                dto.setSel(rs.getInt("sel"));
                list.add(dto);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    private long getTotalCount(BigTradeCondtionDto cdition) {
        String sql = "SELECT count(1) totalCount FROM s_big_trade a " + getJoinSql(cdition) + " WHERE 1=1 " + getCondition(cdition);
        //System.out.println(sql);
        return DBComm.getNum(sql, "totalCount");
    }

    private String getSearchSql(BigTradeCondtionDto cdition){
        int bin = (cdition.getPage() - 1) * cdition.getPageSize();
        int end = cdition.getPageSize();
        String sql = "SELECT a.* FROM s_big_trade a " + getJoinSql(cdition) +" WHERE 1=1 " + getCondition(cdition) + " ORDER BY " + getOrderBy(cdition) + "a.time DESC limit " + bin + "," + end;
        return sql;
    }

    private String getJoinSql(BigTradeCondtionDto cdition){
        if(cdition.getNums() == 0){
            return "";
        }
        String sql = "inner join (SELECT code FROM s_big_trade a WHERE 1=1 " + getCondition(cdition) + " group by code having count(1) > " + cdition.getNums() + ") b on a.code = b.code";
        return sql;
    }

    private String getCondition(BigTradeCondtionDto cdition) {
        StringBuffer condition = new StringBuffer();
        if (!StringUtils.isBlank(cdition.getCode())) {
            condition.append("and a.code = '" + cdition.getCode() + "'");
        }
        if (!StringUtils.isBlank(cdition.getName())) {
            condition.append(" and a.name = '" + cdition.getName() + "'");
        }
        if(cdition.getType() != 0){
            condition.append(" and a.type = '" + cdition.getType() + "'");
        }
        if (cdition.getBin() != 0) {
            condition.append(" and a.time >= " + cdition.getBin());
        }
        if (cdition.getEnd() != 0) {
            condition.append(" and a.time <= " + cdition.getEnd());
        }

        condition.append(" and a.range >= " + cdition.getRabin());

        if (cdition.getRaend() != 0) {
            condition.append(" and a.range <= " + cdition.getRaend());
        }
        return condition.toString();
    }

    private String getOrderBy(BigTradeCondtionDto cdition){
        StringBuffer condition = new StringBuffer();

        if (!StringUtils.isBlank(cdition.getSort())) {
            String desc = cdition.isSortType()?"ASC":"DESC";
            condition.append(" a." + cdition.getSort() + " " + desc + ", ");
        }

        return condition.toString();
    }
}
