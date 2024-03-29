import React from 'react'
import styled from 'styled-components'
import MemberInfo from './MemberInfo'
import { GROUP_DETAIL_CONTAINER_PADDING } from './constant/groupDetailConstant'

const GroupMembersInfo = ({ users, leader }) => {
  const userOfLeader = users.filter((user) => user.id === leader.id)[0]

  const usersExceptLeader = users.filter((user) => user.id !== leader.id)

  return (
    <GroupMembersInfoContainer>
      <h1>책방 주인</h1>
      <MemberInfo member={userOfLeader} />
      <br></br>
      <br></br>
      <br></br>
      <h1>책방 손님</h1>
      <MembersContainer>
        {usersExceptLeader.map((user, index) => {
          return <MemberInfo key={index} member={user} />
        })}
      </MembersContainer>
    </GroupMembersInfoContainer>
  )
}

const GroupMembersInfoContainer = styled.div`
  padding: ${GROUP_DETAIL_CONTAINER_PADDING};
`

const MembersContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 1rem;
`

export default GroupMembersInfo
