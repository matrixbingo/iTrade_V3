package test.annotation;


@UserClass("user")
public class User {
    @UserAttribute(name = "uu")
    private String uuid;

    @UserAttribute
    private String name;


}