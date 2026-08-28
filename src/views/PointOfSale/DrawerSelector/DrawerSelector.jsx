import React, { useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedDrawer } from '../../../store/pointOfSale/pointOfSaleSlice';
import { getCashRegisters } from '../../../store/pointOfSale/pointOfSaleActions';

export default function DrawerSelector() {
    const dispatch = useDispatch();
    const { selectedDrawer, cashRegisters } = useSelector((state) => state.pos);

    useEffect(() => {
        dispatch(getCashRegisters());
    }, [dispatch]);

    const registersDropdown = useMemo(
        () => cashRegisters?.filter((item) => item?.registerStatus === 'OPEN') || [],
        [cashRegisters]
    );

    const handleChange = (e) => {
        const value = e.target.value;
        dispatch(setSelectedDrawer(value));
        localStorage.setItem('drawer', value);
    };

    useEffect(() => {
        if (registersDropdown.length) {
            let _drawer = localStorage.getItem('drawer');
            if (_drawer) {
                if (registersDropdown.find((item) => item._id === _drawer)) {
                    dispatch(setSelectedDrawer(_drawer));
                } else {
                    dispatch(setSelectedDrawer(''));
                }
            } else {
                dispatch(setSelectedDrawer(''));
            }
        } else {
            dispatch(setSelectedDrawer(''));
        }
    }, [registersDropdown, dispatch]);

    return (
        <select
            className="drawer-select"
            onChange={handleChange}
            value={selectedDrawer}
            style={{ width: "170px" }}
        >
            <option value="">Select Drawer</option>
            {registersDropdown?.map((item) => (
                <option key={item?._id} value={item?._id}>
                    {item?.title}
                </option>
            ))}
        </select>
    );
}