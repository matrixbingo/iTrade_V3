package data.jsoup.test;

/*
import css.common.enums.jsoup_file;
import css.common.etc;*/

public class jsoup_etc {
/*
	public String XML_PATH = "";
	public String DOC_VAL = "";
	public Document DOC;

	public jsoup_etc(){
		
	}
	
	*//**
	 * 功能: 解析文件获得其 doc
	 * @param path 文件路径
	 * @param jf 文档格式
	 * 
	 **//*
	public jsoup_etc(String path ,jsoup_file jf){

		XML_PATH = path;
		String val = etc.FILES.read_whole_file(path);
		DOC_VAL = val;

		// 作为 XML 解析
		if(jf == jsoup_file.XML){
			DOC = Jsoup.parse(DOC_VAL, "", Parser.xmlParser());			
		}
		// 作为 HTML 解析
		if(jf == jsoup_file.HTML){
			DOC = Jsoup.parse(DOC_VAL, "", Parser.htmlParser());			
		}

	}

	*//**
	 * 功能:重置Doc的内容
	 * *//*
	public void resetDoc(String val ,jsoup_file jf){

		DOC_VAL = val;

		//作为 XML 解析
		if(jf == jsoup_file.XML){
			DOC = Jsoup.parse(DOC_VAL, "", Parser.xmlParser());			
		}
		//作为 HTML 解析
		if(jf == jsoup_file.HTML){
			DOC = Jsoup.parse(DOC_VAL, "", Parser.htmlParser());			
		}

	}
	
	*//**
	 * 功能:用Doc创建一个jsouptools对象
	 * *//*
	public jsoup_etc(Document argDoc){
		DOC = argDoc;
	}

	*//**
	 * 功能:获取一组元素
	 * *//*
	public Elements getElements(String argCSS){

		Elements rtn = null;
		try{

			rtn = DOC.select(argCSS);

		}catch(Exception e){
			e.printStackTrace();
		}
		return rtn;

	}

	*//**
	 * 功能:获得jsoup的一个元素
	 * *//*
	public Element getElement(String argCSS){

		Element rtn = null;
		try{

			rtn = DOC.select(argCSS).first();

		}catch(Exception e){
			e.printStackTrace();		
		}
		return rtn;

	}

	*//**
	 * 功能:获得一组元素的文本,元素间用回车和换行连接。
	 * *//*
	public String getElementsStringWithCRLF(Elements argEs){
		
		String rtn = "";

		for(Element e : argEs){

			String row = e.text();
			if (!etc.isNull(row)){
				rtn = rtn + e.text() + "\r\n";				
			}

		}
		return rtn;

	}

	*//**
	 * 功能:获取元素的完整text信息(含 CR/LF)
	 * 
	 * *//*
	public String getWholeContent(Element argVal){

		String rtn = "";
		try{

			List<?> nds = argVal.childNodes();
			
			for(TextNode nd : (List<TextNode>)nds){
			
				String dat = nd.getWholeText();
				rtn = rtn + dat;
			}

		}catch(Exception e){
			e.printStackTrace();			
		}
		rtn = rtn.replace("\r\n\t\r\n", "\r\n");
		return rtn;

	}

	*//**
	 * 功能:获取所有元素的完整text信息(含 CR/LF),并用列表返回
	 * 
	 * *//*
	public ArrayList<String> getElementsWholeContent(Elements argEs){
		
		ArrayList<String> rtn = new ArrayList<String>();
		for(Element e : argEs){
			String v = getWholeContent(e);
			rtn.add(v);
		}
		return rtn;

	}

	*//**
	 * 功能:输出文件,需要首先初始化'JSOUP_DOC'对象
	 * @param path 保存文件的路径
	 * *//*
	public void dumpPage(String path){

		FileOutputStream fos;
		try {

			File f = new File(path);
			if (f.exists()){
				f.delete();	
			}
			etc.FILES.checkFile(path);

			fos = new FileOutputStream(path, true);			
			OutputStreamWriter out = new OutputStreamWriter(
					fos, "UTF-8");

			out.write(DOC.html());
			out.flush();
			fos.close();
            out.close();

		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	public void load(String path){
	
		try{
			
			 
		}catch(Exception e){
			etc.error(etc.getExceptionStackTrace(e));
		}
		
	}*/
	
}
