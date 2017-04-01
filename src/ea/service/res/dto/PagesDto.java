package ea.service.res.dto;

/**
 * Created by WL on 15/5/7.
 */
public class PagesDto {
    private PageDto pageDto_1 = new PageDto();
    private PageDto pageDto_2 = new PageDto();

    private int active_page = 1;

    public PageDto getPageDto() {
        if (this.active_page == 1) {
            return pageDto_1;
        }
        return pageDto_2;
    }

    public void setPageDto(PageDto pageDto) {
        if(this.active_page == 1){
            this.pageDto_1 = pageDto;
        }else{
            this.pageDto_2 = pageDto;
        }
    }

    public int getActive_page() {
        return active_page;
    }

    public void setActive_page(int active_page) {
        this.active_page = active_page;
    }

}
