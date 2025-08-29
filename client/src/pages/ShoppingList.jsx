import React from 'react';
import { useQuery } from '@apollo/client';

import Claim from '../components/Claim';
import { MY_CLAIMS } from '../utils/queries';

export default function ShoppingList() {
  const { loading, data } = useQuery(MY_CLAIMS);
  const claims = data?.myClaims

  return (<>
    <h2>Gifts I Plan to Give</h2>
    <section className="card-container">
      {loading ? <h1>Loading...</h1> : claims.map((claim) => (
        <Claim key={claim.answer._id} claim={claim} />
      ))}
    </section>
  </>)
}