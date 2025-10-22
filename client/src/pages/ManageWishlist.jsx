import React from 'react';
import { useState, createContext, useContext } from 'react';
import { useQuery, useMutation } from '@apollo/client';

import { MY_WISHLIST } from '../utils/queries';
import { MAKE_WISH} from '../utils/mutations';
import { ranks } from '../utils/enums';
import WishlistRow from '../components/WishlistRow';

const WishlistContext = createContext();
export const useWishlistContext = () => useContext(WishlistContext);
let sortedAnswers;

export default function Wishlist() {
  const [ wishlistState, setWishlistState ] = useState('');
  const [ answerState, setAnswerState ] = useState({
    rank: 0,
    answerText: "",
    answerLink: "",
    amount: 1,
  });

  const [makeWish] = useMutation(MAKE_WISH, {
    refetchQueries: [
      MY_WISHLIST
    ]
  });
  
  const handleMakeWish = async (event) => {
    event.preventDefault();
    const {data} = await makeWish({
      variables: answerState
    });
    //  TODO: change alert to dialog
    alert("Answer added to your account.");

    let newWishlist = [...sortedAnswers, answerState];

    sortedAnswers = newWishlist.toSorted((a, b) => a.rank - b.rank);

    setAnswerState({rank: 0, answerText: '', answerLink: '', amount: 1 });
  }

  const handleWishState = (event) => {
    let { name, value } = event.target;
    value = name === "amount" || name === "rank" ? parseInt(value) : value;
    setAnswerState({
      ...answerState,
      [name]: value
    });
  };

  const { loading, data } = useQuery(MY_WISHLIST);
  console.log(loading)
  if (!loading) {
    const sortedData = [...data.myWishlist.toSorted((a, b) => a.rank - b.rank)];
    sortedAnswers = sortedData;
  };

  return (
    <WishlistContext.Provider value={[ wishlistState, setWishlistState ]}>
      <h2>Manage Wishlist</h2>
      <article>
        <p className="wishlist-directions">Let your friends and family know what you want.  The more specific, the easier it is for the gift giver.  If appropriate, add a link to Amazon or another website.</p>
        <form className="wish-form" onSubmit={handleMakeWish}>
          <div className="form-wish-details">
            <div className="form-group">
              <label htmlFor="answer-text">Wishlist Item:</label>
              <input
                id="answer-text"
                className="answer-input"
                placeholder="Answer"
                name="answerText"
                type="text"
                value={answerState.answerText}
                onChange={handleWishState}
              />
            </div>
            <div className="form-group">
              <label htmlFor="answer-link">Link to your Wishlist Item (Optional):</label>
              <input
                id="answer-link"
                className="answer-input"
                placeholder="Answer Link"
                name="answerLink"
                type="text"
                value={answerState.answerLink}
                onChange={handleWishState}
              />
            </div>
          </div>
          <div className="form-wish-numbers">
            <div className="form-group">
              <label htmlFor="answer-rank">How much do you want this item?</label>
              <select
                id="answer-rank"
                className="answer-input"
                name="rank"
                value={answerState.rank}
                onChange={handleWishState}
              >
                {ranks.map(([rank], index) => <option value={index}>{rank}</option> )}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="answer-amount">How may of this do you want?</label>
              <select
                id="answer-amount"
                className="answer-input"
                name="amount"
                value={answerState.amount}
                onChange={handleWishState}
              >
                <option value={1}>Only One</option>
                <option value={2}>More than one</option>
              </select>
            </div>
          </div>
          <button type="submit" className="wide-button">Submit Answer</button>
        </form>
      </article>
      {loading ? <h3 className="loading">Loading...</h3> : (sortedAnswers.map((answer) => (
        <WishlistRow key={answer._id} answer={answer}/>
      )))}
    </WishlistContext.Provider>
  )
}