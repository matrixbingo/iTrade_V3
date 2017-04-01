package data.jsoup.dto;

import utils.NumberValidationUtils;

/**
 * 营业部交易
 * Created by liang.wang.sh on 2017/3/29.
 */
public class SalesDepartTradeDto {
    private String salescode;       //营业部code
    private String sCode;           //股票代码
    private String sName;
    private int tDate;              //日期
    private String bMoney;          //营业部买入额(手)
    private String sMoney;          //营业部卖出额(手)
    private String pBuy;            //买卖净额(手)
    private String cTypeDes;        //类型描述
    private String actSellNum;      //主动卖(可能)
    private String actBuyNum;       //主动买(可能)

    public void setsCode(String sCode) {
        this.sCode = sCode;
    }

    public void setsName(String sName) {
        this.sName = sName;
    }

    public void settDate(String tDate) {
        if(tDate.length() == 10){
            this.tDate = Integer.parseInt(tDate.replace("-", ""));
        }else{
            System.out.println("日期格式错误");
            throw new RuntimeException();
            //String[] arr = tDate.split("-");
        }
    }

    public void setbMoney(String bMoney) {
        if (!NumberValidationUtils.isRealNumber((bMoney))) {
            this.bMoney = "0";
        } else {
            this.bMoney = bMoney;
        }
    }

    public void setsMoney(String sMoney) {
        if (!NumberValidationUtils.isRealNumber((sMoney))) {
            this.sMoney = "0";
        } else {
            this.sMoney = sMoney;
        }
    }

    public void setpBuy(String pBuy) {
        if (!NumberValidationUtils.isRealNumber((pBuy))) {
            this.pBuy = "0";
        } else {
            this.pBuy = pBuy;
        }
    }

    public void setcTypeDes(String cTypeDes) {
        this.cTypeDes = cTypeDes;
    }

    public void setActSellNum(String actSellNum) {
        if (!NumberValidationUtils.isRealNumber((actSellNum))) {
            this.actSellNum = "0";
        } else {
            this.actSellNum = actSellNum;
        }
    }

    public void setActBuyNum(String actBuyNum) {
        if (!NumberValidationUtils.isRealNumber((actBuyNum))) {
            this.actBuyNum = "0";
        } else {
            this.actBuyNum = actBuyNum;
        }
    }

    public String getsCode() {
        return sCode;
    }

    public String getsName() {
        return sName;
    }

    public int gettDate() {
        return tDate;
    }

    public String getbMoney() {
        return bMoney;
    }

    public String getsMoney() {
        return sMoney;
    }

    public String getpBuy() {
        return pBuy;
    }

    public String getCTypeDes() {
        return cTypeDes;
    }

    public String getActSellNum() {
        return actSellNum;
    }

    public String getActBuyNum() {
        return actBuyNum;
    }

    public String getSalescode() {
        return salescode;
    }

    public void setSalescode(String salescode) {
        this.salescode = salescode;
    }

}
