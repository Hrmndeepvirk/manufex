import React, { use } from "react";
import CustomAnimatedCard from "../../../shared/animations/CustomAnimatedCard";
import { useCurrencyFormatter } from "../../../hooks/useCurrencyFormatter";
import placehlolderImage from "../../../assets/images/placeholder1.png";
import { usePos } from "../PosContext";

function CatalogItem({ item, index }) {
  let { includesTax, itemCaption, title, price } = item;
  const { formatCurrency } = useCurrencyFormatter();
  const { onSelectProduct } = usePos();
  return (
    <CustomAnimatedCard
      index={index}
      className="c-col-3 cursor-pointer"
      onClick={() => onSelectProduct(item)}
    >
      <div className="product-card">
        <img
          className="product-image"
          src={item?.images[0] || placehlolderImage}
          alt={title}
          onError={(e) => {
            e.target.src = placehlolderImage;
          }}
        />
        <div className="product-content">
          <div className="product-name ellipsis-text">
            <span title={title}>{itemCaption}</span>
          </div>
          <div className="product-price">
            <span title={includesTax ? "includes tax" : "excludes tax"}>
              {formatCurrency(price)}
              {!includesTax && "*"}
            </span>
          </div>
        </div>
      </div>
    </CustomAnimatedCard>
  );
}

export default React.memo(CatalogItem);
