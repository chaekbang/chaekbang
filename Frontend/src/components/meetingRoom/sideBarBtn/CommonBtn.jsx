import React, { useContext } from 'react'
import { styled } from 'styled-components'
import COLORS from '../../../constants/colors'
import { BoardContext } from '../context/BoardContext'

function CommonBtn({ onClick, icon, numbering }) {
  const { whichBtn, setWhichBtn } = useContext(BoardContext)

  const handleClick = () => {
    onClick() // 먼저 props로 전달된 onClick 함수를 호출
    setWhichBtn(numbering) // 그 다음 setWhichBtn 함수를 호출
  }

  return (
    <div>
      <Btn onClick={handleClick}>
        <IconWrapper>
          <Icon icon={icon} />
        </IconWrapper>
      </Btn>
    </div>
  )
}

const Btn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 42.5px;
  height: 42.5px;
  background-color: ${COLORS.WHITE};
  border-radius: 50%;
  margin: 12px 0px;
`

const IconWrapper = styled.div`
  /* Add any specific styling for the icon wrapper here */
  margin-top: 2px;
`

const Icon = styled(({ icon }) => icon)`
  font-size: 24px;
  color: ${COLORS.BLACK};
`

export default CommonBtn