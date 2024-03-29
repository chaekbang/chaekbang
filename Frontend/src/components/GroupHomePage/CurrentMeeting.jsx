import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import COLORS from '../../constants/colors'
import { MdAlarmOn, MdAlarmOff } from 'react-icons/md'
import '../GroupHomePage/css/groupHomePageStyle.css'
import CONSOLE from '../../utils/consoleColors'
import { useNavigate } from 'react-router-dom'

const ACTIVATED = 0
const DEACTIVATED = 1

const NOTICE = [
  {
    icon: <MdAlarmOn className="alarm-icon" />,
    containerColor: '#73dae0',
    btnColor: COLORS.THEME_COLOR0,
    message: '현재 진행 중인 책방이 있습니다!',
    btnMessage: '바로 참여하기',
  },
  {
    icon: <MdAlarmOff className="alarm-icon" />,
    containerColor: '#a2afb7',
    btnColor: '#7b8489',
    message: '현재 진행 중인 책방이 없습니다.',
    btnMessage: '곧 만나요!',
  },
]

const CurrentMeeting = ({ currentMeetingInfo, meetings, groupId }) => {
  const [meetingId, setMeetingId] = useState(null)

  useEffect(() => {
    if (currentMeetingInfo.currentMeetingIndex != -1) {
      setMeetingId(meetings[currentMeetingInfo.currentMeetingIndex].id)
    }
  }, [currentMeetingInfo.currentMeetingIndex])

  function joinMeeting() {
    if (meetingId) {
      window.location.href = `/meeting?groupId=${groupId}&meetingId=${meetingId}`
    }
  }

  const noticeOption = currentMeetingInfo.isActivatedMeetingExist
    ? NOTICE[ACTIVATED]
    : NOTICE[DEACTIVATED]
  return (
    <CurrentMeetingInfoContainer $color={noticeOption.containerColor}>
      {noticeOption.icon}
      <NoticeBox>{noticeOption.message}</NoticeBox>
      <Button $color={noticeOption.btnColor} onClick={joinMeeting}>
        {noticeOption.btnMessage}
      </Button>
    </CurrentMeetingInfoContainer>
  )
}

const CurrentMeetingInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: ${(props) => props.$color};
  border-radius: 1rem;
  text-align: center;
  margin: 2.5rem auto;
  padding: 0.5rem;
`

const NoticeBox = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 4rem;
`

const Button = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.$color};
  height: 2rem;
  border-radius: 0.5rem;
  padding: 0.5rem;
  margin-right: 1rem;
  cursor: pointer;
`

export default CurrentMeeting
