package test;

import javax.mail.search.SearchTerm;
import java.util.List;

/**
 * Created by tomjack on 15/5/5.
 */
public class TestEnum {
    private static String[] args;

    public enum ProcessType {
        CONTRACT(2,"合同审核","协议","新增"),

        DEAL_GROUP(3,"团单审核","团购单","新增"),

        GUARANTEE_FORM(4,"保底申请单审核","保底申请","新增");

        private final int value;

        private final String name;

        private final String category;

        private final String approve;

        ProcessType(int value, String name, String category, String approve) {
            this.value = value;
            this.name = name;
            this.category = category;
            this.approve = approve;
        }

        public int getValue() {
            return value;
        }

        public String getName() {
            return name;
        }

        public String getCategory() {
            return category;
        }

        public String getApprove() {
            return approve;
        }

        public static ProcessType valueOf(int value) {
            for (ProcessType p : values()) {
                if (p.getValue() == value) {
                    return p;
                }
            }
            return null;
        }

        }

    public static void main(String[] args){
        System.out.println(ProcessType.CONTRACT.getValue() + " : " + ProcessType.CONTRACT.getName() + " : " + ProcessType.CONTRACT.getApprove());
        System.out.println(ProcessType.valueOf(2).getApprove());



    }
}
