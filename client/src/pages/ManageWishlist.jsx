import React from 'react';
import { useState, createContext, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { MY_WISHLIST } from '../utils/queries';
import { MAKE_WISH} from '../utils/mutations';
import WishlistRow from '../components/WishlistRow';

const WishlistContext = createContext();
export const useWishlistContext = () => useContext(WishlistContext);

export default function Wishlist() {
  const [ answerState, setAnswerState ] = useState('');
  const { userId } = useParams();
  
  const { loading, data } = useQuery(MY_WISHLIST, { variables: { userId } });
  let sortedAnswers = [];

  if (!loading) {
    sortedAnswers = data.myWishlist.toSorted((a, b) => a - b);
  };

  return (
    <WishlistContext.Provider value={[ answerState, setAnswerState ]}>
      <h2>My Wishlist</h2>
      <article>
        <p className="wishlist-directions">Let your friends and family know what you want.  The more specific, the easier it is for the gift giver.  If appropriate, add a link to Amazon or another website.</p>
        {/* // TODO: Add Wish Form */}
      </article>
      {loading ? <h3 className="loading">Loading...</h3> : (sortedAnswers.map((answer) => (
        <WishlistRow key={answer._id} answer={answer}/>
      )))}
    </WishlistContext.Provider>
  )
}