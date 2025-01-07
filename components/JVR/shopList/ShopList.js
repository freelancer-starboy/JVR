import Link from "next/link";
const ShopList = ({
  id,
  name,
  thumb1,
  thumb2,
  description,
  price,
  category,
  type,
  brand,
}) => {
  return (
    <>
    

    <div className="custom-product-card"  key={id}>
        <Link href={`/ShopDetails/${id}`}>
        
      <div className="custom-product-image">
        <img src={thumb1} alt={name} />
      </div>
      <div className="custom-content-main">
     <h6>{brand}</h6>
      <h3 className="custom-product-title">{name}</h3>
      <p className="custom-product-price">₹ <span>{price}</span></p>
      </div>
        </Link>
    </div>
    
    </>
  );
};

export default ShopList;
