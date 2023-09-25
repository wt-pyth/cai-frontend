import dynamic from 'next/dynamic';
import React, { useContext } from 'react';
import { userContext } from 'contexts/Auth';

const ProductFruit = () => {
  const ProductFruits = dynamic(
    () => import('react-product-fruits'),
    { ssr: false }
  );

  const { authToken } = useContext(userContext);

  return (
    <>
      <ProductFruits projectCode="mVxZL6oqA4zQNWnq" language="en" username={authToken || 'mVxZL6oqA4zQNWnq'} />
    </>
  );
};

export default ProductFruit;
