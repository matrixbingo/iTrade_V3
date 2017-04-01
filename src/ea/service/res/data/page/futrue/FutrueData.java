package ea.service.res.data.page.futrue;

import ea.server.Controller;
import ea.server.Data;
import ea.service.res.db.dao.DBComm;
import ea.service.res.db.dao.MySql_DB;
import ea.service.res.dto.BaseDto;
import ea.service.res.dto.CandlesDto;
import ea.service.res.dto.PageDto;
import ea.service.utils.base.Mark;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;

/**
 * Created by tomjack on 15/5/11.
 */
public class FutrueData {
    private static FutrueData singleInstance = null;
    public static FutrueData getSingleInstance() {
        if (singleInstance == null) {
            synchronized (FutrueData.class) {
                if (singleInstance == null) {
                    singleInstance = new FutrueData();
                }
            }
        }
        return singleInstance;
    }
    private int num = 1;
    /**
     * DB加载数据，每页 Controller.pageNums 条
     *
     * @param period
     * @param page
     */
    final public PageDto loadPageDtoFormDB(int period, int page) {
        HashMap<Long, CandlesDto> klinesMap = new HashMap<Long, CandlesDto>((int) (Controller.pageNums * 1.2));
        Data.fxManager.initMapByPeriod(period);
        int start = (page - 1) * Controller.pageNums;
        int end = page * Controller.pageNums;
        //PageDto pdto = pM.getPageTime(period, page);
        PageDto pdto = new PageDto();
        long time = Mark.No_Time;
        String sql = PageManagerNew.getSingleInstance().getSql(period, start, end);
        System.out.print("sql : ------->" + sql);
        ResultSet rs = DBComm.executeQuery(sql);
        try {
            while (rs.next()) {
                CandlesDto dto = new CandlesDto();
                time = rs.getLong("time");

                dto.setCno(rs.getInt("cno"));
                dto.setPeriod(period);
                dto.setTime(time);
                dto.setOpen(rs.getDouble("open"));
                dto.setClose(rs.getDouble("close"));
                dto.setHigh(rs.getDouble("high"));
                dto.setLow(rs.getDouble("low"));
                dto.setBar(rs.getDouble("bar"));

                klinesMap.put(time, dto);
                Data.fxManager.addDtoByPeriod(period, dto);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            try {
                MySql_DB.getSingleInstance().close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        if (klinesMap.isEmpty()) {
            return null;
        }
        pdto.setMap(klinesMap);
        pdto.setPage(page);
        pdto.setPeriod(period);
        return pdto;
    }

    public static void main(String[] args){
        PageManagerNew pM = PageManagerNew.getSingleInstance();
        pM.initNumMap(1, new HashMap<Integer, BaseDto>() {{
            put(1, new BaseDto());
        }});
        PageDto page = FutrueData.getSingleInstance().loadPageDtoFormDB(1, 1);
        System.out.println(page.getMap());
    }
}
