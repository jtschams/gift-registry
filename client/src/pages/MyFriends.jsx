import React from 'react';
import { useQuery } from '@apollo/client';

import RelatedUser from '../components/RelatedUser';
import { RELATED_USERS } from '../utils/queries';

export default function MyFriends() {

  const { loading, data } = useQuery(RELATED_USERS);
  const friends = []
  if (data?.relatedUsers) friends.push(...data.relatedUsers);
  if (friends.length) friends.sort((first, last) => first.user._id <= last.user._id ? -1 : 1)

  return (<>
    <h2>Related Users</h2>
    <section className="card-container">
      {loading ? <h3 className="loading">Loading...</h3> : friends.map((user) =>
        <RelatedUser key={user.user._id} user={user} />
      )}
    </section>
  </>)
}