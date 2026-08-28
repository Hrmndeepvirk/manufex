import React, { useEffect, useState } from "react";
import ListPageLayout from "@shared/layout/ListPageLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getSavedCarts, deleteSavedCart } from "../../../store/pointOfSale/savedCartActions";
import { customConfirmDialog } from "@shared/overlays/CustomConfirmDialog";

export default function SavedCarts() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const savedCarts = useSelector((state) => state.pos.savedCarts);

  const fetchSavedCarts = () => {
    dispatch(getSavedCarts(setLoading));
  };

  useEffect(() => {
    fetchSavedCarts();
  }, [dispatch]);

  const columns = [
    { field: "name", header: "Cart Name" },
    { field: "noOfItems", header: "No. of Items" },
    { field: "employee", header: "Created By" },
    { field: "member", header: "Customer" },
    { field: "amount", header: "Price", isCurrency: true },
    {
      field: "actions",
      header: "Actions",
      body: (rowData) => (
        <div className="flex gap-2">
          <span
            className="p-1 cursor-pointer"
            title="Go to Cart"
            onClick={() =>
              navigate("/point-of-sale", {
                state: { savedCartId: rowData?._id },
              })
            }
          >
            <i className="pi pi-shopping-cart my-auto" />
          </span>
          <span
            className="p-1 cursor-pointer"
            title="Delete"
            onClick={() => handleDelete(rowData?._id)}
          >
            <i className="pi pi-trash my-auto" />
          </span>
        </div>
      ),
    },
  ];

  const handleDelete = (id) => {
    customConfirmDialog({
      message: "Are you sure you want to delete this saved cart?",
      accept: () => {
        dispatch(
          deleteSavedCart(id, null, () => {
            fetchSavedCarts();
          })
        );
      },
    });
  };

  return (
    <ListPageLayout
      title="Saved Carts"
      columns={columns}
      tableData={savedCarts}
      loading={loading}
    />
  );
}
