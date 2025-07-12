package basilium.basiliumserver.global.util;

public class MaskingUtil {
    private MaskingUtil() {}

    /** 사용자 ID 앞 3글자 마스킹 */
    public static String maskUserId(String id) {
        if (id == null || id.length() <= 3) {
            return "***";
        }
        return "***" + id.substring(3);
    }

    /** 사용자 ID 뒤 3글자 마스킹 */
    public static String maskUserIdSuffix(String id) {
        if (id == null || id.length() <= 3) {
            return "***";
        }
        int len = id.length();
        return id.substring(0, len - 3) + "***";
    }
}
