package data.jsoup.data;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import data.jsoup.dto.SalesDepartTradeDto;
import data.jsoup.dto.SalesDepartTradeUrlDto;
import data.jsoup.util.JsoupUtils;
import ea.service.res.db.dao.DBComm;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

/**
 * 营业部交易明细
 * Created by liang.wang.sh on 2017/1/24.
 */

public class SalesDepartTrade {
    private static long id = 0;               //主键值
    private static int brokersBin = 39;        //开始遍历的券商
    private static int brokersEnd = 101;        //结束遍历的券商

    private static int num = 0;
    private static int maxPage = 500;

    public static void main(String[] args) throws Exception {
        execute();
    }

    /**
     * 根据营业部url取数据
     *
     * @param codes
     */
    private static void addSalesDepartTradeByCodes(List<String> codes) {
        List<SalesDepartTradeUrlDto> list = new ArrayList<SalesDepartTradeUrlDto>(1000);
        int pageDetailSize = 0;
        for (String code : codes) {
            for (int i = 1; i < maxPage; i++) {
                SalesDepartTradeUrlDto dto = new SalesDepartTradeUrlDto();
                dto.setPage(i);
                dto.setCode(code);
                pageDetailSize = getPageSize(dto.getUrl());
                if (pageDetailSize > 0 && pageDetailSize <= dto.getPagesize()) {
                    list.add(dto);
                    addSalesDepartTrade(dto);
                } else {
                    break;
                }
            }
        }
    }

    private static void addSalesDepartTrade(SalesDepartTradeUrlDto dto){
        System.out.println(++num + " : " + dto.getUrl());
        String json = JsoupUtils.getJson(dto.getUrl());
        List<SalesDepartTradeDto> salesDepartTradeDtos = initSalesDepartTradeDto(json);
        addSalesDepartTrades(salesDepartTradeDtos);
    }

    private static void addSalesDepartTrades(List<SalesDepartTradeDto> list) {
        for (SalesDepartTradeDto salesDepartTradeDto : list) {
            addSalesDepartTrade(salesDepartTradeDto);
        }
    }

    private static void addSalesDepartTrade(SalesDepartTradeDto dto) {
        String sql = getExistSql(dto);
        boolean bool = DBComm.isExist(sql.toString());
        if (!bool) {
            sql = getInsertSql(dto);
            System.out.println(sql);
            DBComm.executeUpdate(sql.toString());
        }
    }

    private static String getInsertSql(SalesDepartTradeDto dto) {
        StringBuffer sql = new StringBuffer("INSERT INTO `s_salesDepartTrade` (`id`, `salescode`, `sCode`, `sName`, `tDate`, `bMoney`, `sMoney`, `pBuy`, `cTypeDes`, `actSellNum`, `actBuyNum`) VALUES");
        sql.append("(" + (++id) + ", '" + dto.getSalescode() + "', '" + dto.getsCode() + "', '" + dto.getsName() + "', " + dto.gettDate() + ", '" + dto.getbMoney() + "', '" + dto.getsMoney() + "', '" + dto.getpBuy() + "', '" + dto.getCTypeDes() + "', '" + dto.getActSellNum() + "', '" + dto.getActBuyNum() + "')");
        return sql.toString();
    }

    private static String getExistSql(SalesDepartTradeDto dto) {
        StringBuffer sql = new StringBuffer("select id from s_salesDepartTrade ");
        sql.append(" where salescode = '" + dto.getSalescode() + "'");
        sql.append(" and sCode = '" + dto.getsCode() + "'");
        sql.append(" and tDate = '" + dto.gettDate() + "'");
        return sql.toString();
    }

    private static List<SalesDepartTradeDto> initSalesDepartTradeDto(String json) {
        List<SalesDepartTradeDto> list = new ArrayList<SalesDepartTradeDto>(500);
        JsonObject jObject = new JsonParser().parse(json).getAsJsonObject();
        JsonArray jsonArray = jObject.get("data").getAsJsonArray();
        if (jsonArray.size() > 0) {
            for (int j = 0; j < jsonArray.size(); j++) {
                JsonObject jsonObject;
                SalesDepartTradeDto dto;
                try {
                    dto = new SalesDepartTradeDto();
                    jsonObject = (JsonObject) jsonArray.get(j);
                    dto.setSalescode(jsonObject.get("SalesCode").getAsString());
                    dto.setsCode(jsonObject.get("SCode").getAsString());
                    dto.setsName(jsonObject.get("SName").getAsString());
                    dto.settDate(jsonObject.get("TDate").getAsString());
                    dto.setbMoney(jsonObject.get("BMoney").getAsString());
                    dto.setsMoney(jsonObject.get("SMoney").getAsString());
                    dto.setpBuy(jsonObject.get("PBuy").getAsString());
                    dto.setcTypeDes(jsonObject.get("CTypeDes").getAsString());
                    dto.setActSellNum(jsonObject.get("ActSellNum").getAsString());
                    dto.setActBuyNum(jsonObject.get("ActBuyNum").getAsString());
                    list.add(dto);
                } catch (Exception e) {
                    e.getStackTrace();
                }
            }
        }
        return list;
    }

    private static int getPageSize(String url) {
        String json = JsoupUtils.getJson(url);
        JsonObject jObject = new JsonObject();
        try{
            jObject = new JsonParser().parse(json).getAsJsonObject();
        }catch (Exception e){
            e.getStackTrace();
        }
        JsonArray jsonArray = jObject.get("data").getAsJsonArray();
        return jsonArray.size();
    }

    /**
     * 分页得到营业部所有code
     *
     * @return
     */
    private static List<String> getPageSalesDepartCodes(String code) throws Exception {
        List<String> Codes = new ArrayList<String>(1000);
        ResultSet rs = DBComm.executeQuery("select salescode from s_salesDeparts where code = '" + code + "'");
        while (rs.next()) {
            Codes.add(rs.getString("salescode"));
        }
        return Codes;
    }

    private static void execute() throws Exception {
        id = DBComm.getNum("select if(max(id) > 0, max(id), 0) id from s_salesDepartTrade", "id");
        ResultSet rs = DBComm.executeQuery("select code from s_brokers where id >= " + brokersBin + " and id <=" + brokersEnd);
        while (rs.next()) {
            List<String> salescodes = getPageSalesDepartCodes(rs.getString("code"));
            addSalesDepartTradeByCodes(salescodes);
        }
    }
}
