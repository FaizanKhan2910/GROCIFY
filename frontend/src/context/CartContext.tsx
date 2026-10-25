"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { ProductData } from "@/components/marketplace/ProductCard";
import { Drawer } from "@/components/ui/Drawer";
import { Toast } from "@/components/ui/Toast";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { FreeShippingProgress } from "@/components/marketplace/FreeShippingProgress";
import { calculateShipping } from "@/lib/business-rules";
import { formatRupees } from "@/lib/formatters";
import Image from "next/image";
import { Trash2 } from "lucide-react";

export interface CartItem extends ProductData {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  wishlist: ProductData[];
  addToCart: (product: ProductData, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  toggleWishlist: (product: ProductData) => void;
  isWishlisted: (productId: string) => boolean;
  cartCount: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  showToast: (message: string, variant?: "success" | "info" | "error") => void;
  /** True once localStorage has been read on the client */
  hydrated: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY_CART = "grocify_cart_v1";
const STORAGE_KEY_WISHLIST = "grocify_wishlist_v1";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Always start empty so server + client first render match (no hydration mismatch).
  // After mount, restore persisted state from localStorage.
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<ProductData[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const storedCart = localStorage.getItem(STORAGE_KEY_CART);
        if (storedCart) setCart(JSON.parse(storedCart));
      } catch { /* ignore */ }
      try {
        const storedWishlist = localStorage.getItem(STORAGE_KEY_WISHLIST);
        if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
      } catch { /* ignore */ }
      setHydrated(true);
    });
  }, []);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastVariant, setToastVariant] = useState<"success" | "info" | "error">(
    "success"
  );

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
    } catch {
      // Ignored
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WISHLIST, JSON.stringify(wishlist));
    } catch {
      // Ignored
    }
  }, [wishlist]);

  const showToast = useCallback(
    (message: string, variant: "success" | "info" | "error" = "success") => {
      setToastVariant(variant);
      setToastMessage(message);
    },
    []
  );

  const addToCart = useCallback(
    (product: ProductData, quantity = 1) => {
      setCart((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prev, { ...product, quantity }];
      });
      showToast(`Added "${product.title}" to your bag.`, "success");
    },
    [showToast]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        setCart((prev) => prev.filter((item) => item.id !== productId));
        return;
      }
      setCart((prev) =>
        prev.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    },
    []
  );

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const toggleWishlist = useCallback(
    (product: ProductData) => {
      setWishlist((prev) => {
        const exists = prev.some((item) => item.id === product.id);
        if (exists) {
          showToast(`Removed "${product.title}" from saved items.`, "info");
          return prev.filter((item) => item.id !== product.id);
        } else {
          showToast(`Saved "${product.title}" to your wishlist.`, "success");
          return [...prev, product];
        }
      });
    },
    [showToast]
  );

  const isWishlisted = useCallback(
    (productId: string) => wishlist.some((item) => item.id === productId),
    [wishlist]
  );

  const cartCount = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart]
  );

  const cartSubtotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.sellingPrice * item.quantity, 0),
    [cart]
  );

  const shippingCalc = useMemo(
    () => calculateShipping(cartSubtotal),
    [cartSubtotal]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        updateQuantity,
        removeFromCart,
        toggleWishlist,
        isWishlisted,
        cartCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        showToast,
        hydrated,
      }}
    >
      {children}

      {/* Global Shopping Bag Drawer */}
      <Drawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        title={`Your Shopping Bag (${cartCount})`}
        position="right"
      >
        <div className="flex flex-col h-full justify-between">
          <div className="space-y-4">
            <FreeShippingProgress currentSubtotal={cartSubtotal} />

            {cart.length === 0 ? (
              <EmptyState
                title="Your shopping bag is empty"
                description="Explore everyday essentials priced under ₹1,000 with transparent verified credentials."
                actionLabel="Discover Essentials"
                onAction={() => {
                  setIsCartOpen(false);
                }}
              />
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 p-3 rounded-md border border-ivory-border bg-warm-ivory"
                  >
                    <div className="relative w-16 h-16 rounded overflow-hidden shrink-0 bg-ivory-muted">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h5 className="font-display font-semibold text-xs text-soft-ink line-clamp-1">
                        {item.title}
                      </h5>
                      <p className="text-[11px] text-ink-muted">
                        {item.category}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-mono font-bold text-xs text-deep-forest">
                          {formatRupees(item.sellingPrice * item.quantity)}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-6 h-6 rounded bg-ivory-muted hover:bg-ivory-border flex items-center justify-center text-xs font-bold"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="text-xs font-semibold px-1 font-mono">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-6 h-6 rounded bg-ivory-muted hover:bg-ivory-border flex items-center justify-center text-xs font-bold"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 rounded text-ink-subtle hover:text-coral-hover transition-colors"
                      aria-label={`Remove ${item.title} from bag`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="pt-4 border-t border-ivory-border space-y-3 mt-6">
              <div className="flex justify-between text-xs text-ink-muted">
                <span>Items Subtotal</span>
                <span className="font-mono">{formatRupees(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-ink-muted">
                <span>Shipping Fee</span>
                <span className="font-mono">
                  {shippingCalc.isFreeShipping
                    ? "FREE"
                    : formatRupees(shippingCalc.shippingFeeInr)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-soft-ink pt-2 border-t border-ivory-border">
                <span>Order Total</span>
                <span className="text-deep-forest font-mono text-base">
                  {formatRupees(cartSubtotal + shippingCalc.shippingFeeInr)}
                </span>
              </div>
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => {
                  showToast(
                    "Order checkout confirmed — ready for shipping.",
                    "success"
                  );
                }}
              >
                Proceed to Checkout
              </Button>
            </div>
          )}
        </div>
      </Drawer>

      {/* Global Wishlist Drawer */}
      <Drawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        title={`Saved Items (${wishlist.length})`}
        position="right"
      >
        <div className="space-y-4">
          {wishlist.length === 0 ? (
            <EmptyState
              title="No saved items yet"
              description="Click the heart icon on any product to bookmark essentials you want to purchase later."
              actionLabel="Explore Collections"
              onAction={() => setIsWishlistOpen(false)}
            />
          ) : (
            <div className="space-y-3">
              {wishlist.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-md border border-ivory-border bg-warm-ivory"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded overflow-hidden bg-ivory-muted shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h5 className="font-display font-semibold text-xs text-soft-ink line-clamp-1">
                        {item.title}
                      </h5>
                      <span className="font-mono text-xs text-deep-forest font-bold">
                        {formatRupees(item.sellingPrice)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        addToCart(item);
                        toggleWishlist(item);
                      }}
                    >
                      Move to Bag
                    </Button>
                    <button
                      type="button"
                      onClick={() => toggleWishlist(item)}
                      aria-label="Remove from saved items"
                      className="p-1 rounded text-ink-subtle hover:text-coral-hover"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Drawer>

      {/* Global Toast */}
      {toastMessage && (
        <Toast
          variant={toastVariant}
          message={toastMessage}
          isVisible={Boolean(toastMessage)}
          onDismiss={() => setToastMessage(null)}
        />
      )}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
