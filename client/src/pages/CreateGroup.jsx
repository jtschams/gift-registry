import React from 'react';
import { useState } from 'react';
import { useMutation } from '@apollo/client';

import { CREATE_GROUP } from '../utils/mutations';

export default function CreateGroup() {
  const [ groupFormState, setGroupFormState ] = useState({
    familyName: '',
    nickname: ''
  });

  const [createGroup] = useMutation(CREATE_GROUP);

  const handleCreateGroup = async (event) => {
    event.preventDefault();
    const {data} = await createGroup({variables: {...groupFormState}});
    const familyId = data.addFamily._id;
    window.location.assign(`/family/${familyId}`);
  }

  const handleGroupFormChange = (event) => {
    const { name, value } = event.target;

    setGroupFormState({
      ...groupFormState,
      [name]: value
    })
  }

  return (<>
    <h1>Create New Group</h1>
    <article>
      <form id="new-group-form" onSubmit={handleCreateGroup}>
        <div className="form-group">
          <label htmlFor="family-name">Enter a name for this group:</label>
          <input
            id="family-name"
            className="family-input"
            placeholder="Group Name"
            name="familyName"
            type="text"
            value={groupFormState.familyName}
            onChange={handleGroupFormChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="nickname">Enter your nickname in this group:</label>
          <input
            id="nickname"
            className="family-input"
            placeholder="Nickname(Optional)"
            name="nickname"
            type="text"
            value={groupFormState.nickname}
            onChange={handleGroupFormChange}
          />
        </div>
        <button type="submit">Save Group</button>
      </form>
    </article>
  </>)
}