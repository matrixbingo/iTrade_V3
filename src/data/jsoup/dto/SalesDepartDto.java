package data.jsoup.dto;

import utils.NumberValidationUtils;

/**
 * 营业部
 * Created by liang.wang.sh on 2017/3/28.
 */
public class SalesDepartDto {
    private String code;                    //券商code
    private String province;                //省份
    private String salescode;               //营业部code
    private String salesname;               //营业部名称
    private String sumactbmoney;            //买入额(万)
    private String sumactsmoney;            //卖出额(万)
    private String sumactmoney;             //龙虎榜成交金额(万)
    private int bcount;                     //买入次数
    private int scount;                     //卖出次数
    private int upcount;                    //上榜次数


    public void setSumactbmoney(String sumactbmoney) {
        if (!NumberValidationUtils.isRealNumber((sumactbmoney))) {
            this.sumactbmoney = "0";
        } else {
            this.sumactbmoney = sumactbmoney;
        }
    }

    public void setSumactsmoney(String sumactsmoney) {
        if (!NumberValidationUtils.isRealNumber(sumactsmoney)) {
            this.sumactsmoney = "0";
        } else {
            this.sumactsmoney = sumactsmoney;
        }
    }

    public void setSumactmoney(String sumactmoney) {
        if (!NumberValidationUtils.isRealNumber(sumactmoney)) {
            this.sumactmoney = "0";
        } else {
            this.sumactmoney = sumactmoney;
        }
    }

    public void setBcount(String bcount) {
        if (!NumberValidationUtils.isRealNumber(bcount)) {
            this.bcount = 0;
        } else {
            this.bcount = Integer.valueOf(bcount);
        }
    }

    public void setScount(String scount) {
        if (!NumberValidationUtils.isRealNumber(scount)) {
            this.scount = 0;
        } else {
            this.scount = Integer.valueOf(scount);
        }
    }

    public void setUpcount(String upcount) {
        if (!NumberValidationUtils.isRealNumber(upcount)) {
            this.upcount = 0;
        } else {
            this.upcount = Integer.valueOf(upcount);
        }
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public String getSalescode() {
        return salescode;
    }

    public void setSalescode(String salescode) {
        this.salescode = salescode;
    }

    public String getSalesname() {
        return salesname;
    }

    public void setSalesname(String salesname) {
        this.salesname = salesname;
    }

    public int getBcount() {
        return bcount;
    }

    public void setBcount(int bcount) {
        this.bcount = bcount;
    }

    public int getScount() {
        return scount;
    }

    public void setScount(int scount) {
        this.scount = scount;
    }

    public int getUpcount() {
        return upcount;
    }

    public void setUpcount(int upcount) {
        this.upcount = upcount;
    }

    public String getSumactbmoney() {
        return sumactbmoney;
    }

    public String getSumactsmoney() {
        return sumactsmoney;
    }

    public String getSumactmoney() {
        return sumactmoney;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
