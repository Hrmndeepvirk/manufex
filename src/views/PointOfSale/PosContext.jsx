/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import {
  roundOfNumber,
  calculateTax,
  calculateDiscountedAmount,
} from "@utils/taxHelpers";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  createSale,
  validateDiscountUsage,
  validateRedemption,
} from "../../store/pointOfSale/pointOfSaleActions";
import { getSavedCart } from "../../store/pointOfSale/savedCartActions";
import { showToastAction } from "../../store/common/commonActions";

const PosContext = createContext(null);

// Cart-wide helper: find first non-combinable discount across all items and promo
function findNonCombinableInCart(items, promo, excludeIndex = -1) {
  for (let i = 0; i < items.length; i++) {
    if (i === excludeIndex) continue;
    if (items[i].defaultDiscount && !items[i].defaultDiscount.canBeCombined) {
      return items[i].defaultDiscount;
    }
    if (items[i].specialDiscount && !items[i].specialDiscount.canBeCombined) {
      return items[i].specialDiscount;
    }
  }
  if (promo && !promo.canBeCombined) {
    return promo;
  }
  return null;
}

// Cart-wide helper: check if any discount exists in the cart
function hasAnyDiscountInCart(items, promo, excludeIndex = -1) {
  for (let i = 0; i < items.length; i++) {
    if (i === excludeIndex) continue;
    if (items[i].defaultDiscount || items[i].specialDiscount) {
      return true;
    }
  }
  return !!promo;
}

function toNumber(value) {
  const rawValue = value?.value ?? value;
  if (
    rawValue === null ||
    rawValue === undefined ||
    (typeof rawValue === "string" && rawValue.trim() === "")
  ) {
    return null;
  }

  const parsed = Number(rawValue);
  return Number.isFinite(parsed) ? parsed : null;
}

function getDiscountValidationError(discount, { maxFixedAmount } = {}) {
  if (!discount) return null;

  const amount = toNumber(discount.amount);
  if (amount === null) {
    return "has an invalid discount amount.";
  }
  if (amount < 0) {
    return "cannot have a negative discount amount.";
  }
  if (discount.amountType === "PERCENTAGE" && amount > 100) {
    return "percentage cannot exceed 100%.";
  }
  if (
    typeof maxFixedAmount === "number" &&
    discount.amountType === "FIXED" &&
    amount > maxFixedAmount
  ) {
    return `cannot exceed item price ($${maxFixedAmount}).`;
  }
  return null;
}

function getAppliedDiscountAmount(discount, baseAmount) {
  const amount = toNumber(discount?.amount);
  if (amount === null || amount <= 0) {
    return 0;
  }

  if (discount.amountType === "PERCENTAGE") {
    const safePercent = Math.min(amount, 100);
    return Math.min(
      baseAmount,
      calculateDiscountedAmount(baseAmount, safePercent),
    );
  }

  if (discount.amountType === "FIXED") {
    return Math.min(amount, baseAmount);
  }

  return 0;
}

function getInvalidDiscountInCart(items, promo, salesCode) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const discountEntries = [
      item.defaultDiscount,
      item.specialDiscount,
      item.promoDiscount,
      item.salesCodeDiscount,
    ];

    for (let j = 0; j < discountEntries.length; j++) {
      const error = getDiscountValidationError(discountEntries[j]);
      if (error) {
        return `"${item.title || item.itemCaption || "Selected item"}" ${error}`;
      }
    }
  }

  const promoError = getDiscountValidationError(promo);
  if (promoError) {
    return `"${promo.title || promo.discountCode || "Promo"}" ${promoError}`;
  }

  if (salesCode?.discounts?.length) {
    const invalidSalesCodeDiscount = salesCode.discounts.find((disc) =>
      getDiscountValidationError(disc),
    );
    if (invalidSalesCodeDiscount) {
      return `Sales code "${salesCode.salesCode || "Applied sales code"}" includes an invalid discount value.`;
    }
  }

  return null;
}

