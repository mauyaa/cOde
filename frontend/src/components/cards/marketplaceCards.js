/**
 * marketplaceCards.js — adapters that plug card concepts into Marketplace.js
 * without touching the page's existing filter/search/dialog logic.
 */

import ShiftedGridCard from './ShiftedGridCard';

/**
 * ListingItem — ShiftedGridCard rendered with a product object
 * as the Marketplace "row" render.
 */
export default function ListingItem({ product, currentUserId, onOrder, onContact }) {
  const owned = String(product.sellerId) === String(currentUserId);
  return (
    <ShiftedGridCard
      name={product.name || product.title}
      category={product.category}
      description={product.description}
      location={product.location}
      pricePerUnit={product.pricePerUnit || product.price}
      unit={product.unit}
      quantity={product.quantity}
      available={product.available !== false}
      sellerName={product.sellerName}
      sellerId={product.sellerId}
      productId={product.id}
      isOwn={owned}
      onOrder={() => onOrder?.(product)}
      onContact={() => onContact?.(product)}
    />
  );
}
