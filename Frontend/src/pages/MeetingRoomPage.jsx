import React, { useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { styled } from 'styled-components'
import SideBar from '../components/meetingRoom/SideBar'
import TopSpace from '../components/meetingRoom/screen/TopSpace'
import ScreenShot from '../components/meetingRoom/screen/ScreenShot'
import BottomBtns from '../components/meetingRoom/screen/BottomBtns'
import { BoardContext } from '../components/meetingRoom/context/BoardContext'
import COLORS from '../constants/colors'
import CONSOLE from '../utils/consoleColors'
import { convertTime } from '../components/meetingRoom/sideBoard/timer/convertTime'
import { CompatClient } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

function MeetingRoomPage({
  meetingInfoState,
  videoOption,
  toggleMic,
  toggleCam,
}) {
  CONSOLE.reRender('MeetingRoomPage rendered!')
  const [meetingInfo, setMeetingInfo] = meetingInfoState
  const [whichBtn, setWhichBtn] = useState(0)
  const [client, setClient] = useState(null)
  const [currentTime, setCurrentTime] = useState([])

  // MeetingRoom에 들어오거나 Publisher가 변경되었을 때 접속자 본인 영상 publish
  useEffect(() => {
    // 이전 접속자 본인의 publisher가 있다면
    if (meetingInfo.prevPublisher) {
      meetingInfo.session.unpublish(meetingInfo.prevPublisher)
    }
    meetingInfo.session.publish(meetingInfo.publisher)
    setMeetingInfo((prevState) => ({
      ...prevState,
      prevPublisher: meetingInfo.publisher,
    }))
  }, [meetingInfo.publisher])

  //socket 연결
  useEffect(() => {
    // STOMP 클라이언트 초기화
    const stompClient = new CompatClient()
    const socket = new SockJS('https://dev.chaekbang.xyz')

    stompClient.webSocketFactory = () => socket

    stompClient.onConnect = () => {
      console.log('Connected to WebSocket')

      client.subscribe('/meeting/timer/currentTime', (message) => {
        const getTime = JSON.parse(message.body)
        setCurrentTime(convertTime(getTime))

        // console.log('Received message:', currentTime)
      })

      // 이모지 가져오는 구독 > confilct 날거임
      client.subscribe('/meeting/emoji', (message) => {
        const getEmoji = JSON.parse(message.body)
        console.log('Received message:', getEmoji)
      })
    }

    stompClient.activate()

    setClient(stompClient)

    return () => {
      if (stompClient) {
        stompClient.deactivate()
      }
    }
  }, [])

  return (
    <BoardContext.Provider
      value={{
        whichBtn,
        setWhichBtn,
        meetingInfoState,
        videoOption,
        toggleMic,
        toggleCam,
        client,
        currentTime,
      }}
    >
      <Container>
        {/* 오른쪽 사이드 바는 상시 고정 */}
        <SideBarContainer>
          <SideBar></SideBar>
        </SideBarContainer>
        {/* 왼쪽 스크린은 크게 위 여유공간 / 스크린 / 하단 버튼으로 세부분으로 나뉜다 */}
        <ScreenContainer>
          <TopSpace></TopSpace>
          {/* 스크린을 보여주는 컴포넌트 > 그리드가 있어야함 */}
          <ScreenShot></ScreenShot>
          <BottomBtns></BottomBtns>
        </ScreenContainer>
      </Container>
    </BoardContext.Provider>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: row-reverse;
  background-color: ${COLORS.BLACK};
`
const SideBarContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
`

const ScreenContainer = styled.div`
  display: flex;
  flex-grow: 1;
  flex-shrink: 0;
  flex-direction: column;
  transition: all 0.5s ease;
`

export default MeetingRoomPage
