import React, { useEffect, useState, useRef } from "react";
import CustomCard from "../../../shared/cards/CustomCard";
import CustomAutoComplete from "../../../shared/inputs/CustomAutoComplete";
import { useDispatch, useSelector } from "react-redux";
import PrimaryButton from "../../../shared/buttons/PrimaryButton";
import { usePos } from "../PosContext";
import { Menu } from "primereact/menu";
import { useNavigate } from "react-router-dom";

import Lottie from "lottie-react";
import NoTableData from "@assets/lotties/EmptyCart.json";
import CartItem from "./CartItem";
import CartDetails from "./CartDetails";
import DrawerSelector from "../DrawerSelector/DrawerSelector";
import OpenRegisterDialog from "../OpenRegister/OpenRegister";
import CloseRegisterDialog from "../CloseRegister/CloseRegister";
import SaveCartDialog from "./SaveCartDialog";
import SelectDiscountDialog from "./SelectDiscountDialog";
import SpecialDiscountDialog from "./SpecialDiscountDialog";
import CardFileDialog from "./CardFileDialog";
import { getMembersList } from "../../../store/pointOfSale/pointOfSaleActions";
import { getPaymentMethods } from "../../../store/member/paymentMethodAction";
import AddPaymentMethod from "../../Members/MemberForm/PaymentMethod/AddPaymentMethod";
import { useLocation } from "react-router-dom";
import { showToastAction } from "../../../store/common/commonActions";
import BalanceHistory from "./BalanceHistory";

