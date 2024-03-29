import React, { useState } from 'react'
import styled from 'styled-components'
import MainLayout from '../components/Layout/MainLayout'
import GroupInfoInput from '../components/GroupCreatePage/GroupInfoInput'
import GroupTagInput from '../components/GroupCreatePage/GroupTagInput'
import GroupImageInput from '../components/GroupCreatePage/GroupImageInput'
import { useNavigate } from 'react-router-dom'
import postGroup from '../api/groupCreateApi'

const Container = styled.div`
  margin-left: 50px;
  margin-right: 50px;
`

const HrTag = styled.hr`
  background: #e3e3e3;
  height: 1px;
  border: 0;
`

const TextContainer = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
`

const GrayText = styled.div`
  font-size: 15px;
  color: #7b7b7b;
`

const RedText = styled.div`
  margin-right: 20px;
  font-size: 15px;
  color: #ff0000;
`

const GreenText = styled.div`
  margin-right: 20px;
  font-size: 15px;
  color: #088a08;
`

const CreateButton = styled.div`
  background-color: #00bbc6;
  padding-left: 20px;
  padding-right: 20px;
  height: 40px;
  color: white;
  text-align: center;
  line-height: 40px;
  font-size: 20px;
  font-weight: 500;
  border-radius: 15px;
  cursor: pointer;
`

const NotCreateButton = styled.div`
  background-color: #93c5c8;
  padding-left: 20px;
  padding-right: 20px;
  height: 40px;
  color: #f1f1f1;
  text-align: center;
  line-height: 40px;
  font-size: 20px;
  font-weight: 500;
  border-radius: 15px;
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  cursor: pointer;
`

const Message = styled.div`
  color: #ff2020;
  font-size: 18px;
  padding-left: 10px;
  padding-top: 3px;
`

const MessageContainer = styled.div`
  display: flex;
  justify-content: center;
`

function GroupCreatePage() {
  const navigate = useNavigate()

  const contentPlaceholder =
    '[모임의 이름을 입력하세요] \n [장르/주제] \b [참여 방법] [참여 절차] \n [주요 활동 내용] \n [온라인/오프라인 여부] \n [참여 혜택] \n [할인 혜택/독서 관련 자료 제공/특별 이벤트 액세스] \n [날짜] \n [연락처/이메일].'

  const [inputs, setInputs] = useState({
    title: '',
    detail: '',
    tagNames: [],
  })

  const [errorMessages, setMessages] = useState({
    titleMessage: '※ 모임 이름을 입력해주세요.',
    detailMessage: '※ 모임 소개를 입력해주세요.',
  })

  const [isValid, setValid] = useState(false)
  const [image, setImage] = useState(null)
  const [imageMessage, setImageMessage] = useState('')
  const [requestErrorMessage, setRequestErrorMessage] = useState('')

  const { title, detail, tagNames } = inputs
  const { titleMessage, detailMessage } = errorMessages

  const onChangeTitle = (e) => {
    const { value, name } = e.target
    if (value.length == 0) {
      setMessages({
        ...errorMessages,
        ['titleMessage']: '※ 모임 이름을 입력해주세요.',
      })
      setValid(false)
    } else if (value.length > 30) {
      setMessages({
        ...errorMessages,
        ['titleMessage']: '※ 모임 이름을 30자 이내로 입력해주세요.',
      })
      setValid(false)
    } else {
      setMessages({
        ...errorMessages,
        ['titleMessage']: '',
      })
      if (detailMessage === '') {
        setValid(true)
      }
    }
    setInputs({
      ...inputs,
      [name]: value,
    })
  }

  const onChangeDetail = (e) => {
    const { value, name } = e.target
    if (value.length == 0) {
      setMessages({
        ...errorMessages,
        ['detailMessage']: '※ 모임 소개를 입력해주세요.',
      })
      setValid(false)
    } else {
      setMessages({
        ...errorMessages,
        ['detailMessage']: '',
      })
      if (titleMessage === '') {
        setValid(true)
      }
    }
    setInputs({
      ...inputs,
      [name]: value,
    })
  }

  const createGroup = async () => {
    const groupData = new FormData()
    groupData.append('title', inputs.title)
    groupData.append('detail', inputs.detail)
    groupData.append('tagNames', [inputs.tagNames])
    if (image !== null) {
      groupData.append('image', image)
    }

    try {
      await postGroup(groupData)
      navigate('/mygroup')
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setRequestErrorMessage(error.response.data.message)
      } else if (error.response && error.response.status === 401) {
        navigate('/login')
      } else {
        navigate('/error')
      }
    }
  }
  return (
    <MainLayout>
      <Container>
        <GroupInfoInput
          errorMessage={titleMessage}
          info={'모임 이름'}
          placeholder={'모임 이름을 30자 이내로 입력해주세요.'}
          height={40}
          onChange={onChangeTitle}
          name={'title'}
        ></GroupInfoInput>
        <HrTag></HrTag>
        <GroupInfoInput
          info={'모임 소개'}
          errorMessage={detailMessage}
          placeholder={contentPlaceholder}
          height={320}
          onChange={onChangeDetail}
          name={'detail'}
        ></GroupInfoInput>
        <HrTag></HrTag>
        <GroupImageInput
          info={'모임 배경 사진'}
          imageMessage={imageMessage}
          setImageMessage={setImageMessage}
          setImage={setImage}
        ></GroupImageInput>
        <HrTag></HrTag>
        <GroupTagInput
          setInputs={setInputs}
          inputs={inputs}
          tagNames={tagNames}
        ></GroupTagInput>

        <MessageContainer>
          <Message>
            {requestErrorMessage ? '※ ' + requestErrorMessage : ''}
          </Message>
        </MessageContainer>
        <TextContainer>
          {isValid ? (
            <GreenText>&#10003;</GreenText>
          ) : (
            <RedText>&#10003;</RedText>
          )}

          <GrayText>
            바로 등록하시겠습니까? 모임 설정 페이지에서 모임 정보를 수정할 수
            있습니다.
          </GrayText>
        </TextContainer>

        <ButtonContainer>
          {isValid ? (
            <CreateButton onClick={createGroup}>모임 만들기</CreateButton>
          ) : (
            <NotCreateButton>모임 만들기</NotCreateButton>
          )}
        </ButtonContainer>
      </Container>
    </MainLayout>
  )
}

export default GroupCreatePage
