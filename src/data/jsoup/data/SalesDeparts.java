package data.jsoup.data;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import data.jsoup.dto.SalesDepartDto;
import data.jsoup.dto.SalesDepartUrlDto;
import data.jsoup.util.JsoupUtils;
import ea.service.res.db.dao.DBComm;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

/**
 * 营业部数据初始化 各个营业部 东财
 * Created by liang.wang.sh on 2017/1/24.
 */

public class SalesDeparts {
    private static String baseUrl = "http://data.eastmoney.com/";
    private static String searchUrl = "";
    private static Gson gson = new Gson();
    private static int maxPage = 10;

    private static long id = 0;
    private static long limitSize = 10;
    private static int limitBin = 100;

    public static void main(String[] args) throws Exception {
        id = DBComm.getNum("select if(max(id) > 0, max(id), 0)  id from s_salesDeparts", "id");
        List<SalesDepartUrlDto> urls = getAllSalesDepartUrl();
        addSalesDepartsByUrls(urls);
    }

    private static void addSalesDepartsByUrls(List<SalesDepartUrlDto> list) throws Exception{
        for(SalesDepartUrlDto dto : list){
            String json = JsoupUtils.getJson(dto.getUrl());
            List<SalesDepartDto> salesDepartDtos = initSalesDepartDto(json, dto.getCode());
            addSalesDeparts(salesDepartDtos);
        }
    }

    private static List<SalesDepartDto> initSalesDepartDto(String json, String code){
        List<SalesDepartDto> list = new ArrayList<SalesDepartDto>(500);
        JsonObject jObject = new JsonParser().parse(json).getAsJsonObject();
        JsonArray jsonArray = jObject.get("data").getAsJsonArray();
        if(jsonArray.size() > 0){
            for (int j = 0; j < jsonArray.size(); j++) {
                JsonObject jsonObject;
                SalesDepartDto salesDepartDto;
                try {
                    salesDepartDto = new SalesDepartDto();
                    jsonObject = (JsonObject) jsonArray.get(j);
                    salesDepartDto.setCode(code);
                    salesDepartDto.setProvince(jsonObject.get("Province").getAsString());
                    salesDepartDto.setSalescode(jsonObject.get("SalesCode").getAsString());
                    salesDepartDto.setSalesname(jsonObject.get("SalesName").getAsString());
                    salesDepartDto.setSumactbmoney(jsonObject.get("SumActBMoney").getAsString());
                    salesDepartDto.setSumactsmoney(jsonObject.get("SumActSMoney").getAsString());
                    salesDepartDto.setSumactmoney(jsonObject.get("SumActMoney").getAsString());
                    salesDepartDto.setBcount(jsonObject.get("BCount").getAsString());
                    salesDepartDto.setScount(jsonObject.get("SCount").getAsString());
                    salesDepartDto.setUpcount(jsonObject.get("UpCount").getAsString());
                    list.add(salesDepartDto);
                } catch (Exception e) {
                    System.out.println(e.getStackTrace());
                }
            }
        }
        return list;
    }

    private static void addSalesDeparts(List<SalesDepartDto> list) {
        for(SalesDepartDto salesDepartDto : list){
            addSalesDepart(salesDepartDto);
        }
    }

    private static void addSalesDepart(SalesDepartDto dto){
        String sql = getExistSql(dto.getSalesname(), dto.getSalescode());
        boolean bool = DBComm.isExist(sql.toString());
        if (!bool) {
            sql = getInsertSql(dto);
            System.out.println(sql);
            DBComm.executeUpdate(sql.toString());
        }
    }

    private static String getExistSql(String name, String code) {
        StringBuffer sql = new StringBuffer("select id from s_salesDeparts");
        sql.append(" where salesname = '" + name + "'");
        sql.append(" and salescode = '" + code + "'");
        return sql.toString();
    }

    private static String getInsertSql(SalesDepartDto dto) {
        StringBuffer sql = new StringBuffer("INSERT INTO `s_salesDeparts` (`id`, `code`, `province`, `salescode`, `salesname`, `sumactbmoney`, `sumactsmoney`, `sumactmoney`, `bcount`, `scount`, `upcount`) VALUES");
        sql.append("(" + (++id) + ", '" + dto.getCode() + "', '" + dto.getProvince() + "', '" + dto.getSalescode() + "', '" + dto.getSalesname() + "', '" + dto.getSumactbmoney() + "', '" + dto.getSumactsmoney() + "', '" + dto.getSumactmoney() + "', '" + dto.getBcount() + "', '" + dto.getScount() + "', '" + dto.getUpcount() + "')");
        return sql.toString();
    }

    /**
     * 得到所有券商对应营业部的url
     *
     * @return
     * @throws Exception
     */
    public static List<SalesDepartUrlDto> getAllSalesDepartUrl() throws Exception {
        ResultSet rs = DBComm.executeQuery("select code from s_brokers order by id limit " + limitBin + "," + limitSize);
        //ResultSet rs = DBComm.executeQuery("select code from s_brokers where code = '80121898'");
        List<SalesDepartUrlDto> list = new ArrayList<SalesDepartUrlDto>(1000);
        int pageSize;
        while (rs.next()) {
            for (int i = 1; i < maxPage; i++) {
                SalesDepartUrlDto dto = new SalesDepartUrlDto();
                dto.setPage(i);
                dto.setCode(rs.getString("code"));
                pageSize = getPageSize(dto.getUrl());
                if (pageSize > 0 && pageSize <= dto.getPagesize()) {
                    list.add(dto);
                    System.out.println(dto.getUrl());
                } else {
                    break;
                }
            }
        }
        return list;
    }

    private static int getPageSize(String url) {
        String json = JsoupUtils.getJson(url);
        JsonObject jObject = new JsonParser().parse(json).getAsJsonObject();
        JsonArray jsonArray = jObject.get("data").getAsJsonArray();
        return jsonArray.size();
    }
}
