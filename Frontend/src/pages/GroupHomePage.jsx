import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import GroupHomeProfile from '../components/GroupHomePage/GroupHomeProfile'
import GroupHomeDetail from '../components/GroupHomePage/GroupHomeDetail'
import MainLayout from '../components/Layout/MainLayout'
import { groupApi } from '../components/GroupDetailPage/api/groupApi'
import ServerError from '../components/common/ServerError'
import { getGroupDetail, getGroupMembers } from '../api/groupDetailApi'
import { isUserNotInGroup } from '../utils/userUtil'
import LoadingItem from '../components/common/LoadingItem'

const menuForMember = ['상세 정보', '인원 정보', '책방 정보']

const GroupHomePage = () => {
  const navigate = useNavigate()

  const { groupId } = useParams()
  const loggedInUser = useSelector((state) => {
    return state.rootReducer.loginReducer.user
  })

  const [groupInfo, setGroupInfo] = useState(null)
  const [groupMembers, setGroupMembers] = useState(null)

  useEffect(() => {
    getGroupDetail(
      groupId,
      ({ data }) => {
        setGroupInfo(data.data)
      },
      (error) => {
        if (error.response && error.response.status === 401) {
          navigate('/login')
        } else {
          navigate('/error')
        }
      },
    )
    getGroupMembers(
      groupId,
      ({ data }) => {
        if (isUserNotInGroup(data.data.users, loggedInUser)) {
          alert('모임에 가입된 사용자만 들어올 수 있습니다.')
          navigate('/')
        }
        setGroupMembers(data.data)
      },
      (error) => {
        if (error.response && error.response.status === 401) {
          navigate('/login')
        } else {
          navigate('/error')
        }
      },
    )
  }, [])

  if (!groupInfo || !groupMembers) {
    return <LoadingItem></LoadingItem>
  }
  const groupMemberCount = groupMembers.length

  return (
    <MainLayout>
      <div className="container">
        <GroupHomeProfile
          group={groupInfo}
          membersInfo={groupMembers}
          isLeader={loggedInUser.userId === groupMembers.leaderId}
        />
        <GroupHomeDetail
          group={groupInfo}
          membersInfo={groupMembers}
          menu={menuForMember}
        />
      </div>
    </MainLayout>
  )
}

export default GroupHomePage
