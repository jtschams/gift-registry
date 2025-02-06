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

  return (
    <form onSubmit={handleCreateGroup}>
      <div className="form-group">
        <label htmlFor="family-name">What is the name of this Group?</label>
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
        <label htmlFor="nickname">What name are you known by in this group?</label>
        <input
          id="nickname"
          className="family-input"
          placeholder="Nickname"
          name="nickname"
          type="text"
          value={groupFormState.nickname}
          onChange={handleGroupFormChange}
        />
      </div>
      <button type="submit">Create New Group</button>
    </form>
  )
}