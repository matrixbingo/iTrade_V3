package test;

/**
 * Created by tomjack on 15/8/19.
 */
public enum ProcessType {
    CONTRACT(2, "合同审核", "协议", "新增"),
    DEAL_GROUP(3, "团单审核", "团购单", "新增"),
    GUARANTEE_FORM(4, "保底申请单审核", "保底申请", "新增"),
    SUBSIDY(5, "补贴申请单审核", "补贴申请", "新增"),
    CUSTOMER(6, "客户信息", "客户", "新增"),
    BANK_ACCOUNT(7, "银行账号", "银行账号", "新增"),
    CUSTOMER_SHOP(8, "分店", "分店", "新增"),
    SEC_KILL(9, "秒杀单审核", "秒杀单", "新增"),
    CUSTOMER_BY_MERCHANT(10, "商户自建客户", "客户", "新增"),
    CONTRACT_EDIT(12, "合同修改", "协议", "修改"),
    DEAL_GROUP_EDIT(13, "团单修改", "团购单", "修改"),
    SUBSIDY_EDIT(15, "补贴申请单修改", "补贴申请", "修改"),
    CUSTOMER_EDIT(16, "客户信息", "客户", "修改"),
    CUSTOMER_SHOP_EDIT(18, "分店修改", "分店", "修改"),
    DEAL_GROUP_BY_CUSTOMER(21, "团单审核(商户自助)", "团购单", "新增"),
    DEAL_GROUP_BY_CUSTOMER_EDIT(22, "团单修改(商户自助)", "团购单", "修改"),
    DEAL_GROUP_FAST_EDIT(23, "团单快速变更", "团购单", "修改"),
    GUARANTEE_FORM_INCREASE(24, "保底加量申请单审核", "保底申请", "修改"),
    SECKILL_SUBSIDY(25, "秒杀补贴申请单审核", "秒杀补贴申请", "新增"),
    FILM_SELECT(31, "电影选座审核", "电影选座", "新增"),
    FILM_SELECT_EDIT(32, "电影选座修改", "电影选座", "修改"),
    GUARANTEE_FORM_NEW(26, "保底申请单审核新", "保底申请", "新增"),
    AD_CONTRACT(33, "合同审核", "协议", "新增"),
    AD_BANK_ACCOUNT(34, "银行账号", "银行账号", "新增"),
    GUARANTEE_FORM_NEW_V2(35, "保底申请单审核V2", "保底申请", "新增"),
    CONTRACT_ADDITIONAL(36, "补充合同审核", "协议", "新增"),
    KTV_SOLUTION(1011, "KTV预订方案", "方案", "新增"),
    KTV_SOLUTION_EDIT(1012, "KTV预订方案", "方案", "修改"),
    VC_SOLUTION(1021, "垂直频道方案", "方案", "新增"),
    VC_SOLUTION_EDIT(1022, "垂直频道方案", "方案", "修改"),
    HUI_SOLUTION(1031, "闪惠方案", "方案", "新增"),
    HUI_SOLUTION_EDIT(1032, "闪惠方案", "方案", "修改"),
    PAY_SOLUTION(1041, "闪付方案", "方案", "新增"),
    PAY_SOLUTION_EDIT(1042, "闪付方案", "方案", "修改"),
    DISH_SOLUTION(1051, "点菜方案", "方案", "新增"),
    DISH_SOLUTION_EDIT(1052, "点菜方案", "方案", "修改");

    private final int value;
    private final String name;
    private final String category;
    private final String approve;

    private ProcessType(int value, String name, String category, String approve) {
        this.value = value;
        this.name = name;
        this.category = category;
        this.approve = approve;
    }

    public int getValue() {
        return this.value;
    }

    public String getName() {
        return this.name;
    }

    public String getCategory() {
        return this.category;
    }

    public String getApprove() {
        return this.approve;
    }

    public static ProcessType valueOf(int value) {
        ProcessType[] arr$ = values();
        int len$ = arr$.length;

        for (int i$ = 0; i$ < len$; ++i$) {
            ProcessType p = arr$[i$];
            if (p.getValue() == value) {
                return p;
            }
        }

        return null;
    }

    public static void  main(String[] agrs){
        ProcessType t = valueOf(36);
        System.out.print(t);
    }
}
