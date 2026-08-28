import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllRegisterStatus } from '../../../store/pointOfSale/pointOfSaleActions';
import CustomTable from "../../../shared/table/CustomTable";
import { getDateTime } from '../../../utils/dateTime';

export default function Drawer() {
  const dispatch = useDispatch();
  const { registerStatusList } = useSelector((state) => state.pos);

  useEffect(() => {
    dispatch(getAllRegisterStatus());
  }, [dispatch]);

  const columns = [
    
    { header: 'Register', field: 'title' },
    { header: 'Station', field: 'openedFrom' },
    {
      header: 'Opened At',
      body: (e) => getDateTime(e?.openedAt),
    },
    // { header: 'Opened By', field: 'openedBy' },
    {
      header: 'Status',
      body: (e) => (
        <span className={e?.status === 'OPEN' ? 'text-green-600' : 'text-red-600'}>
          {e?.status || '-'}
        </span>
      ),
    },
    { header: 'Closed By', field: 'closedBy' },
    {
      header: 'Closed At',
      body: (e) => (e?.status === 'CLOSE' ? getDateTime(e?.closedAt) : '-'),
    },
    {
      header: 'Starting Amount',
      body: (e) => (e?.cashAtStart != null ? `$${e.cashAtStart.toFixed(2)}` : '-'),
    },
    {
      header: 'Ending Amount',
      body: (e) => (e?.status === 'CLOSE' && e?.cashAtEnd != null ? `$${e.cashAtEnd.toFixed(2)}` : '-'),
    },
  ];

  return (
    <div className='p-2'>
      <CustomTable data={registerStatusList} columns={columns} />
    </div>
  );
}