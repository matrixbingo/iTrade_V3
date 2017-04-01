package utils.mail;

import javax.activation.CommandMap;
import javax.activation.MailcapCommandMap;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import ea.server.Controller;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;

import ea.module.beili.manager.BeiLiManagerListen;
import ea.server.Data;
import ea.service.res.dto.BeiliDto;
import ea.service.res.dto.FenBiInfoDto;
import ea.service.utils.base.Mark;
import ea.service.utils.var.control.UtilVar;

/**
 * 发送普通邮件，接受普通邮件 发送带有附件的邮件，接收带有附件的邮件 发送html形式的邮件，接受html形式的邮件 发送带有图片的邮件等做了一个总结
 */
public class Mail {
	private static Mail singleInstance = null;
	private String content = "";
	private int cno_dvt_05, cno_dvt_10, cno_dvt_30;
	
	public static Mail getSingleInstance(){
		if (singleInstance == null) {
			synchronized (BeiLiManagerListen.class) {
				if (singleInstance == null) {
					singleInstance = new Mail();
				}
			}
		}
		return singleInstance;
	}
	
	/**
	*用spring mail 发送邮件,依赖jar：spring.jar，activation.jar，mail.jar
	*/
	@SuppressWarnings("static-access")
	private void sendFileMail(String subject, String text){
		try {
	        JavaMailSenderImpl senderImpl = new JavaMailSenderImpl();
	        // 设定mail server
	        senderImpl.setHost("smtp.126.com");
	        senderImpl.setUsername("matrixbingoe@126.com");
	        senderImpl.setPassword("maoshiba87679214");
	        // 建立HTML邮件消息
	        MimeMessage mailMessage = senderImpl.createMimeMessage();
	        // true表示开始附件模式 
	        MimeMessageHelper messageHelper = new MimeMessageHelper(mailMessage, true, "utf-8");
	  
	        // 设置收件人，寄件人
	        //messageHelper.setTo("87679214@qq.com,maoshiba2005@126.com");
	        InternetAddress[] iaToList = new InternetAddress().parse(UtilVar.getSingleInstance().getStr("MailList"));
	        mailMessage.setRecipients(Message.RecipientType.TO, iaToList);
			
	        messageHelper.setFrom("matrixbingoe@126.com");
	        messageHelper.setSubject(subject);
	        // true 表示启动HTML格式的邮件 
	        messageHelper.setText(text, true);
	
	        //FileSystemResource file1 = new FileSystemResource(new File("d:/IMG.jpg"));
	        //FileSystemResource file2 = new FileSystemResource(new File("d:/2.txt"));
	        // 添加2个附件
	//        try {  
	//            //附件名有中文可能出现乱码
	//        	messageHelper.addAttachment(MimeUtility.encodeWord("IMG.jpg"), file1);
	//            messageHelper.addAttachment(MimeUtility.encodeWord("2.txt"), file2);
	//        } catch (UnsupportedEncodingException e) {
	//            e.printStackTrace();
	//            throw new MessagingException();
	//        } 
	        MailcapCommandMap mc = (MailcapCommandMap) CommandMap.getDefaultCommandMap();
	        mc.addMailcap("text/html;; x-java-content-handler=com.sun.mail.handlers.text_html");
	        mc.addMailcap("text/xml;; x-java-content-handler=com.sun.mail.handlers.text_xml");
	        mc.addMailcap("text/plain;; x-java-content-handler=com.sun.mail.handlers.text_plain");
	        mc.addMailcap("multipart/*;; x-java-content-handler=com.sun.mail.handlers.multipart_mixed");
	        mc.addMailcap("message/rfc822;; x-java-content-handler=com.sun.mail.handlers.message_rfc822");
	        CommandMap.setDefaultCommandMap(mc);
	        
	        // 发送邮件 
	        senderImpl.send(mailMessage);  
	        System.out.println("邮件发送成功 : " + UtilVar.getSingleInstance().getStr("MailList"));
		} catch (MessagingException e) {
			e.printStackTrace();
		}
    }
	
	/**
	 * 进场点
	 */
	public static void sendMailInMarket(int version, int dir, int type){
		
	}
	
	/**
	 * 背离邮件
	 */
	public void sendMail_Dvt(FenBiInfoDto fxDto, BeiliDto dto){
		if (Controller.isMail) {
			String updn = dto.getUpdn() == Mark.Beili_Bot ? "底" : "顶";

			if (fxDto.getType() == Mark.Fx_Db) {
				this.content = "DB: " + dto.getPeriod() + "分钟" + updn + "背离   " + dto.getTime();
			} else {
				this.content = "SE: " + dto.getPeriod() + "分钟" + updn + "背离   " + dto.getTime();
			}

			this.sendMail_Dvt(dto.getPeriod(), dto.getCno(), this.content);
		}
	}
	
	private void sendMail_Dvt(int period, int cno, String cont){
		if(Controller.isMail){
			boolean bool = false;

			switch (period) {
				case Mark.Period_M05:
					if (this.cno_dvt_05 != cno) {
						this.cno_dvt_05 = cno;
						bool = true;
					}
					break;
				case Mark.Period_M10:
					if (this.cno_dvt_10 != cno) {
						this.cno_dvt_10 = cno;
						bool = true;
					}
					break;
				case Mark.Period_M30:
					if (this.cno_dvt_30 != cno) {
						this.cno_dvt_30 = cno;
						bool = true;
					}
					break;
			}

			if (bool) {
				this.sendFileMail("背离 : ", this.content);
			}
		}
	}

	public static void main(String[] args) {
		
		Data.mail.sendFileMail("背离", "SE:5分钟顶背离");
		
	}
}