function Cart() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const menu = useRef(null);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const membersList = useSelector((state) => state.pos.membersList);
  const selectedDrawer = useSelector((state) => state.pos.selectedDrawer);

  const {
    selectedMember,
    setSelectedMember,
    cartItems,
    errors,
    onQuickCashSale,
    onPostSale,
    saleLoading,
    selectedItems,
    cartDetails,
    saveCartPopup,
    closeSaveCart,
    onCartSaved,
    discountPopup,
    setDiscountPopup,
    onApplyDiscount,
    specialDiscountPopup,
    setSpecialDiscountPopup,
    onApplySpecialDiscount,
  } = usePos();

  const [openDrawer, setOpenDrawer] = useState(false);
  const [closeDrawer, setCloseDrawer] = useState(false);
  const [cardFileDialog, setCardFileDialog] = useState(false);
  const [addCardDialog, setAddCardDialog] = useState(false);
  const [cardFileLoading, setCardFileLoading] = useState(false);
  const handleQuickCash = () => {
    if (!selectedDrawer) {
      dispatch(showToastAction({
        description: 'Please select a drawer to proceed with checkout.',
        type: 'error'
      }));
      return;
    }
    onQuickCashSale();
  };

  const handleCardFile = () => {
    if (!selectedDrawer) {
      dispatch(showToastAction({ description: "Please select a drawer to proceed.", type: "error" }));
      return;
    }
    if (!selectedMember) {
      dispatch(showToastAction({ description: "Please select a member to use Card File.", type: "warning" }));
      return;
    }
    if (!cartItems.length) {
      dispatch(showToastAction({ description: "Your cart is empty.", type: "warning" }));
      return;
    }
    const memberDetail = membersList?.find((m) => m._id === selectedMember);
    if (!memberDetail?.customerProfileId) {
      setAddCardDialog(true);
      return;
    }

    dispatch(
      getPaymentMethods(selectedMember, setCardFileLoading, (methods) => {
        const defaultCard = methods.find(
          (method) =>
            method.customerPaymentProfileId ===
            memberDetail.defaultPaymentMethodId,
        );

        if (defaultCard) {
          handleCardFileCheckout(defaultCard.customerPaymentProfileId);
          return;
        }

        if (methods.length === 1) {
          handleCardFileCheckout(methods[0].customerPaymentProfileId);
          return;
        }

        if (methods.length === 0) {
          setAddCardDialog(true);
          return;
        }

        setCardFileDialog(true);
      }),
    );
  };

  const handleCardFileCheckout = (customerPaymentProfileId) => {
    onPostSale(
      [{ type: "CARD_FILE", amount: cartDetails.gradTotal, customerPaymentProfileId }],
      setCardFileLoading,
      () => {
        setCardFileDialog(false);
        setAddCardDialog(false);
      }
    );
  };

  useEffect(() => {
    if (state?.member) {
      setSelectedMember(state.member);
    }
  }, [state, setSelectedMember]);

  useEffect(() => {
    dispatch(getMembersList(setLoading));
  }, [dispatch]);

  const menuItems = [
    { label: 'Receipts', command: () => navigate('/point-of-sale/receipts') },
    { label: 'Drawer Summary', command: () => navigate('/point-of-sale/drawer') },
    { label: 'Open Register', command: () => setOpenDrawer(true) },
    { label: 'Close Register', command: () => setCloseDrawer(true) },
    { label: 'Saved Carts', command: () => navigate('/more/pos/saved-carts') },
  ];

  const handleNoSale = () => {
    if (!selectedDrawer) {
      dispatch(
        showToastAction({
          description: "Please select a drawer to proceed further.",
          type: "error",
        }),
      );
      return;
    }
    // Handle no sale logic here
  };

  const headers = (
    <div className="flex align-items-center gap-2">
      <DrawerSelector />
      <span
        className="cursor-pointer text-sm hover:underline"
        onClick={(event) => menu.current.toggle(event)}
      >
        More Options
      </span>
    </div>
  );

  return (
    <div className="h-full w-full gap-2 flex flex-column overflow-hidden">
      <div className="shrink-0">
        <CustomAutoComplete
          name="member"
          value={selectedMember}
          onChange={(e) => setSelectedMember(e.value)}
          hideLabel
          options={membersList}
          placeholder="Search Name, Barcode or Phone #"
          searchFields={[
            "title",
            "barCode",
            "mobilePhone",
            "primaryPhone",
            "workPhone",
            "email",
          ]}
          errorMessage={errors?.member}
          dropdown
          col={12}
        />
      </div>
      <div className="shrink-0">
        <BalanceHistory memberId={selectedMember} />
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <CustomCard
          title="Cart"
          height="100%"
          contentClassName="h-full overflow-hidden"
          headers={headers}
        >
          <div className="c-col-12 h-full min-h-0 flex flex-column overflow-hidden justify-content-between">
            <div className="flex-1 min-h-0 overflow-auto pr-2">
              {cartItems.length === 0 && (
                <div className="mx-auto" style={{ width: "70%" }}>
                  <Lottie animationData={NoTableData} />
                </div>
              )}
              {cartItems.map((item, i) => (
                <CartItem key={item.id} item={item} index={i} />
              ))}
            </div>
            <div className="shrink-0">
              <CartDetails />
            </div>
          </div>
        </CustomCard>
      </div>

      <div className="flex justify-content-center gap-2 shrink-0">
        <PrimaryButton
          className="w-full"
          label="No Sale"
          outlined
          onClick={handleNoSale}
        />
        <PrimaryButton
          className="w-full"
          label="Quick Cash"
          loading={saleLoading}
          onClick={handleQuickCash}
        />
        <PrimaryButton className="w-full" label="Pre Pay" />
        <PrimaryButton                                          
          className="w-full"
          label="Card File"
          loading={cardFileLoading}
          onClick={handleCardFile}
        />
        
      </div>

      <OpenRegisterDialog visible={openDrawer} setVisible={setOpenDrawer} />
      <CloseRegisterDialog visible={closeDrawer} setVisible={setCloseDrawer} />
      <Menu model={menuItems} popup ref={menu} />
      <SaveCartDialog
        visible={saveCartPopup}
        onHide={closeSaveCart}
        selectedMember={selectedMember}
        selectedItems={selectedItems}
        cartDetails={cartDetails}
        onCartSaved={onCartSaved}
      />
      <SelectDiscountDialog
        visible={discountPopup}
        setVisible={setDiscountPopup}
        onApply={onApplyDiscount}
      />
      <SpecialDiscountDialog
        visible={specialDiscountPopup}
        setVisible={setSpecialDiscountPopup}
        onApply={onApplySpecialDiscount}
      />
      <CardFileDialog
        visible={cardFileDialog}
        onHide={() => setCardFileDialog(false)}
        memberId={selectedMember}
        onConfirm={handleCardFileCheckout}
      />
      <AddPaymentMethod
        visible={addCardDialog}
        onHide={() => setAddCardDialog(false)}
        memberId={selectedMember}
        showAgreements={false}
        title="Add Card On File"
        onSuccess={() => {
          dispatch(
            getPaymentMethods(selectedMember, setCardFileLoading, (methods) => {
              const defaultCard = methods.find(
                (method) =>
                  method.customerPaymentProfileId ===
                  membersList?.find((m) => m._id === selectedMember)
                    ?.defaultPaymentMethodId,
              );

              const selectedCard = defaultCard || methods[0];
              setAddCardDialog(false);

              if (selectedCard) {
                handleCardFileCheckout(selectedCard.customerPaymentProfileId);
              } else {
                dispatch(
                  showToastAction({
                    description:
                      "Card was added, but we could not find a saved card to charge.",
                    type: "warning",
                  }),
                );
              }
            }),
          );
        }}
      />
    </div>
  );
}
export default React.memo(Cart);
