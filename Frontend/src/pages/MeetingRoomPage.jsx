import React, { useEffect, useState, useRef } from 'react'
import { styled } from 'styled-components'
import SideBar from '../components/meetingRoom/SideBar'
import TopSpace from '../components/meetingRoom/screen/TopSpace'
import ScreenShot from '../components/meetingRoom/screen/ScreenShot'
import BottomBtns from '../components/meetingRoom/screen/BottomBtns'
import { BoardContext } from '../components/meetingRoom/context/BoardContext'
import { TimerContext } from '../components/meetingRoom/context/TimerContext'

function MeetingRoomPage() {
  //BoardContext
  const [whichBtn, setWhichBtn] = useState(0)

  //TimerContext
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef(null)

  return (
    <BoardContext.Provider value={{ whichBtn, setWhichBtn }}>
      <TimerContext.Provider
        value={{
          isRunning,
          setIsRunning,
          intervalRef,
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
      </TimerContext.Provider>
    </BoardContext.Provider>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: row-reverse;
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
`

export default MeetingRoomPage