export const PosProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { state: locationState } = useLocation();

  const { selectedDrawer } = useSelector((state) => state.pos);

  const [errors, setErrors] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedSubCategoryGroup, setSelectedSubCategoryGroup] =
    useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [appliedSalesCode, setAppliedSalesCode] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [tags, setTags] = useState([]);
  const [filterSets, setFilterSets] = useState([]);
  const [cartDetails, setCartDetails] = useState({});
  const [showCheckout, setShowCheckout] = useState(false);

  const [additionalPrePay, setAdditionalPrePay] = useState(null);

  const [variationProduct, setVariationProduct] = useState(null);
  const [saveCartPopup, setSaveCartPopup] = useState(false);
  const [discountPopup, setDiscountPopup] = useState(false);
  const [specialDiscountPopup, setSpecialDiscountPopup] = useState(false);

  const getCheckoutBlockMessage = () =>
    getInvalidDiscountInCart(selectedItems, appliedPromo, appliedSalesCode);

  const onOverrideDiscount = (index, item) => {
    // Cart-wide: Block if any existing discount in the cart is non-combinable
    const existingNonCombinable = findNonCombinableInCart(
      selectedItems,
      appliedPromo,
      index,
    );
    if (existingNonCombinable) {
      dispatch(
        showToastAction({
          description: `"${existingNonCombinable.title || existingNonCombinable.discountCode}" in the cart cannot be combined with other discounts.`,
          type: "error",
        }),
      );
      return;
    }
    const targetItemForPopup = selectedItems[index];
    setDiscountPopup({
      index,
      item,
      itemId: targetItemForPopup?.catalogItemId || targetItemForPopup?._id,
    });
  };

  const onApplyDiscount = async (index, discount) => {
    const targetItem = selectedItems[index];
    const itemId = String(targetItem?.catalogItemId || targetItem?._id);

    // Block if this discount is restricted to specific items and current item is not eligible
    const discountServices = discount.services || [];
    if (discountServices.length > 0) {
      const isEligible = discountServices.some(
        (sId) => String(sId?._id || sId) === itemId,
      );
      if (!isEligible) {
        dispatch(
          showToastAction({
            description: `"${discount.title || discount.discountCode}" is not applicable to this item.`,
            type: "error",
          }),
        );
        return;
      }
    }

    // Cart-wide: Block if any existing discount in the cart is non-combinable
    const existingNonCombinable = findNonCombinableInCart(
      selectedItems,
      appliedPromo,
      index,
    );
    if (existingNonCombinable) {
      dispatch(
        showToastAction({
          description: `"${existingNonCombinable.title || existingNonCombinable.discountCode}" in the cart cannot be combined with other discounts.`,
          type: "error",
        }),
      );
      return;
    }

    // Cart-wide: Block if this discount is non-combinable and any other discount exists
    if (
      !discount.canBeCombined &&
      hasAnyDiscountInCart(selectedItems, appliedPromo, index)
    ) {
      dispatch(
        showToastAction({
          description: `"${discount.title || discount.discountCode}" cannot be combined with other discounts.`,
          type: "error",
        }),
      );
      return;
    }

    const discountError = getDiscountValidationError(discount);
    if (discountError) {
      dispatch(
        showToastAction({
          description: `"${discount.title || discount.discountCode}" ${discountError}`,
          type: "error",
        }),
      );
      return;
    }

    // Validate discount usage limits before applying
    if (discount._id) {
      const isValid = await dispatch(
        validateDiscountUsage(discount._id, selectedMember),
      );
      if (!isValid) return;
    }

    setSelectedItems((prev) => {
      let _arr = [...prev];
      // If the new discount is non-combinable, clear special discount on this item only
      if (!discount.canBeCombined && _arr[index].specialDiscount) {
        _arr[index] = {
          ..._arr[index],
          defaultDiscount: discount,
          specialDiscount: null,
        };
        dispatch(
          showToastAction({
            description: `"${discount.title || discount.discountCode}" cannot be combined. Special discount on this item has been removed.`,
            type: "warning",
          }),
        );
      } else {
        _arr[index] = { ..._arr[index], defaultDiscount: discount };
      }
      return _arr;
    });
  };

  const onAddSpecialDiscount = (index, item) => {
    const targetItem = selectedItems[index];

    // Cart-wide: Block if any existing discount in the cart is non-combinable
    const existingNonCombinable = findNonCombinableInCart(
      selectedItems,
      appliedPromo,
      -1,
    );
    if (existingNonCombinable) {
      dispatch(
        showToastAction({
          description: `"${existingNonCombinable.title || existingNonCombinable.discountCode}" in the cart cannot be combined with other discounts.`,
          type: "error",
        }),
      );
      return;
    }
    // Block special discounts on BOGO parent items
    if (targetItem?.defaultDiscount?.isThisItemBogo) {
      dispatch(
        showToastAction({
          description: "Special discounts cannot be applied to BOGO items.",
          type: "error",
        }),
      );
      return;
    }
    // Block special discounts on BOGO catalog items (e.g., Redbull when parent is in cart)
    const targetId = String(targetItem?._id);
    const isBogoItem = selectedItems.some(
      (si) =>
        si.defaultDiscount?.isThisItemBogo &&
        (si.defaultDiscount.bogoItems || []).some(
          (bogoId) => String(bogoId?._id || bogoId) === targetId,
        ),
    );
    if (isBogoItem) {
      dispatch(
        showToastAction({
          description: "Special discounts cannot be applied to BOGO items.",
          type: "error",
        }),
      );
      return;
    }
    setSpecialDiscountPopup({
      index,
      item: targetItem,
      discount: item || targetItem?.specialDiscount || null,
    });
  };

  const onApplySpecialDiscount = async (index, discount) => {
    // Cart-wide: Block if any existing discount in the cart is non-combinable
    const existingNonCombinable = findNonCombinableInCart(
      selectedItems,
      appliedPromo,
      -1,
    );
    if (existingNonCombinable) {
      dispatch(
        showToastAction({
          description: `"${existingNonCombinable.title || existingNonCombinable.discountCode}" in the cart cannot be combined with other discounts.`,
          type: "error",
        }),
      );
      return;
    }

    // Validate discount usage limits before applying
    if (discount._id) {
      const isValid = await dispatch(
        validateDiscountUsage(discount._id, selectedMember),
      );
      if (!isValid) return;
    }

    const targetItem = selectedItems[index];
    const discountError = getDiscountValidationError(discount, {
      maxFixedAmount: targetItem?.finalUnitPrice ?? targetItem?.unitPrice ?? 0,
    });
    if (discountError) {
      dispatch(
        showToastAction({
          description: `Special discount ${discountError}`,
          type: "error",
        }),
      );
      return;
    }

    setSelectedItems((prev) => {
      let _arr = [...prev];
      _arr[index] = { ..._arr[index], specialDiscount: discount };
      return _arr;
    });
  };

  const onRemoveSpecialDiscount = (index) => {
    setSelectedItems((prev) => {
      let _arr = [...prev];
      _arr[index] = { ..._arr[index], specialDiscount: null };
      return _arr;
    });
  };

  const openSaveCart = () => {
    if (!selectedItems.length) {
      dispatch(
        showToastAction({
          description: "Your cart is empty. Add items to proceed.",
          type: "warning",
        }),
      );
      return;
    }
    if (!selectedMember) {
      dispatch(
        showToastAction({
          description: "Please select a member to continue.",
          type: "warning",
        }),
      );
      return;
    }
    setSaveCartPopup(true);
  };

  const closeSaveCart = () => {
    setSaveCartPopup(false);
  };

  const onCartSaved = () => {
    setSaveCartPopup(false);
    setSelectedItems([]);
    setSelectedMember(null);
    setAppliedPromo(null);
    setAppliedSalesCode(null);
  };

  useEffect(() => {
    const savedCartId = locationState?.savedCartId;
    if (savedCartId) {
      dispatch(
        getSavedCart(savedCartId, null, (data) => {
          if (data?.items) {
            setSelectedItems(data.items);
          }
          if (data?.member) {
            setSelectedMember(data.member);
          }
        }),
      );
    }
  }, [locationState, dispatch]);

  useEffect(() => {
    if (selectedMember) {
      setErrors((prev) => ({ ...prev, member: null }));
    }
  }, [selectedMember]);

  useEffect(() => {
    setErrors((prev) => ({ ...prev, member: null }));
  }, [cartItems]);

  const openCheckout = () => {
    if (checkIsMemberRequired()) {
      const invalidDiscountMessage = getCheckoutBlockMessage();
      if (invalidDiscountMessage) {
        dispatch(
          showToastAction({
            description: invalidDiscountMessage,
            type: "error",
          }),
        );
        return;
      }
      setShowCheckout(true);
    }
  };

  const closeCheckout = () => {
    setShowCheckout(false);
  };

  function onAddItemIntoCart(product) {
    const index = selectedItems.findIndex((item) => item._id === product._id);
    if (index >= 0) {
      let _selected = [...selectedItems];
      let _item = _selected[index];
      if (_item.quantity < _item.maximumQuantity) {
        _item.quantity = _item.quantity + 1;
      } else {
        return;
      }
      _selected[index] = _item;
      setSelectedItems(_selected);
    } else {
      const { _id, itemCaption, title, type } = product;
      const {
        defaultQuantity,
        minimumQuantity,
        maximumQuantity,
        allowUnlimited,
        memberRequired,
      } = product;
      const {
        price,
        includesTax,
        taxes,
        allowDiscount,
        defaultDiscount: rawDefaultDiscount,
        overrideDiscount,
      } = product;

      // Transform defaultDiscount from API format { amount: { value, unit } }
      // to cart format { amount: number, amountType: "FIXED"/"PERCENTAGE" }
      const defaultDiscount = rawDefaultDiscount
        ? {
            ...rawDefaultDiscount,
            amount:
              rawDefaultDiscount.amount?.value ?? rawDefaultDiscount.amount,
            amountType:
              rawDefaultDiscount.amount?.unit === "PERCENT"
                ? "PERCENTAGE"
                : rawDefaultDiscount.amountType || "FIXED",
            canBeCombined: rawDefaultDiscount.canBeCombined ?? false,
          }
        : null;
      const {
        moreThan1,
        moreThan2,
        moreThan3,
        unitDiscount1,
        unitDiscount2,
        unitDiscount3,
      } = product;
      const taxPercentage = taxes.reduce(
        (sum, item) => sum + item?.taxRatePercentage,
        0,
      );
      let unitPrice = price;
      if (includesTax) {
        unitPrice = unitPrice / (1 + taxPercentage / 100);
      }
      const taxWaived = false;
      const dynamicPricing = false;
      const quantity = defaultQuantity;

      const specialDiscount = null;
      let obj = {
        _id,
        catalogItemId: product.catalogItemId || _id,
        itemCaption,
        title,

        type,

        rewardCatalog: product.rewardCatalog || null,
        isRedeemedByPoints: false,
        rewardCatalogId: null,
        rewardPointsCost: null,

        taxWaived,

        price,
        includesTax,
        unitPrice,
        dynamicPricing,

        promoDiscount: null,
        defaultDiscount: null,
        availableDiscount: defaultDiscount,
        specialDiscount,
        allowDiscount,
        overrideDiscount,

        taxes,
        taxPercentage,

        defaultQuantity,
        minimumQuantity,
        maximumQuantity,
        quantity,
        allowUnlimited,
        memberRequired,

        moreThan1,
        moreThan2,
        moreThan3,
        unitDiscount1,
        unitDiscount2,
        unitDiscount3,
      };
      setSelectedItems((prev) => [...prev, obj]);
    }
  }

  useEffect(() => {
    let discounts = {};

    selectedItems.forEach((item) => {
      let { defaultDiscount } = item;
      if (defaultDiscount) {
        if (discounts[defaultDiscount._id]) {
          discounts[defaultDiscount._id].count =
            discounts[defaultDiscount._id].count + 1;
        } else {
          discounts[defaultDiscount._id] = { ...defaultDiscount, count: 1 };
        }
      }
    });

    // BOGO: Conditional cross-product model
    // Parent items have defaultDiscount.isThisItemBogo = true
    // BOGO items are listed in defaultDiscount.bogoItems (catalog item IDs)
    // Free only applies when BOTH parent AND BOGO item are in cart
    // freeCount = min(parentCount, bogoItemCount)
    let bogoFreeMap = {};
    let bogoParentMap = {}; // { itemIndex: bogoDiscountId } — tracks active BOGO parents

    // 1. Group parent items by discount ID, collect their bogoItem IDs
    //    BOGO activates only when the user explicitly applies the discount:
    //    a) defaultDiscount set with isThisItemBogo (via override discount UI)
    //    b) availableDiscount has isThisItemBogo AND user activated it
    //       (via promo code or defaultDiscount matching the same _id)
    let bogoDiscountGroups = {};
    selectedItems.forEach((item, idx) => {
      if (!item.allowDiscount) return;

      let activeBogo = null;

      if (item.defaultDiscount?.isThisItemBogo) {
        // Case A: BOGO discount directly applied as defaultDiscount with full fields
        activeBogo = item.defaultDiscount;
      } else if (item.availableDiscount?.isThisItemBogo) {
        // Case B: BOGO available on item — check if user activated it
        const availId = String(item.availableDiscount._id);
        const activatedByPromo =
          appliedPromo && String(appliedPromo._id) === availId;
        const activatedByDefault =
          item.defaultDiscount && String(item.defaultDiscount._id) === availId;
        const activatedBySalesCode = appliedSalesCode?.discounts?.some(
          (disc) => String(disc._id) === availId,
        );
        if (activatedByPromo || activatedByDefault || activatedBySalesCode) {
          activeBogo = item.availableDiscount;
        }
      }

      if (activeBogo) {
        const discountId = activeBogo._id;
        bogoParentMap[idx] = String(discountId);
        if (!bogoDiscountGroups[discountId]) {
          bogoDiscountGroups[discountId] = {
            parents: [],
            bogoItemIds: new Set(),
          };
        }
        bogoDiscountGroups[discountId].parents.push({ index: idx, item });
        (activeBogo.bogoItems || []).forEach((id) => {
          const strId = id?._id || id?.toString?.() || id;
          bogoDiscountGroups[discountId].bogoItemIds.add(String(strId));
        });
      }
    });

    // 2. For each discount group, find matching BOGO items in cart
    let consumedBogoIndices = new Set();
    Object.values(bogoDiscountGroups).forEach((group) => {
      const { parents, bogoItemIds } = group;

      // Find cart items whose _id matches bogoItems (and not already consumed)
      let bogoCartEntries = [];
      selectedItems.forEach((item, idx) => {
        if (consumedBogoIndices.has(idx)) return;
        const itemId = String(item._id?._id || item._id);
        if (bogoItemIds.has(itemId)) {
          bogoCartEntries.push({ index: idx, item });
        }
      });

      if (!bogoCartEntries.length) return; // No BOGO items in cart — no free items

      // 3. Calculate freeCount
      const parentCount = parents.reduce((sum, p) => sum + p.item.quantity, 0);
      const bogoItemCount = bogoCartEntries.reduce(
        (sum, b) => sum + b.item.quantity,
        0,
      );
      const freeCount = Math.min(parentCount, bogoItemCount);
      if (freeCount === 0) return;

      // Mark BOGO cart indices as consumed (prevent double-claim across discounts)
      bogoCartEntries.forEach((e) => consumedBogoIndices.add(e.index));

      // 4. Pool only BOGO catalog items — only BOGO items become free, not parents
      let pool = [];
      bogoCartEntries.forEach((entry) => {
        let effectivePrice = entry.item.unitPrice;
        const {
          quantity: qty,
          moreThan1,
          moreThan2,
          moreThan3,
          unitDiscount1,
          unitDiscount2,
          unitDiscount3,
        } = entry.item;
        if (moreThan3 && qty > moreThan3) {
          effectivePrice = Math.max(
            0,
            effectivePrice - getDynamicDiscount(effectivePrice, unitDiscount3),
          );
        } else if (moreThan2 && qty > moreThan2) {
          effectivePrice = Math.max(
            0,
            effectivePrice - getDynamicDiscount(effectivePrice, unitDiscount2),
          );
        } else if (moreThan1 && qty > moreThan1) {
          effectivePrice = Math.max(
            0,
            effectivePrice - getDynamicDiscount(effectivePrice, unitDiscount1),
          );
        }
        for (let i = 0; i < qty; i++) {
          pool.push({ index: entry.index, unitPrice: effectivePrice });
        }
      });

      // 5. Sort descending, cheapest freeCount items become FREE
      pool.sort((a, b) => b.unitPrice - a.unitPrice);
      pool.slice(pool.length - freeCount).forEach((entry) => {
        bogoFreeMap[entry.index] = (bogoFreeMap[entry.index] || 0) + 1;
      });
    });

    // Cart-wide: check if any item has a non-combinable discount (used to block promo)
    const cartHasNonCombinableDiscount = selectedItems.some(
      (si) =>
        (si.defaultDiscount && !si.defaultDiscount.canBeCombined) ||
        (si.specialDiscount && !si.specialDiscount.canBeCombined),
    );

    let _cart = selectedItems.map((item, index) => {
      item = JSON.parse(JSON.stringify(item));
      let { unitPrice } = item;
      let dynamicPricing = "";
      const { quantity, taxPercentage } = item;
      const { allowDiscount, defaultDiscount, specialDiscount } = item;
      let { promoDiscount } = item;
      let salesCodeDiscount = null;
      const {
        moreThan1,
        moreThan2,
        moreThan3,
        unitDiscount1,
        unitDiscount2,
        unitDiscount3,
      } = item;

      //Setting up the dynamic pricing according to the individual item count.

      if (moreThan3 && quantity > moreThan3) {
        unitPrice = Math.max(
          0,
          unitPrice - getDynamicDiscount(unitPrice, unitDiscount3),
        );
        dynamicPricing = `Buy ${moreThan3 + 1}, get ${getDynamicDiscountString(
          unitDiscount3,
        )} off Applied!`;
      } else if (moreThan2 && quantity > moreThan2) {
        unitPrice = Math.max(
          0,
          unitPrice - getDynamicDiscount(unitPrice, unitDiscount2),
        );
        dynamicPricing = `Buy ${moreThan2 + 1}, get ${getDynamicDiscountString(
          unitDiscount2,
        )} off Applied!`;
      } else if (moreThan1 && quantity > moreThan1) {
        unitPrice = Math.max(
          0,
          unitPrice - getDynamicDiscount(unitPrice, unitDiscount1),
        );
        dynamicPricing = `Buy ${moreThan1 + 1}, get ${getDynamicDiscountString(
          unitDiscount1,
        )} off Applied!`;
      }

      if (moreThan1 && quantity < moreThan1 + 1) {
        dynamicPricing = `Buy ${moreThan1 + 1}, get ${getDynamicDiscountString(
          unitDiscount1,
        )} off instantly!`;
      } else if (moreThan2 && quantity < moreThan2 + 1) {
        dynamicPricing = `Buy ${moreThan2 + 1}, get ${getDynamicDiscountString(
          unitDiscount2,
        )} off instantly!`;
      } else if (moreThan3 && quantity < moreThan3 + 1) {
        dynamicPricing = `Buy ${moreThan3 + 1}, get ${getDynamicDiscountString(
          unitDiscount3,
        )} off instantly!`;
      }

      // here We are getting the final net price after dynamic pricing
      let finalUnitPrice = unitPrice;

      // REDEMPTION: If item is redeemed by points, price becomes 0 and skip discounts
      if (item.isRedeemedByPoints) {
        finalUnitPrice = 0;
        unitPrice = 0;
      }

      //if discounts are allowed on item, or item is BOGO free (cross-item benefit)
      if (
        (allowDiscount || bogoFreeMap[index] !== undefined) &&
        !item.isRedeemedByPoints
      ) {
        let billedCount = quantity;

        // ---------------- BOGO LOGIC ----------------
        if (bogoFreeMap[index] !== undefined) {
          const freeCount = bogoFreeMap[index];
          billedCount = quantity - freeCount;

          const totalSavings = freeCount * finalUnitPrice;

          item.bogoDiscount = {
            freeCount,
            billedCount,
            totalSavings,
            originalPrice: finalUnitPrice,
          };
        }

        // ---------------- DEFAULT DISCOUNT ----------------
        if (defaultDiscount?.amountType) {
          let perUnitDiscount = 0;

          if (defaultDiscount.amountType === "FIXED") {
            perUnitDiscount = getAppliedDiscountAmount(
              defaultDiscount,
              finalUnitPrice,
            );
          }

          if (defaultDiscount.amountType === "PERCENTAGE") {
            perUnitDiscount = getAppliedDiscountAmount(
              defaultDiscount,
              finalUnitPrice,
            );
          }

          perUnitDiscount = Math.min(perUnitDiscount, finalUnitPrice);
          defaultDiscount.amountAfterDiscount = perUnitDiscount;

          finalUnitPrice = Math.max(0, finalUnitPrice - perUnitDiscount);
        }

        // ---------------- SPECIAL DISCOUNT ----------------
        if (specialDiscount?.amountType) {
          let perUnitDiscount = 0;

          if (specialDiscount.amountType === "FIXED") {
            perUnitDiscount = getAppliedDiscountAmount(
              specialDiscount,
              finalUnitPrice,
            );
          }

          if (specialDiscount.amountType === "PERCENTAGE") {
            perUnitDiscount = getAppliedDiscountAmount(
              specialDiscount,
              finalUnitPrice,
            );
          }

          perUnitDiscount = Math.min(perUnitDiscount, finalUnitPrice);
          specialDiscount.amountAfterDiscount = perUnitDiscount;

          finalUnitPrice = Math.max(0, finalUnitPrice - perUnitDiscount);
        }

        // ---------------- PROMO DISCOUNT ----------------
        if (appliedPromo) {
          const isSameAsDefault =
            defaultDiscount &&
            String(appliedPromo._id) === String(defaultDiscount._id);

          // const isBogoPromoOnParent =
          //   bogoParentMap[index] !== undefined &&
          //   String(appliedPromo._id) === bogoParentMap[index];

          const itemBlocksPromo =
            defaultDiscount && !defaultDiscount.canBeCombined;

          const promoBlockedByOwnRule =
            !appliedPromo.canBeCombined && (defaultDiscount || specialDiscount);

          const promoServices = appliedPromo.services || [];

          const isItemEligible =
            promoServices.length === 0 ||
            promoServices.some(
              (sId) =>
                String(sId?._id || sId) ===
                String(item.catalogItemId || item._id),
            );

          if (
            isItemEligible &&
            !itemBlocksPromo &&
            !isSameAsDefault &&
            !promoBlockedByOwnRule &&
            !cartHasNonCombinableDiscount
          ) {
            promoDiscount = { ...appliedPromo };

            let perUnitDiscount = 0;

            if (promoDiscount.amountType === "FIXED") {
              perUnitDiscount = getAppliedDiscountAmount(
                promoDiscount,
                finalUnitPrice,
              );
            }

            if (promoDiscount.amountType === "PERCENTAGE") {
              perUnitDiscount = getAppliedDiscountAmount(
                promoDiscount,
                finalUnitPrice,
              );
            }

            promoDiscount.amountAfterDiscount = perUnitDiscount;

            finalUnitPrice = Math.max(0, finalUnitPrice - perUnitDiscount);
          }
        }

        // ---------------- SALES CODE DISCOUNT ----------------
        if (
          appliedSalesCode?.discounts?.length &&
          allowDiscount &&
          !item.isRedeemedByPoints
        ) {
          const itemId = String(item.catalogItemId || item._id);

          // Find the first matching discount from the sales code's discounts
          const matchedDisc = appliedSalesCode.discounts.find((disc) => {
            const svcList = disc.services || [];
            if (svcList.length === 0) return true;
            return svcList.some((sId) => String(sId?._id || sId) === itemId);
          });

          if (matchedDisc) {
            const isSameAsDefault =
              defaultDiscount &&
              String(matchedDisc._id) === String(defaultDiscount._id);
            const isSameAsPromo =
              promoDiscount &&
              String(matchedDisc._id) === String(promoDiscount._id);

            if (!isSameAsDefault && !isSameAsPromo) {
              salesCodeDiscount = {
                _id: matchedDisc._id,
                title: matchedDisc.title,
                discountCode: matchedDisc.discountCode,
                amount: matchedDisc.amount,
                amountType: matchedDisc.amountType,
              };

              let perUnitDiscount = 0;

              if (matchedDisc.amountType === "FIXED") {
                perUnitDiscount = getAppliedDiscountAmount(
                  matchedDisc,
                  finalUnitPrice,
                );
              }

              if (matchedDisc.amountType === "PERCENTAGE") {
                perUnitDiscount = getAppliedDiscountAmount(
                  matchedDisc,
                  finalUnitPrice,
                );
              }

              salesCodeDiscount.amountAfterDiscount = perUnitDiscount;

              finalUnitPrice = Math.max(0, finalUnitPrice - perUnitDiscount);
            }
          }
        }
      }

      // BOGO items: bill only non-free units
      const billedQty = item.bogoDiscount
        ? item.bogoDiscount.billedCount
        : quantity;
      const finalTotal = finalUnitPrice * billedQty;

      const totalTax = calculateTax(finalTotal, taxPercentage);

      return {
        ...item,
        promoDiscount,
        salesCodeDiscount,
        unitPrice,
        finalUnitPrice,
        finalTotal,
        totalTax,
        dynamicPricing,
      };
    });

    setCartItems(_cart);
  }, [selectedItems, appliedPromo, appliedSalesCode]);
  //Count final detailed price and calculations
  useEffect(() => {
    let unitTotal = 0;
    let tax = 0;
    let discount = 0;
    let specialDiscount = 0;
    let promoDiscount = 0;
    let salesCodeDiscount = 0;
    let bogoDiscount = 0;
    let waivedTaxAmount = 0;
    let redemptionSavings = 0;
    let total = 0;
    let hasInvalidDiscount = false;

    cartItems.forEach((item) => {
      unitTotal += item?.unitPrice * item?.quantity;

      if (item?.isRedeemedByPoints && item?.price) {
        redemptionSavings += item.price * item.quantity;
      }

      if (item?.bogoDiscount) {
        bogoDiscount += item.bogoDiscount.totalSavings;
      }

      const multiplier = item.bogoDiscount
        ? item.bogoDiscount.billedCount
        : item.quantity;

      if (item?.defaultDiscount?.amountAfterDiscount) {
        discount += item.defaultDiscount.amountAfterDiscount * multiplier;
      }
      if (getDiscountValidationError(item?.defaultDiscount)) {
        hasInvalidDiscount = true;
      }

      if (item?.specialDiscount?.amountAfterDiscount) {
        specialDiscount +=
          item.specialDiscount.amountAfterDiscount * multiplier;
      }
      if (getDiscountValidationError(item?.specialDiscount)) {
        hasInvalidDiscount = true;
      }

      if (item?.promoDiscount?.amountAfterDiscount) {
        promoDiscount += item.promoDiscount.amountAfterDiscount * multiplier;
      }
      if (getDiscountValidationError(item?.promoDiscount)) {
        hasInvalidDiscount = true;
      }

      if (item?.salesCodeDiscount?.amountAfterDiscount) {
        salesCodeDiscount +=
          item.salesCodeDiscount.amountAfterDiscount * multiplier;
      }
      if (getDiscountValidationError(item?.salesCodeDiscount)) {
        hasInvalidDiscount = true;
      }

      if (item?.taxWaived) {
        waivedTaxAmount += item?.totalTax;
      }

      tax += item?.totalTax;
      total += item?.finalTotal;
    });

    const gradTotal = roundOfNumber(
      total + tax - waivedTaxAmount + additionalPrePay,
    );

    setCartDetails({
      unitTotal,
      total,
      tax,
      discount,
      specialDiscount,
      promoDiscount,
      salesCodeDiscount,
      bogoDiscount,
      waivedTaxAmount,
      redemptionSavings,
      gradTotal,
      hasInvalidDiscount,
    });
  }, [cartItems, additionalPrePay]);

  function getDynamicDiscountString(item) {
    let { unit, value } = item;
    if (unit === "PERCENT") {
      return value + "%";
    } else {
      return "$" + value;
    }
  }

  function getDynamicDiscount(price, item) {
    let { unit, value } = item;
    if (unit === "PERCENT") {
      return (price * value) / 100;
    } else {
      return value;
    }
  }

  //Cart Item Functions
  const onCartItemQtyChange = (index, qty) => {
    setSelectedItems((prev) => {
      let _prev = [...prev];
      if (_prev[index].isRedeemedByPoints) return _prev;
      const required = _prev[index]?.requiredQuantity;
      if (typeof required === "number" && qty < required) {
        dispatch(
          showToastAction({
            title: "Quantity below required",
            description: `${_prev[index].title || "This service"} requires a quantity of ${required} to cover all pending sessions. Reducing it may leave sessions unpaid.`,
            type: "warn",
          }),
        );
      }
      _prev[index].quantity = qty;
      return _prev;
    });
  };

  const setCartItemRequiredQuantity = (index, qty) => {
    setSelectedItems((prev) => {
      const _prev = [...prev];
      if (_prev[index]) _prev[index].requiredQuantity = qty;
      return _prev;
    });
  };

  const onDeleteCartItem = (index) => {
    setSelectedItems((prev) => {
      let _arr = [...prev];
      _arr.splice(index, 1);
      return _arr;
    });
  };

  const onWaiveTax = (index, condition, reasonCode) => {
    setSelectedItems((prev) => {
      let _arr = [...prev];
      let _obj = _arr[index];
      _obj.taxWaived = condition;
      _obj.waiveTaxReason = condition ? reasonCode : null;
      _arr[index] = _obj;
      return _arr;
    });
  };

  const onRedeemItem = (index) => {
    const item = selectedItems[index];
    if (!item) return;

    if (!selectedMember) {
      dispatch(
        showToastAction({
          description: "Please select a member to redeem.",
          type: "warning",
        }),
      );
      return;
    }

    // Toggle off if already redeemed
    if (item.isRedeemedByPoints) {
      setSelectedItems((prev) => {
        let _arr = [...prev];
        _arr[index] = {
          ..._arr[index],
          isRedeemedByPoints: false,
          rewardCatalogId: null,
          rewardPointsCost: null,
        };
        return _arr;
      });
      return;
    }

    const catalogItemId = item.catalogItemId || item._id;

    dispatch(
      validateRedemption(catalogItemId, selectedMember, null, (data) => {
        setSelectedItems((prev) => {
          let _arr = [...prev];
          _arr[index] = {
            ..._arr[index],
            isRedeemedByPoints: true,
            rewardCatalogId: data.rewardCatalogId,
            rewardPointsCost: data.pointsCost,
            quantity: 1,
            defaultDiscount: null,
            specialDiscount: null,
            taxWaived: false,
            waiveTaxReason: null,
          };
          return _arr;
        });
      }),
    );
  };

  // Clear redemptions when member changes
  useEffect(() => {
    if (!selectedMember) {
      setSelectedItems((prev) => {
        const hasRedeemed = prev.some((item) => item.isRedeemedByPoints);
        if (!hasRedeemed) return prev;
        return prev.map((item) =>
          item.isRedeemedByPoints
            ? {
                ...item,
                isRedeemedByPoints: false,
                rewardCatalogId: null,
                rewardPointsCost: null,
              }
            : item,
        );
      });
    }
  }, [selectedMember]);

  function checkIsMemberRequired() {
    //logic to check if member is required for transaction
    let isServiceItemInCart = cartItems.some((item) => item.type === "SERVICE");
    if (isServiceItemInCart && !selectedMember) {
      setErrors(() => ({
        member: "Member selection is required for Services.",
      }));
      return false;
    }

    let isPrePayItemInCart = cartItems.some((item) => item.type === "PRE_PAY");
    if (isPrePayItemInCart && !selectedMember) {
      setErrors(() => ({
        member: "Member selection is required for Pre Pay items.",
      }));
      return false;
    }

    let isMemberRequiredItemInCart = cartItems.some(
      (item) => item.memberRequired,
    );
    if (isMemberRequiredItemInCart && !selectedMember) {
      setErrors(() => ({
        member: "Member selection is required for some items in the cart.",
      }));
      return false;
    }
    return true;
  }

  const [saleLoading, setSaleLoading] = useState(null);

  const onPostSale = (paymentTypes, setLoading, onSuccess) => {
    if (!selectedDrawer) {
      dispatch(
        showToastAction({
          description: "Please select a drawer to proceed.",
          type: "error",
        }),
      );
      setErrors((prev) => ({
        ...prev,
        drawer: "Please select a drawer to proceed.",
      }));
      if (setLoading) setLoading(false);
      return;
    }
    if (checkIsMemberRequired()) {
      if (!cartItems.length) {
        if (setLoading) setLoading(false);
        return;
      }

      const invalidDiscountMessage = getCheckoutBlockMessage();
      if (invalidDiscountMessage) {
        dispatch(
          showToastAction({
            description: invalidDiscountMessage,
            type: "error",
          }),
        );
        if (setLoading) setLoading(false);
        return;
      }

      if (setLoading) setLoading(true);

      let payload = {
        cashRegister: selectedDrawer,
        cartItems,
        cartDetails,
        amount: cartDetails.gradTotal,
        member: selectedMember,
        paymentTypes,
        additionalPrePay,
      };

      dispatch(
        createSale(setSaleLoading, payload, (e) => {
          console.log("Sale Created", e);
          setAppliedPromo(null);
          setAppliedSalesCode(null);
          setSelectedItems([]);
          setSelectedMember(null);
          setAdditionalPrePay(null);
          setShowCheckout(false);
          setSaleLoading(false);
          if (setLoading) setLoading(false);
          if (onSuccess) onSuccess(e);
        }),
      );
    } else {
      if (setLoading) setLoading(false);
    }
  };

  const onQuickCashSale = () => {
    onPostSale([{ type: "CASH", amount: cartDetails.gradTotal }]);
  };

  function onSelectProduct(product) {
    if (product?.variations?.length) {
      setVariationProduct(product);
    } else {
      onAddItemIntoCart(product);
    }
  }

  const onCloseVariation = () => {
    setVariationProduct(null);
  };

  const onApplyPromoDiscount = (promoData) => {
    const existingNonCombinable = findNonCombinableInCart(selectedItems, null);
    if (existingNonCombinable) {
      dispatch(
        showToastAction({
          description: `"${existingNonCombinable.title || existingNonCombinable.discountCode}" in the cart cannot be combined with other discounts.`,
          type: "error",
        }),
      );
      return;
    }

    // Cart-wide: Block if this promo is non-combinable and any discount exists in the cart
    if (!promoData.canBeCombined && hasAnyDiscountInCart(selectedItems, null)) {
      dispatch(
        showToastAction({
          description: `"${promoData.title || promoData.discountCode}" cannot be combined with other discounts.`,
          type: "error",
        }),
      );
      return;
    }

    const discountError = getDiscountValidationError(promoData);
    if (discountError) {
      dispatch(
        showToastAction({
          description: `"${promoData.title || promoData.discountCode}" ${discountError}`,
          type: "error",
        }),
      );
      return;
    }

    setAppliedPromo(promoData);
  };

  const onApplySalesCode = (salesCodeData) => {
    const invalidSalesCodeDiscount = salesCodeData?.discounts?.find(
      (discount) => getDiscountValidationError(discount),
    );
    if (invalidSalesCodeDiscount) {
      dispatch(
        showToastAction({
          description: `Sales code "${salesCodeData.salesCode || "selected sales code"}" includes an invalid discount value.`,
          type: "error",
        }),
      );
      return;
    }
    setAppliedSalesCode(salesCodeData);
  };

  const onRemoveSalesCode = () => {
    setAppliedSalesCode(null);
  };

  const value = {
    errors,

    tags,
    setTags,
    filterSets,
    setFilterSets,
    selectedCategory,
    setSelectedCategory,

    selectedSubCategory,
    setSelectedSubCategory,

    selectedSubCategoryGroup,
    setSelectedSubCategoryGroup,

    selectedMember,
    setSelectedMember,
    cartItems,

    onAddItemIntoCart,

    onSelectProduct,
    variationProduct,
    onCloseVariation,

    onCartItemQtyChange,
    onDeleteCartItem,
    onWaiveTax,
    onRedeemItem,

    cartDetails,
    onPostSale,
    saleLoading,

    onQuickCashSale,

    showCheckout,
    openCheckout,
    closeCheckout,

    selectedItems,
    setCartItemRequiredQuantity,
    saveCartPopup,
    openSaveCart,
    closeSaveCart,
    onCartSaved,

    discountPopup,
    setDiscountPopup,
    onOverrideDiscount,
    onApplyDiscount,
    specialDiscountPopup,
    setSpecialDiscountPopup,
    onAddSpecialDiscount,
    onApplySpecialDiscount,
    onRemoveSpecialDiscount,

    appliedPromo,
    setAppliedPromo,
    onApplyPromoDiscount,

    appliedSalesCode,
    onApplySalesCode,
    onRemoveSalesCode,

    additionalPrePay,
    setAdditionalPrePay,
  };

  return <PosContext.Provider value={value}>{children}</PosContext.Provider>;
};

export const usePos = () => useContext(PosContext);
