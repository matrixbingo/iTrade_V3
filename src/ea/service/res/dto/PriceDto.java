package ea.service.res.dto;

public class PriceDto {
	private double maxPrice;
	private double minPrice;
	
	final public double getMaxPrice() {
		return this.maxPrice;
	}
	final public void setMaxPrice(double maxPrice) {
		this.maxPrice = maxPrice;
	}
	final public double getMinPrice() {
		return this.minPrice;
	}
	final public void setMinPrice(double minPrice) {
		this.minPrice = minPrice;
	}
}
