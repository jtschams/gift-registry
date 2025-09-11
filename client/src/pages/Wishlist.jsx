import React from 'react';
import { useState, createContext, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { MY_WISHLIST, USER_WISHLIST } from '../utils/queries';
import Wish from '../components/Wish';

const WishlistContext = createContext();
export const useWishlistContext = () => useContext(WishlistContext);

export default function Wishlist() {
  const [ wishlistState, setWishlistState ] = useState('');
  const { userId } = useParams();
  const wishlistQuery = userId ? USER_WISHLIST : MY_WISHLIST;
  const queryName = userId ? "userWishlist" : "myWishlist";
  
  const { loading, data } = useQuery(wishlistQuery, { variables: { userId } });
  let sortedAnswers = [{ rank: 1, answers: [] },{ rank: 2, answers: [] },{ rank: 3, answers: [] },{ rank: 4, answers: [] },{ rank: 5, answers: [] }];
  let user = null;
  let relations = null;
  if (!loading) {
    for (const answer of data[queryName]) {
      sortedAnswers[answer.rank - 1].answers.push(answer);
    }
    if (data.relatedUsers) {
      user = data.relatedUsers.find((member) => member.user._id === userId);
      const realName = [{ __typename: 'Relation', familyName: 'default', nickname: user.user.name }];
      relations = realName.concat(user.relations);
    }
    sortedAnswers = sortedAnswers.filter((rank) => rank.answers.length > 0)
  };

  return (
    <WishlistContext.Provider value={[ wishlistState, setWishlistState ]}>
      {!userId ? <h2>My Wishlist</h2> : loading ? <h1>Loading...</h1> : <>
        <h1 id="answers-user">{user.user.name}</h1>
        {user.relations.map((relation) => <div key={relation.familyName} className="nickname">
          <small>{relation.nickname}</small><small>({relation.familyName})</small>
        </div>)}
        <h2>Wishlist</h2>
      </>}
      {loading ? <h3 className="loading">Loading...</h3> : (sortedAnswers.map((rank) => (
        <div key={rank.rank}>
          <h3>Rank {rank.rank}</h3>
          <section className="card-container">
            {rank.answers.map((answer) => (
              <Wish key={answer._id} answer={answer} relations={relations}/>
            ))}
          </section>
        </div>
      )))}
    </WishlistContext.Provider>
  )
}