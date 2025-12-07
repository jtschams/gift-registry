import React from 'react';
import { useState, createContext, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { MY_WISHLIST, USER_WISHLIST } from '../utils/queries';
import Answer from '../components/Answer';
import Nickname from '../components/Nickname';
import { ranks } from '../utils/enums';

const WishlistContext = createContext();
export const useWishlistContext = () => useContext(WishlistContext);

export default function Wishlist() {
  const [ wishlistState, setWishlistState ] = useState('');
  const { userId } = useParams();
  const wishlistQuery = userId ? USER_WISHLIST : MY_WISHLIST;
  const queryName = userId ? "userWishlist" : "myWishlist";
  
  const { loading, data } = useQuery(wishlistQuery, { variables: { userId } });
  let sortedAnswers = [ [], [], [], [], [] ];
  let user = null;
  let relations = null;
  if (!loading) {
    for (const answer of data[queryName]) {
      sortedAnswers[answer.rank].push(answer);
    }
    if (user = data.relatedUsers?.find((member) => member.user._id === userId)) {
      const realName = [{ __typename: 'Relation', familyName: 'default', nickname: user.user.name }];
      relations = realName.concat(user.relations);
    }
  };

  return (
    <WishlistContext.Provider value={[ wishlistState, setWishlistState ]}>
      {!userId || !user ? <h2>My Wishlist</h2> : loading ? <h1>Loading...</h1> : <>
        <h1 id="answers-user">{user.user.name}</h1>
        {user.relations.map((relation) => <Nickname key={user.user._id + relation.familyName} member={relation} small={true} />)}
        <h2>Wishlist</h2>
      </>}
      {loading ? <h3 className="loading">Loading...</h3> : (sortedAnswers.map((rank, index) => (
        rank.length === 0 ? null :
        <div key={index}>
          <h3>{ranks[index][0]}</h3>
          <section className="card-container">
            {rank.map((answer) => (
              <Answer key={answer._id} answer={answer} relations={relations}/>
            ))}
          </section>
        </div>
      )))}
    </WishlistContext.Provider>
  )
}